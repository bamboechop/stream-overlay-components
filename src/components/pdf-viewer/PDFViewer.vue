<template>
  <WindowFrame
    :active="active"
    class="pdf-viewer-window"
    title="PDF Viewer">
    <div
      class="pdf-viewer"
      :class="{ 'pdf-viewer--placeholder': !url }">
      <template v-if="url">
        <PdfEmbed
          :source="decodeURIComponent(url)"
          @error="handleError" />
      </template>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import PdfEmbed from 'vue-pdf-embed';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';

defineProps<{ active?: boolean }>();

const { url } = useSearchParamsComposable();

function handleError(error: Error) {
  console.error('PDF loading error:', error);
}
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.pdf-viewer {
  border-radius: $window-frame-border-radius - $window-frame-padding;
  height: calc(100vh - 38px); // subtract the height of the .window-frame__bottom-bar
  overflow: auto;
  scrollbar-width: none;  // Hide scrollbar for Firefox

  &::-webkit-scrollbar { // Hide scrollbar for Chrome, Safari and Opera
    display: none;
  }
}

.pdf-viewer--placeholder {
  background-image: url('/modern/pdf-viewer/placeholder.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.pdf-viewer-window {
  width: 100%;
}
</style>
