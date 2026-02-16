<template>
  <TaskBar :programs="activeApplications" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import TaskBar from '@/components/task-bar/modern/TaskBar.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useApplicationStore } from '@/stores/application.store';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

useEventStreamComposable();
useTwitchStreamInfoComposable();
</script>
