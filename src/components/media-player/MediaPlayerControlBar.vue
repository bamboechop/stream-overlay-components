<template>
  <div class="program-control-bar">
    <MediaPlayerControls />
    <MediaPlayerVolumeControl />
  </div>
</template>

<script lang="ts" setup>
import MediaPlayerControls from '@/components/media-player/MediaPlayerControls.vue';
import MediaPlayerVolumeControl from '@/components/media-player/MediaPlayerVolumeControl.vue';
</script>

<style lang="scss" scoped>
.program-control-bar {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}
</style>
