<template>
  <PDFViewer :active />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import PDFViewer from '@/components/pdf-viewer/PDFViewer.vue';
import { useApplicationStore } from '@/stores/application.store';

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'pdf-viewer')?.active);
</script>
