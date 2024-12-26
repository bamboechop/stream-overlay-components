<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/pokemon-community-game/modern/PokemonCommunityGame.vue';
import Windows95Theme from '@/components/pokemon-community-game/windows95/PokemonCommunityGame.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';

const { theme } = useSearchParamsComposable();
</script>
