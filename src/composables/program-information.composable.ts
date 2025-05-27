import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import { GAME_METADATA } from '@/common/constants/game-metadata.constant';

export function useProgramInformationComposable() {
  const { theme, themePath } = useSearchParamsComposable();

  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);

  const iconPath = computed(() => {
    if (theme.value !== 'modern') {
      return `/programs/${themePath}/player.icon.png`;
    }
    const { iconPath } = GAME_METADATA[category.value] ?? null;

    if (!iconPath) {
      return `/programs/${themePath}/player.icon.png`;
    }

    return iconPath.replace('{themePath}', themePath);
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
