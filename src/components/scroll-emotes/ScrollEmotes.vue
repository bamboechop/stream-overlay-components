<template>
  <ul
    ref="listRef"
    class="scroll-emotes"
    :class="{ 'scroll-emotes--faded': intermissionVideoPlaying }">
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
      <div class="scroll-emote-icons">
        <template v-if="emote.tier === 'follower'">
          <Heart
            class="scroll-emote-icon scroll-emote-icon--follower"
            :size="16" />
        </template>
        <template v-if="emote.tier === '1' || emote.tier === '2' || emote.tier === '3'">
          <Star
            class="scroll-emote-icon scroll-emote-icon--star"
            :size="16" />
        </template>
        <template v-if="emote.tier === '2' || emote.tier === '3'">
          <Star
            class="scroll-emote-icon scroll-emote-icon--star"
            :size="16" />
        </template>
        <template v-if="emote.tier === '3'">
          <Star
            class="scroll-emote-icon scroll-emote-icon--star"
            :size="16" />
        </template>
      </div>
      <span
        class="scroll-emote-name"
        :class="{ 'scroll-emote-name--marquee': hasMarquee(index) }"
        :style="getMarqueeStyle(index)"
        :ref="(el) => setNameRef(el as HTMLElement | null, index)">
        <span class="scroll-emote-name-text">{{ emote.name }}</span>
      </span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Heart, Star } from 'lucide-vue-next';
import { EMOTES } from '@/common/constants/emotes.constant';
import { useApplicationStore } from '@/stores/application.store';
import { storeToRefs } from 'pinia';

const applicationStore = useApplicationStore();
const { intermissionVideoPlaying } = storeToRefs(applicationStore);

const listRef = ref<HTMLElement>();
const emoteNameRefs = ref<Array<HTMLElement | null>>([]);
const marqueeDistances = ref<Record<number, number>>({});

let animationId: number;
let translateX = 0;
let contentWidth = 0;
const speed = 1;

function setNameRef(el: HTMLElement | null, index: number) {
  emoteNameRefs.value[index] = el;
}

function updateMarqueeState() {
  const nextMarqueeDistances: Record<number, number> = {};

  emoteNameRefs.value.forEach((el, index) => {
    if (!el) {
      return;
    }

    const distance = el.scrollWidth - el.clientWidth;

    if (distance > 0) {
      nextMarqueeDistances[index] = distance;
    }
  });

  marqueeDistances.value = nextMarqueeDistances;
}

function hasMarquee(index: number) {
  return marqueeDistances.value[index] !== undefined;
}

function getMarqueeStyle(index: number) {
  const distance = marqueeDistances.value[index];
  if (!distance) {
    return undefined;
  }

  return {
    '--marquee-distance': `${distance}px`,
    '--marquee-duration': `${Math.max(4, distance / 20).toFixed(2)}s`,
  };
}

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
  nextTick(() => {
    updateMarqueeState();
    window.addEventListener('resize', updateMarqueeState);
  });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  window.removeEventListener('resize', updateMarqueeState);
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
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.scroll-emotes--faded {
  opacity: 0;
}

.scroll-emote {
  aspect-ratio: 1 / 1;
  width: 128px;
  flex-shrink: 0;
}

.scroll-emote-icon--follower {
  color: #d81515;
  fill: #d81515;
}

.scroll-emote-icon--star {
  color: #f3d113;
  fill: #f3d113;
}

.scroll-emote-icons {
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: center;
  padding: 4px 4px 0 4px;
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
  flex-shrink: 0;
  max-width: 128px;
  position: relative;
}

.scroll-emote-name {
  background-color: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  overflow: hidden;
  padding: 4px 8px;
  text-align: center;
}

.scroll-emote-name-text {
  display: inline-block;
  min-width: 100%;
}

.scroll-emote-name--marquee {
  text-overflow: clip;
}

.scroll-emote-name--marquee .scroll-emote-name-text {
  animation: scroll-emote-marquee var(--marquee-duration, 6s) linear infinite alternate;
  min-width: max-content;
  text-align: left;
  will-change: transform;
}

@keyframes scroll-emote-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(var(--marquee-distance, 0px) * -1));
  }
}
</style>
