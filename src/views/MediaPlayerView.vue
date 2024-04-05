<template>
  <section class="media-player-view">
    <ProgramTitleBar
      icon-path="/windows-95/player.icon.png"
      title="Media Player" />
    <ProgramButtonBar />
    <main class="media-player-view__player"></main>
    <MediaPlayerControlBar />
    <ProgramBottomBar />
  </section>
</template>

<script setup lang="ts">
import ProgramTitleBar from '@/components/general/ProgramTitleBar.vue';
import ProgramButtonBar from '@/components/general/ProgramButtonBar.vue';
import MediaPlayerControlBar from '@/components/media-player/MediaPlayerControlBar.vue';
import ProgramBottomBar from '@/components/general/ProgramBottomBar.vue';
</script>

<style lang="scss" scoped>
.media-player-view {
  background-color: #c3c3c3;
  border-bottom: 2px solid #000;
  border-left: 2px solid #efefef;
  border-right: 2px solid #000;
  border-top: 2px solid #efefef;
  display: grid;
  gap: 2px;
  grid-template-rows: 18px 18px 1fr 40px 20px;
  min-height: 100dvh;
  padding: 2px;

  * {
    font-family: 'Windows-95', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }

  &__player {
    background-color: #62f500;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #7f7f7f;
    border-right: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
  }
}
</style>
