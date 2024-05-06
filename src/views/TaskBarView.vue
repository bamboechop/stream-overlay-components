<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :programs="programs" />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme :programs="programs" />
  </template>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useUrlSearchParams } from '@vueuse/core';
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import Windows95Theme from '@/components/task-bar/windows95/TaskBar.vue';
import type { TTheme } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useTwitchStore } from '@/stores/twitch.store';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;

const themePath = theme.replace('-', '');

const store = useTwitchStore();

const mediaPlayerIcon = ref(`/programs/${themePath}/player.icon.png`);

const programs = computed<IProgram[]>(() => ([
  {
    active: false,
    iconPath: mediaPlayerIcon.value,
    text: 'Media Player',
  },
  {
    active: true,
    iconPath: `/programs/${themePath}/chat.icon.png`,
    text: 'Chat',
  },
  {
    active: false,
    iconPath: `/programs/${themePath}/pokemon-community-game.icon.png`,
    text: 'Pokémon Community Game',
  },
]));

useTwitchStreamInfo();

watch(() => store.category, (newCategory) => {
  console.log(newCategory);
  if (theme === 'windows-95') {
    return;
  }
  switch (newCategory) {
    case 'Bloons TD 6':
      mediaPlayerIcon.value = `/programs/${themePath}/bloons-td-6.icon.png`;
      break;
    case 'Brotato':
      mediaPlayerIcon.value = `/programs/${themePath}/brotato.icon.png`;
      break;
    case 'Cities: Skylines II':
      mediaPlayerIcon.value = `/programs/${themePath}/cities-skylines-ii.icon.png`;
      break;
    case 'Cult of the Lamb':
      mediaPlayerIcon.value = `/programs/${themePath}/cult-of-the-lamb.icon.png`;
      break;
    case 'Dorfromantik':
      mediaPlayerIcon.value = `/programs/${themePath}/dorfromantik.icon.png`;
      break;
    case 'Deep Rock Galactic: Survivor':
      mediaPlayerIcon.value = `/programs/${themePath}/drg-survivor.icon.png`;
      break;
    case 'Golf It!':
      mediaPlayerIcon.value = `/programs/${themePath}/golf-it.icon.png`;
      break;
    case 'Minecraft':
      mediaPlayerIcon.value = `/programs/${themePath}/minecraft.icon.png`;
      break;
    case 'Project Zomboid':
      mediaPlayerIcon.value = `/programs/${themePath}/project-zomboid.icon.png`;
      break;
    case 'Pokémon Trading Card Game Live':
      mediaPlayerIcon.value = `/programs/${themePath}/ptcgl.icon.png`;
      break;
    case 'shapez':
      mediaPlayerIcon.value = `/programs/${themePath}/shapez.icon.png`;
      break;
    case 'Stray':
      mediaPlayerIcon.value = `/programs/${themePath}/stray.icon.png`;
      break;
    case 'Trackmania':
      mediaPlayerIcon.value = `/programs/${themePath}/trackmania.icon.png`;
      break;
    case 'UNO':
      mediaPlayerIcon.value = `/programs/${themePath}/uno.icon.png`;
      break;
    case 'URBO: Dream One':
      mediaPlayerIcon.value = `/programs/${themePath}/urbo.icon.png`;
      break;
    case 'Just Chatting':
    case 'Media Player':
    default:
      mediaPlayerIcon.value = `/programs/${themePath}/player.icon.png`;
  }
});
</script>
