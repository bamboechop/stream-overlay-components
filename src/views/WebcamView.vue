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
const { activeProgramId } = storeToRefs(applicationStore);

const active = computed(() => activeProgramId.value === 'webcam');
</script>
