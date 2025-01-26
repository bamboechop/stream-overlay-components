import OBSWebSocket from 'obs-websocket-js';
import { onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import { useApplicationStore } from '@/stores/application.store';
import { useTwitchStore } from '@/stores/twitch.store';
import { useProgramInformationComposable } from '@/composables/program-information.composable';
import { useStreamStatusStore } from '@/stores/stream-status.store';

const obsSceneIdToProgramIdMapping: { [sceneId: number]: TProgramId } = {
  4: 'intermission',
  5: 'intermission',
  6: 'intermission',
  13: 'pcg',
  40: 'chat',
  41: 'media-player',
  51: 'webcam',
  69: 'pdf-viewer',
};

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
      // ignore chat, it only gets visible when a message is sent
      if (id !== 'chat' && visible && !activeApplications.value.find(application => application.id === id)) {
        addActiveApplication(programInformation.value[id as TProgramId]);
      } else if (!visible) {
        removeActiveApplication(id);
      }
    }
  }

  async function getSceneItems() {
    const { currentProgramSceneUuid: sceneUuid } = await obs.call('GetSceneList');
    const sceneItemList = await obs.call('GetSceneItemList', { sceneUuid });
    programs.value = {};
    for (const item of sceneItemList.sceneItems) {
      if (item.sourceName && obsSceneIdToProgramIdMapping[item.sceneItemId as number]) {
        programs.value[obsSceneIdToProgramIdMapping[item.sceneItemId as number]] = item.sceneItemEnabled as boolean;
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
  obs.on('SceneItemEnableStateChanged', (event) => {
    const { sceneItemId, sceneUuid } = event;
    if (sceneUuid === '01619e4f-63e9-468a-9d17-b0ce9bf9489f' && sceneItemId !== 41) {
      return; // ignore changes within the media player group, we only care about updates to the whole group
    }
    programs.value[obsSceneIdToProgramIdMapping[sceneItemId]] = event.sceneItemEnabled;
    updateProgramVisibility();
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
