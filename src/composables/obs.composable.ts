import OBSWebSocket from 'obs-websocket-js';
import { onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import { useApplicationStore } from '@/stores/application.store';
import { useTwitchStore } from '@/stores/twitch.store';
import { useProgramInformationComposable } from '@/composables/program-information.composable';

const obsSceneIdToProgramIdMapping: { [sceneId: number]: TProgramId } = {
  4: 'intermission',
  5: 'intermission',
  6: 'intermission',
  13: 'pcg',
  40: 'chat',
  41: 'media-player',
  51: 'webcam',
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
  const { addActiveApplication, removeActiveApplication, removeActiveApplications } = applicationStore;

  const { iconPath, programInformation } = useProgramInformationComposable();

  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);

  const obs = new OBSWebSocket();

  function updateProgramVisibility() {
    for (const [id, visible] of Object.entries(programs.value)) {
      if (visible && !activeApplications.value.find(application => application.id === id)) {
        addActiveApplication(programInformation.value[id as TProgramId]);
      } else if (!visible) {
        removeActiveApplication(id);
      }
    }
  }

  await obs.connect(import.meta.env.VITE_OBS_WEBSOCKET_URL, import.meta.env.VITE_OBS_WEBSOCKET_PASSWORD);

  async function getSceneItems() {
    const { currentProgramSceneUuid: sceneUuid } = await obs.call('GetSceneList');
    const sceneItemList = await obs.call('GetSceneItemList', { sceneUuid });
    programs.value = {};
    for (const item of sceneItemList.sceneItems) {
      if (item.sourceName && obsSceneIdToProgramIdMapping[item.sceneItemId as number]) {
        programs.value[obsSceneIdToProgramIdMapping[item.sceneItemId as number]] = item.sceneItemEnabled as boolean;
      }
    }
    updateProgramVisibility();
  }

  await getSceneItems();

  // handle scene switches
  obs.on('CurrentProgramSceneChanged', async () => {
    removeActiveApplications();
    await getSceneItems();
  });

  // handle source visibility changes
  obs.on('SceneItemEnableStateChanged', (event) => {
    programs.value[obsSceneIdToProgramIdMapping[event.sceneItemId]] = event.sceneItemEnabled;
    updateProgramVisibility();
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
    }
  }, {
    immediate: true,
  });
}
