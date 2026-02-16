<template>
  <section class="starting-soon-view">
    <Intermission
      :active
      :mode />
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import Intermission from '@/components/intermission/Intermission.vue';
import { useApplicationStore } from '@/stores/application.store';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const { mode } = useSearchParamsComposable();

useEventStreamComposable();
useTwitchStreamInfoComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const modes = ['start', 'end', 'intermission'];

const active = computed(() => activeApplications.value.find(application => modes.includes(application.id))?.active);
</script>
