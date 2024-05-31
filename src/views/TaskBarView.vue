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
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import Windows95Theme from '@/components/task-bar/windows95/TaskBar.vue';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useApplicationStore } from '@/stores/application.store';
import { useObsComposable } from '@/composables/obs.composable';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

useObsComposable();
useTwitchStreamInfo();
</script>
