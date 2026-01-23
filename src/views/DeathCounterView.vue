<template>
  <DeathCounter />
</template>

<script lang="ts" setup>
import DeathCounter from '@/components/death-counter/modern/DeathCounter.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';

useTwitchStreamInfoComposable(false);
</script>
