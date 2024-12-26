<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :active />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import ModernTheme from '@/components/pokemon-community-game/modern/PokemonCommunityGame.vue';
import Windows95Theme from '@/components/pokemon-community-game/windows95/PokemonCommunityGame.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'pcg')?.active);
</script>
