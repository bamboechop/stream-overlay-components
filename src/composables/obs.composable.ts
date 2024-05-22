import OBSWebSocket from 'obs-websocket-js';
import { computed, ref, watch } from 'vue';
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

  await obs.connect('ws://localhost:4455', 'AXZoGMtV3txpUYDc');

  async function getSceneItems(resetPrograms = false) {
    const { currentProgramSceneUuid: sceneUuid } = await obs.call('GetSceneList');
    const sceneItemList = await obs.call('GetSceneItemList', { sceneUuid });
    programs.value = {};
    for (const item of sceneItemList.sceneItems) {
      if (item.sourceName && obsSceneIdToProgramIdMapping[item.sceneItemId as number]) {
        programs.value[obsSceneIdToProgramIdMapping[item.sceneItemId as number]] = item.sceneItemEnabled as boolean;
      }
    }
  }

  await getSceneItems();

  // handle scene switches
  obs.on('CurrentProgramSceneChanged', async (event) => {
    removeActiveApplications();
    await getSceneItems(true);
  });

  // handle source visibility changes
  obs.on('SceneItemEnableStateChanged', (event) => {
    programs.value[obsSceneIdToProgramIdMapping[event.sceneItemId]] = event.sceneItemEnabled;
  });

  function updateProgramVisibility() {
    for (const [id, visible] of Object.entries(programs.value)) {
      if (visible && !activeApplications.value.find(application => application.id === id)) {
        addActiveApplication(programInformation.value[id as TProgramId]);
      } else if (!visible) {
        removeActiveApplication(id);
      }
    }
  }

  updateProgramVisibility();

  window.addEventListener('beforeunload', () => {
    obs.disconnect();
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
