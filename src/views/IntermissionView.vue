<template>
  <section class="starting-soon-view">
    <template v-if="theme === 'modern'">
      <ModernTheme
        :active
        :mode />
    </template>
    <template v-if="theme === 'windows-95'"></template>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import ModernTheme from '@/components/intermission/modern/Intermission.vue';
import { useApplicationStore } from '@/stores/application.store';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const { mode, theme } = useSearchParamsComposable();

useEventStreamComposable();
useTwitchStreamInfoComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const modes = ['start', 'end', 'intermission'];

const active = computed(() => activeApplications.value.find(application => modes.includes(application.id))?.active);
</script>
