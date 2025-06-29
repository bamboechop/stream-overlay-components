import OBSWebSocket from 'obs-websocket-js';
import { onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import { useApplicationStore } from '@/stores/application.store';
import { useTwitchStore } from '@/stores/twitch.store';
import { useProgramInformationComposable } from '@/composables/program-information.composable';
import { useStreamStatusStore } from '@/stores/stream-status.store';

interface ISceneItemMapping {
  programId: TProgramId;
  sourceName?: string;
}

interface ISceneMapping {
  [sceneItemId: number]: ISceneItemMapping;
}

const obsSceneMappings: { [sceneUuid: string]: ISceneMapping } = {
  // Default mapping for all scenes
  '*': {
    40: { programId: 'chat' },
    19: { programId: 'bsky-posts' },
    41: { programId: 'media-player' },
    51: { programId: 'webcam' },
    69: { programId: 'pdf-viewer' },
  },
  '3cdbaeca-19a3-419e-b665-097a3298f557': { /// "Gleich gehts los" scene
    4: { programId: 'start' },
    15: { programId: 'chat' },
    19: { programId: 'bsky-posts' },
  },
  '55c662f0-2b05-4278-8ac3-f7bf9e8159d4': { // "Kurze Pause" scene
    5: { programId: 'intermission' },
    13: { programId: 'chat' },
    16: { programId: 'bsky-posts' },
  },
  '7bb22505-8353-471d-9e9a-de3cbdc4e1aa': { // "Ende" scene
    6: { programId: 'end' },
    12: { programId: 'schedule', sourceName: 'Schedule' },
    15: { programId: 'bsky-posts' },
  },
};

const obsAllowedSceneItemIds = [
  12, // Schedule
  13, // Chat "Kurze Pause"
  15, // Chat "Gleich gehts los"
  19, // Bluesky Posts
  40, // Chat default scene
  41, // Media Player
  51, // Webcam
  69, // PDF Viewer
];

export async function useObsComposable() {
  /*
   * needs to be before any async call otherwise Vue will show a warning in the console
   * [Vue warn]: onBeforeUnmount is called when there is no active component instance to be associated with.
   * Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(),
   * make sure to register lifecycle hooks before the first await statement.
   */
  onBeforeUnmount(async () => {
    await disconnectWebSocketConnection();
  });

  const programs = ref<{ [programName: string]: boolean }>({});

  const applicationStore = useApplicationStore();
  const { activeApplications } = storeToRefs(applicationStore);
  const {
    addActiveApplication,
    removeActiveApplication,
    removeActiveApplications,
    updateMediaPlayerApplicationIcon,
    ensureApplicationExists,
  } = applicationStore;

  const { iconPath, programInformation } = useProgramInformationComposable();

  const streamStatusStore = useStreamStatusStore();
  const { live } = storeToRefs(streamStatusStore);

  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);
  const { getAdSchedule } = twitchStore;

  const obs = new OBSWebSocket();
  await obs.connect(import.meta.env.VITE_OBS_WEBSOCKET_URL, import.meta.env.VITE_OBS_WEBSOCKET_PASSWORD);

  function updateProgramVisibility() {
    for (const [id, visible] of Object.entries(programs.value) as [TProgramId, boolean][]) {
      if (visible && !activeApplications.value.find(application => application.id === id)) {
        if (id === 'chat') {
          // For chat, ensure it exists but don't make it active
          ensureApplicationExists(programInformation.value[id as TProgramId]);
        } else {
          addActiveApplication(programInformation.value[id as TProgramId]);
        }
      } else if (!visible) {
        // Check if the program being hidden is currently active
        const currentlyActive = activeApplications.value.find(app => app.active);
        const isHidingActiveProgram = currentlyActive && currentlyActive.id === id;

        removeActiveApplication(id);

        // If we're hiding the active program, set the last non-chat program as active
        if (isHidingActiveProgram && activeApplications.value.length > 0) {
          // Find the last non-chat program in the array
          const lastNonChatProgram = activeApplications.value.filter(application => application.id !== 'chat').pop();

          if (lastNonChatProgram) {
            lastNonChatProgram.active = true;
          }
        }
      }
    }
  }

  async function getSceneItems() {
    const { currentProgramSceneUuid: sceneUuid } = await obs.call('GetSceneList');
    const sceneItemList = await obs.call('GetSceneItemList', { sceneUuid });
    programs.value = {};

    // Get the scene-specific mapping or fall back to the default mapping
    const sceneMapping = obsSceneMappings[sceneUuid] || obsSceneMappings['*'];

    for (const item of sceneItemList.sceneItems) {
      const mapping = sceneMapping[item.sceneItemId as number];
      if (mapping) {
        // If sourceName is specified in the mapping, verify it matches
        if (!mapping.sourceName || mapping.sourceName === item.sourceName) {
          programs.value[mapping.programId] = item.sceneItemEnabled as boolean;
        }
      }
    }

    // wait for 100ms before updating the visibility, otherwise the active window isn't getting highlighted when switching scenes
    window.setTimeout(() => {
      updateProgramVisibility();
    }, 100);
  }

  // handle scene switches
  obs.on('CurrentProgramSceneChanged', async () => {
    removeActiveApplications();
    await getSceneItems();
  });

  // handle source visibility changes
  obs.on('SceneItemEnableStateChanged', async (event) => {
    const { sceneItemId } = event;
    if (!obsAllowedSceneItemIds.includes(sceneItemId)) {
      return;
    }
    const { currentProgramSceneUuid: sceneUuid } = await obs.call('GetSceneList');
    const sceneMapping = obsSceneMappings[sceneUuid] || obsSceneMappings['*'];
    const mapping = sceneMapping[sceneItemId];
    if (mapping) {
      programs.value[mapping.programId] = event.sceneItemEnabled;
      updateProgramVisibility();
    }
  });

  /**
   * Handles stream state changes (going live / offline).
   * @param {object} event - The event object.
   * @param {boolean} event.outputActive - Indicates if the output is active.
   * @param {string} event.outputState - The state of the output.
   * Possible values: OBS_WEBSOCKET_OUTPUT_STARTING, OBS_WEBSOCKET_OUTPUT_STARTED, OBS_WEBSOCKET_OUTPUT_STOPPING, OBS_WEBSOCKET_OUTPUT_STOPPED.
   */
  obs.on('StreamStateChanged', async (event) => {
    live.value = event.outputActive;
    if (live.value) {
      // wait 10 minutes, this allows the pre-roll ad to be played and we receive an accurate value
      window.setTimeout(async () => {
        await getAdSchedule();
      }, 10 * 60 * 1000);
    }
  });

  async function disconnectWebSocketConnection() {
    await obs.disconnect();
  }

  window.addEventListener('beforeunload', async () => {
    await disconnectWebSocketConnection();
  });

  watch(category, (newCategory, oldCategory) => {
    if (oldCategory && newCategory !== oldCategory) {
      programInformation.value['media-player'].iconPath = iconPath.value;
      programInformation.value['media-player'].text = newCategory;
      updateMediaPlayerApplicationIcon('media-player');
    }
  }, {
    immediate: true,
  });

  await getSceneItems();
}
