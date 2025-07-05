<template>
  <Splide
    ref="splideRef"
    :options="splideOptions"
    class="bsky-image-carousel">
    <SplideSlide
      v-for="(img, idx) in images"
      :key="img + idx">
      <img
        :src="img"
        alt=""
        class="bsky-image-carousel__img" />
    </SplideSlide>
  </Splide>
</template>

<script lang="ts" setup>
// @ts-expect-error @splidejs/vue-splide typing definition couldn't be found
import { Splide, SplideSlide } from '@splidejs/vue-splide';
// @ts-expect-error @splidejs/vue-splide typing definition couldn't be found
import type { Options } from '@splidejs/vue-splide';
import { computed, ref } from 'vue';
import '@splidejs/vue-splide/css/core';

defineProps<{ images: string[] }>();
const splideRef = ref();

const splideOptions = computed<Options>(() => ({
  type: 'fade',
  arrows: false,
  pagination: false,
  autoplay: true,
  interval: 5000,
  rewind: true,
  pauseOnHover: false,
  pauseOnFocus: false,
  speed: 400,
  perPage: 1,
  perMove: 1,
  drag: true,
  lazyLoad: 'nearby',
}));
</script>

<style lang="scss" scoped>
.bsky-image-carousel {
  background-color: #1a1a1d;
  overflow: hidden;

  &__img {
    max-width: 100%;
  }
}
</style>
