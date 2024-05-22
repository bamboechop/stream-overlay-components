<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import ModernTheme from '@/components/pokemon-community-game/modern/PokemonCommunityGame.vue';
import Windows95Theme from '@/components/pokemon-community-game/windows95/PokemonCommunityGame.vue';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme, themePath } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { addActiveApplication, removeActiveApplication } = applicationStore;

onMounted(() => {
  addActiveApplication({
    active: false,
    iconPath: `/programs/${themePath}/pokemon-community-game.icon.png`,
    id: 'pcg',
    text: 'Pokémon Community Game',
  });

  window.addEventListener('beforeunload', () => {
    removeActiveApplication('pcg');
  });
});
</script>
