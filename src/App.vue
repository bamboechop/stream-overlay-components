<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSearchParamsComposable } from '@/composables/theme.composable';

const { theme } = useSearchParamsComposable();

onMounted(() => {
  document.documentElement.dataset.theme = theme.value;
});
</script>
