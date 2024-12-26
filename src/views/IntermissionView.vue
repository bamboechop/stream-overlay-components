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
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import ModernTheme from '@/components/intermission/modern/Intermission.vue';
import { useApplicationStore } from '@/stores/application.store';

const { mode, theme } = useSearchParamsComposable();

useTwitchStreamInfo();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'intermission')?.active);
</script>
