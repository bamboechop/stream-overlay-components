<template>
  <div class="webcam">
    <ProgramTitleBar
      icon-path="/programs/windows95/webcam.icon.png"
      title="Webcam" />
    <main class="webcam__main"></main>
    <ProgramBottomBar />
  </div>
</template>

<script lang="ts" setup>
import ProgramBottomBar from '@/components/general/windows95/ProgramBottomBar.vue';
import ProgramTitleBar from '@/components/general/windows95/ProgramTitleBar.vue';
</script>

<style lang="scss" scoped>
.webcam {
  background-color: #c3c3c3;
  border-bottom: 2px solid #000;
  border-left: 2px solid #efefef;
  border-right: 2px solid #000;
  border-top: 2px solid #efefef;
  display: grid;
  gap: 2px;
  grid-template-rows: 18px 1fr 20px;
  min-height: 100vh;
  padding: 2px;

  &__main {
    background-color: #dd00f5;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #7f7f7f;
    border-right: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
  }
}
</style>
