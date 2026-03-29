<template>
  <WindowFrame class="rounded-b-none rounded-tl-none w-max">
    <div class="items-end flex gap-4 h-full p-1 pt-0">
      <button class="items-center appearance-none bg-transparent border-none flex h-[44px] justify-center p-0 w-[44px]">
        <img
          alt="Start"
          class="aspect-square h-full w-full"
          src="/modern/task-bar/start-button.png" />
      </button>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
</script>
