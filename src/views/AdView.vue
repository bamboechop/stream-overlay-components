<template>
  <Ad />
</template>

<script lang="ts" setup>
import Ad from '@/components/ad-view/Ad.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

useEventStreamComposable();
useTwitchStreamInfoComposable(false);
</script>
