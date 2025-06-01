<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :active />
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import ModernTheme from '@/components/pdf-viewer/modern/PDFViewer.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'pdf-viewer')?.active);
</script>
