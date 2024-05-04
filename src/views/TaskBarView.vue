<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :programs="programs" />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme :programs="programs" />
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useUrlSearchParams } from '@vueuse/core';
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import Windows95Theme from '@/components/task-bar/windows95/TaskBar.vue';
import type { TTheme } from '@/common/types/index.type';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;

const themePath = theme.replace('-', '');

// TODO Listen to twitch stream update event to get the currently selected game and update it in programs ref
const game = ref('');

const mediaPlayerIcon = computed(() => {
  if (theme === 'windows-95') {
    return `/programs/${themePath}/player.icon.png`;
  }
  switch (game.value) {
    default:
      return `/programs/${themePath}/player.icon.png`;
  }
});

const programs = ref<IProgram[]>([
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
]);
</script>
