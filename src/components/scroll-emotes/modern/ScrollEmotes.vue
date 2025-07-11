<template>
  <ul
    ref="listRef"
    class="scroll-emotes">
    <li
      v-for="(emote, index) in [...EMOTES, ...EMOTES, ...EMOTES]"
      :key="`${emote.name}-${index}`"
      class="scroll-emote-container">
      <img
        :alt="emote.name"
        class="scroll-emote"
        :src="emote.url" />
      <template v-if="emote.new">
        <span class="scroll-emote-new">New</span>
      </template>
      <template v-if="emote.updated">
        <span class="scroll-emote-updated">Updated</span>
      </template>
      <span class="scroll-emote-name">{{ emote.name }}</span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { EMOTES } from '@/common/constants/emotes.constant';

const listRef = ref<HTMLElement>();

let animationId: number;
let translateX = 0;
let contentWidth = 0;
const speed = 1;

function animate() {
  if (!listRef.value) {
    return;
  }

  translateX -= speed;

  // Calculate the width of one complete set of emotes
  if (contentWidth === 0) {
    const children = listRef.value.children;
    const singleSetLength = EMOTES.length;
    let width = 0;

    for (let i = 0; i < singleSetLength; i++) {
      const child = children[i] as HTMLElement;
      if (child) {
        width += child.offsetWidth + 10; // 10px gap
      }
    }
    contentWidth = width;
  }

  // Reset position when we've scrolled exactly one complete set
  // This happens when all of the first set is completely off-screen
  if (Math.abs(translateX) >= contentWidth) {
    translateX = 0;
  }

  listRef.value.style.transform = `translateX(${translateX}px)`;
  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  animationId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style lang="scss" scoped>
.scroll-emotes {
  align-items: end;
  display: flex;
  flex-direction: row;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  will-change: transform;
}

.scroll-emote {
  aspect-ratio: 1 / 1;
  width: 128px;
  flex-shrink: 0;
}

.scroll-emote-new,
.scroll-emote-updated {
  color: #fff;
  font-weight: 900;
  font-size: 12px;
  padding: 4px 8px;
  position: absolute;
  right: 0;
  text-shadow: #000 1px 0 10px;
  text-transform: uppercase;
  transform: rotate(30deg);
  z-index: 1;
}

.scroll-emote-new {
  background-color: #c91c1c;
  top: 0;
}

.scroll-emote-updated {
  background-color: #1c53c9;
  top: 10px;
}

.scroll-emote-container {
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
}

.scroll-emote-name {
  background-color: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  text-align: center;
}
</style>
