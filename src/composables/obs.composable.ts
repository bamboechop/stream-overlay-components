import OBSWebSocket from 'obs-websocket-js';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import { useApplicationStore } from '@/stores/application.store';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useTwitchStore } from '@/stores/twitch.store';

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

  const { theme, themePath } = useSearchParamsComposable();

  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);

  const iconPath = computed(() => {
    if (theme.value !== 'modern') {
      return `/programs/${themePath}/player.icon.png`;
    }

    switch (category.value) {
      case 'Bloons TD 6':
        return `/programs/${themePath}/bloons-td-6.icon.png`;
      case 'Brotato':
        return `/programs/${themePath}/brotato.icon.png`;
      case 'Cities: Skylines II':
        return `/programs/${themePath}/cities-skylines-ii.icon.png`;
      case 'Cult of the Lamb':
        return `/programs/${themePath}/cult-of-the-lamb.icon.png`;
      case 'Dorfromantik':
        return `/programs/${themePath}/dorfromantik.icon.png`;
      case 'Deep Rock Galactic: Survivor':
        return `/programs/${themePath}/drg-survivor.icon.png`;
      case 'Golf It!':
        return `/programs/${themePath}/golf-it.icon.png`;
      case 'Horizon Zero Dawn Remastered':
        return `/programs/${themePath}/horizon-zero-dawn-remastered.icon.png`;
      case 'Minecraft':
        return `/programs/${themePath}/minecraft.icon.png`;
      case 'Mini Metro':
        return `/programs/${themePath}/mini-metro.icon.png`;
      case 'Mini Motorways':
        return `/programs/${themePath}/mini-motorways.icon.png`;
      case 'Project Zomboid':
        return `/programs/${themePath}/project-zomboid.icon.png`;
      case 'Pokémon Trading Card Game Live':
        return `/programs/${themePath}/ptcgl.icon.png`;
      case 'shapez':
        return `/programs/${themePath}/shapez.icon.png`;
      case 'Spec Ops: The Line':
        return `/programs/${themePath}/spec-ops.icon.png`;
      case 'Stray':
        return `/programs/${themePath}/stray.icon.png`;
      case 'Trackmania':
        return `/programs/${themePath}/trackmania.icon.png`;
      case 'UNO':
        return `/programs/${themePath}/uno.icon.png`;
      case 'URBO: Dream One':
        return `/programs/${themePath}/urbo.icon.png`;
      case 'Just Chatting':
      case 'Media Player':
      default:
        return `/programs/${themePath}/player.icon.png`;
    }
  });

  const programInformation = ref<Record<TProgramId, IProgram>>({
    'chat': {
      active: true,
      iconPath: `/programs/${themePath}/chat.icon.png`,
      id: 'chat',
      text: 'Chat',
    },
    'intermission': {
      active: false,
      iconPath: `/programs/${themePath}/intermission.icon.png`,
      id: 'intermission',
      text: 'Intermission',
    },
    'media-player': {
      active: false,
      iconPath: iconPath.value,
      id: 'media-player',
      text: category.value,
    },
    'pcg': {
      active: false,
      iconPath: `/programs/${themePath}/pokemon-community-game.icon.png`,
      id: 'pcg',
      text: 'Pokémon Community Game',
    },
    'webcam': {
      active: false,
      iconPath: `/programs/${themePath}/webcam.icon.png`,
      id: 'webcam',
      text: 'Webcam',
    },
  });

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
