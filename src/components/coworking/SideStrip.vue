<template>
  <div
    ref="sideStripRef"
    class="side-strip">
    <div class="side-strip__my-notes">
      <template
        v-for="(note, index) of myNotes"
        :key="`my-note-${index}`">
        <SingleNote
          :note="note"
          :parent-width="sideStripWidth"
          random-position />
      </template>
    </div>
    <div class="side-strip__viewer-notes">
      <Splide
        ref="splide"
        :options="splideOptions">
        <SplideSlide class="side-strip__viewer-note-slide">
          <NoViewerNote />
        </SplideSlide>
        <template
          v-for="(note, index) of viewerNotes"
          :key="`${note.displayName}-note-${index}`">
          <SplideSlide class="side-strip__viewer-note-slide">
            <SingleNote
              :note="note"
              :parent-width="sideStripWidth" />
          </SplideSlide>
        </template>
      </Splide>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import type { Options } from '@splidejs/vue-splide';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useCoworkingStore } from '@/stores/coworking.store';
import SingleNote from '@/components/coworking/SingleNote.vue';
import NoViewerNote from '@/components/coworking/NoViewerNote.vue';

import '@splidejs/vue-splide/css/core';

const store = useCoworkingStore();
const { myNotes, viewerNotes } = storeToRefs(store);

const splide = ref<Splide>();
const splideActiveIndex = ref(0);

const splideOptions = computed<Options>(() => ({
  arrows: false,
  autoplay: true,
  height: '445px',
  interval: 30000,
  pagination: false,
  rewind: true,
  start: splideActiveIndex.value,
  type: 'fade',
  width: '772px',
}));

const sideStripRef = ref<HTMLDivElement | null>(null);

const padding = ref(12);
const transitionDelay = ref(0);

const sideStripWidth = computed(() => {
  if (!sideStripRef.value) {
    return 0;
  }
  const width = sideStripRef.value.getBoundingClientRect().width;
  return width - (padding.value * 2);
});

function setTransitionDelay(value: number = 0) {
  transitionDelay.value = value;
  /*
   * 1s timeout to render the first item immediately
   * and afterward have a 2.5s transition delay
   * applied to every item when it transitions
   */
  window.setTimeout(() => {
    transitionDelay.value = 2500;
  }, 1000);
}

function setSplideListeners() {
  /*
   * track the active index to update the start value
   * needed for when the slider refreshes so it stays
   * on the active slide after refresh is done
   */
  splide.value.splide.on('moved', (activeIndex: number) => {
    splideActiveIndex.value = activeIndex;
  });

  /*
   * destroy the splide slider
   * reset the transition delay
   * update the start slide in case the removed slide is the last slide
   * remount the splide slider
   * reapply the listeners
   */
  splide.value.splide.on('refresh', () => {
    splide.value.splide.destroy();

    setTransitionDelay();

    if (splideActiveIndex.value > viewerNotes.value.length) {
      splideActiveIndex.value = viewerNotes.value.length;
    }

    splide.value.splide.mount();

    setSplideListeners();
  });
}

onMounted(() => {
  setTransitionDelay();
  setSplideListeners();
});
</script>

<style lang="scss" scoped>
.side-strip {
  background-color: #6a3812;
  background-image: url('/coworking/cork.png');
  border: 12px solid #291617;
  border-image: url('/coworking/dark-wood.png') 100;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: max-content;
  min-height: calc(100% - 24px);
  margin-left: 6px;
  margin-top: 12px;
  position: relative;
  min-width: 796px;

  &::before {
    bottom: 0;
    box-shadow: inset 0 0 50px 15px rgba(0,0,0,0.75);
    content: '';
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  &__my-notes {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 48px calc(v-bind(padding) * 1px) 24px;
  }

  &__viewer-note-slide {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  &__viewer-note-slide.is-active {
    transition-delay: calc(v-bind(transitionDelay) * 1ms) !important; // delay the transition to fade out old note first
  }

  &__viewer-notes {
    display: flex;
    justify-content: center;
    margin-top: auto;
  }
}
</style>
