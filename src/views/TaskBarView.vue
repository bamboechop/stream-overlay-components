<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :programs="activeApplications" />
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

useEventStreamComposable();
useTwitchStreamInfoComposable();
</script>
