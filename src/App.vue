<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useObsComposable } from '@/composables/obs.composable';

const { theme } = useSearchParamsComposable();

onMounted(async () => {
  document.documentElement.dataset.theme = theme.value;

  await useObsComposable();
});
</script>
