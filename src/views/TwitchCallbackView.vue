<template>
  <main class="twitch-callback-view">
    <p>{{ statusMessage }}</p>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { completeOAuthFromCallback } from '@/services/twitch-auth.service';

const router = useRouter();
const statusMessage = ref('Completing Twitch authentication...');

onMounted(async () => {
  try {
    const returnTo = completeOAuthFromCallback();
    await router.replace(returnTo);
  } catch (error) {
    console.error('[TwitchAuth] OAuth callback failed:', error);
    statusMessage.value = 'This is the Twitch OAuth callback route. No valid callback payload was found, so no redirect was performed.';
  }
});
</script>

<style lang="scss" scoped>
.twitch-callback-view {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
}
</style>
