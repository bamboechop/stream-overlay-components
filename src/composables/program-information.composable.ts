import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useTwitchStore } from '@/stores/twitch.store';

export function useProgramInformationComposable() {
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
      case 'Lego & Brickbuilding':
        return `/programs/${themePath}/brickbuilding.icon.png`;
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
      case 'Supermarket Together':
        return `/programs/${themePath}/supermarket-together.icon.png`;
      case 'Trackmania':
        return `/programs/${themePath}/trackmania.icon.png`;
      case 'UNO':
        return `/programs/${themePath}/uno.icon.png`;
      case 'URBO: Dream One':
        return `/programs/${themePath}/urbo.icon.png`;
      case 'PDF Viewer':
        return `/programs/${themePath}/pdf-viewer.icon.png`;
      case 'Just Chatting':
      case 'Media Player':
      default:
        return `/programs/${themePath}/player.icon.png`;
    }
  });

  const programInformation = ref<Record<TProgramId, IProgram>>({
    'chat': {
      active: false,
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
    'pdf-viewer': {
      active: false,
      iconPath: `/programs/${themePath}/pdf-viewer.icon.png`,
      id: 'pdf-viewer',
      text: 'PDF Viewer',
    },
    'webcam': {
      active: false,
      iconPath: `/programs/${themePath}/webcam.icon.png`,
      id: 'webcam',
      text: 'Webcam',
    },
  });

  return {
    iconPath,
    programInformation,
  };
}
