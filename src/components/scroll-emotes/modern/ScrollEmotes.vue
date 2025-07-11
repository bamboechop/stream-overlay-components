<template>
  <ul
    ref="listRef"
    class="scroll-emotes">
    <!-- Triple buffer: 3 sets of emotes for seamless looping -->
    <template
      v-for="setIndex in 3"
      :key="`set-${setIndex}`">
      <li
        v-for="emote in emotes"
        :key="`${setIndex}-${emote.name}`"
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
    </template>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const emotes: { name: string; new?: boolean; updated?: boolean; url: string }[] = [
  {
    name: 'bamboe1Butter',
    url: '/emotes/bamboe1Butter.png',
  },
  {
    name: 'bamboe1Cool',
    url: '/emotes/bamboe1Cool.png',
  },
  {
    name: 'bamboe1Cozy',
    url: '/emotes/bamboe1Cozy.png',
  },
  {
    name: 'bamboe1Dead',
    updated: true,
    url: '/emotes/bamboe1Dead.png',
  },
  {
    name: 'bamboe1Derp',
    url: '/emotes/bamboe1Derp.png',
  },
  {
    name: 'bamboe1KEKW',
    url: '/emotes/bamboe1KEKW.png',
  },
  {
    name: 'bamboe1Love',
    url: '/emotes/bamboe1Love.png',
  },
  {
    name: 'bamboe1Lurk',
    url: '/emotes/bamboe1Lurk.gif',
  },
  {
    name: 'bamboe1Rage',
    url: '/emotes/bamboe1Rage.png',
  },
  {
    name: 'bamboe1Raid',
    url: '/emotes/bamboe1Raid.gif',
  },
  {
    name: 'bamboe1Sad',
    url: '/emotes/bamboe1Sad.png',
  },
  {
    name: 'bamboe1Scared',
    url: '/emotes/bamboe1Scared.png',
  },
  {
    name: 'bamboe1Sexy',
    url: '/emotes/bamboe1Sexy.png',
  },
  {
    name: 'bamboe1Bla',
    new: true,
    url: '/emotes/bamboe1Bla.gif',
  },
  {
    name: 'bamboe1Bonk',
    new: true,
    url: '/emotes/bamboe1Bonk.png',
  },
  {
    name: 'bamboe1Clap',
    new: true,
    url: '/emotes/bamboe1Clap.gif',
  },
  {
    name: 'bamboe1Drink',
    new: true,
    url: '/emotes/bamboe1Drink.png',
  },
  {
    name: 'bamboe1GG',
    new: true,
    url: '/emotes/bamboe1GG.png',
  },
  {
    name: 'bamboe1Innocent',
    new: true,
    url: '/emotes/bamboe1Innocent.gif',
  },
  {
    name: 'bamboe1Noted',
    new: true,
    url: '/emotes/bamboe1Noted.gif',
  },
  {
    name: 'bamboe1Party',
    new: true,
    url: '/emotes/bamboe1Party.gif',
  },
  {
    name: 'bamboe1Pat',
    new: true,
    url: '/emotes/bamboe1Pat.png',
  },
  {
    name: 'bamboe1Shy',
    new: true,
    url: '/emotes/bamboe1Shy.gif',
  },
  {
    name: 'bamboe1Sleep',
    new: true,
    url: '/emotes/bamboe1Sleep.png',
  },
  {
    name: 'bamboe1Steer',
    new: true,
    url: '/emotes/bamboe1Steer.gif',
  },
];

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
    const singleSetLength = emotes.length;
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
