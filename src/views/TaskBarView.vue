<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :programs="activeApplications" />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme :programs="activeApplications" />
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import Windows95Theme from '@/components/task-bar/windows95/TaskBar.vue';
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
