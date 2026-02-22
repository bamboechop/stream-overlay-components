import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { TProgramId } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import { GAME_METADATA } from '@/common/constants/game-metadata.constant';

export function useProgramInformationComposable() {
  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);

  const iconPath = computed(() => {
    const { iconPath } = GAME_METADATA[category.value] ?? { iconPath: null };

    if (!iconPath) {
      return `/modern/programs/player.icon.png`;
    }

    return iconPath;
  });

  const programInformation = ref<Record<TProgramId, IProgram>>({
    'bsky-posts': {
      active: false,
      iconPath: `/modern/programs/bsky.icon.png`,
      id: 'bsky-posts',
      text: 'Neueste Bluesky Beiträge',
    },
    'chat': {
      active: false,
      iconPath: `/modern/programs/chat.icon.png`,
      id: 'chat',
      text: 'Chat',
    },
    'end': {
      active: false,
      iconPath: `/modern/programs/end.icon.png`,
      id: 'end',
      text: 'Ende',
    },
    'intermission': {
      active: false,
      iconPath: `/modern/programs/intermission.icon.png`,
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
      iconPath: `/modern/programs/next-game.icon.png`,
      id: 'next-game',
      text: 'Nächstes Spiel',
    },
    'pdf-viewer': {
      active: false,
      iconPath: `/modern/programs/pdf-viewer.icon.png`,
      id: 'pdf-viewer',
      text: 'PDF Viewer',
    },
    'schedule': {
      active: false,
      iconPath: `/modern/programs/schedule.icon.png`,
      id: 'schedule',
      text: 'Streamplan',
    },
    'start': {
      active: false,
      iconPath: `/modern/programs/start.icon.png`,
      id: 'start',
      text: 'Start',
    },
    'webcam': {
      active: false,
      iconPath: `/modern/programs/webcam.icon.png`,
      id: 'webcam',
      text: 'Webcam',
    },
  });

  return {
    iconPath,
    programInformation,
  };
}
