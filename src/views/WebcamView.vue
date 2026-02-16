<template>
  <Webcam
    :active
    :aspect-ratio="webcamAspectRatio"
    :title />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import Webcam from '@/components/webcam/Webcam.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';

const { title, webcamAspectRatio } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'webcam')?.active);
</script>
