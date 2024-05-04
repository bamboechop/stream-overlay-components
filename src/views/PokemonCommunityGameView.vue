<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script lang="ts" setup>
import { useUrlSearchParams } from '@vueuse/core';
import ModernTheme from '@/components/pokemon-community-game/modern/PokemonCommunityGame.vue';
import Windows95Theme from '@/components/pokemon-community-game/windows95/PokemonCommunityGame.vue';
import type { TTheme } from '@/common/types/index.type';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;
</script>
