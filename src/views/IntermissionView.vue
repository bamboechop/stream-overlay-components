<template>
  <section class="starting-soon-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :mode="mode" />
    </template>
    <template v-if="theme === 'windows-95'"></template>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import ModernTheme from '@/components/intermission/modern/Intermission.vue';
import { useApplicationStore } from '@/stores/application.store';

const { mode, theme, themePath } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { addActiveApplication, removeActiveApplication } = applicationStore;

useTwitchStreamInfo();

onMounted(() => {
  addActiveApplication({
    active: false,
    iconPath: `/programs/${themePath}/intermission.icon.png`,
    id: 'intermission',
    text: 'Intermission',
  });

  window.addEventListener('beforeunload', () => {
    removeActiveApplication('intermission');
  });
});
</script>
