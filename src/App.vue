<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useObsComposable } from '@/composables/obs.composable';

onMounted(async () => {
  await useObsComposable();
});
</script>
