import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
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
    const { iconPath } = GAME_METADATA[category.value] ?? { iconPath: null };

    if (!iconPath) {
      return `/programs/${themePath}/player.icon.png`;
    }

    return iconPath.replace('{themePath}', themePath);
  });

  const programInformation = ref<Record<TProgramId, IProgram>>({
    'bsky-posts': {
      active: false,
      iconPath: `/programs/${themePath}/bsky.icon.png`,
      id: 'bsky-posts',
      text: 'Neueste Bluesky Beiträge',
    },
    'chat': {
      active: false,
      iconPath: `/programs/${themePath}/chat.icon.png`,
      id: 'chat',
      text: 'Chat',
    },
    'end': {
      active: false,
      iconPath: `/programs/${themePath}/end.icon.png`,
      id: 'end',
      text: 'Ende',
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
    'next-game': {
      active: false,
      iconPath: `/programs/${themePath}/next-game.icon.png`,
      id: 'next-game',
      text: 'Nächstes Spiel',
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
    'schedule': {
      active: false,
      iconPath: `/programs/${themePath}/schedule.icon.png`,
      id: 'schedule',
      text: 'Streamplan',
    },
    'start': {
      active: false,
      iconPath: `/programs/${themePath}/start.icon.png`,
      id: 'start',
      text: 'Start',
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
