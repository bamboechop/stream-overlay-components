<template>
    <Transition name="slide-up-and-fade">
      <div v-show="enabled">
      <template v-if="category === 'Escape from Duckov'">
        <EscapeFromDuckovDeathCounter :count />
      </template>
    </div>
    </Transition>
</template>

<script lang="ts" setup>
import { useTwitchStore } from '@/stores/twitch.store';
import { storeToRefs } from 'pinia';
import EscapeFromDuckovDeathCounter from './games/EscapeFromDuckovDeathCounter.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import RequestCache from '@/services/request-cache.service';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import type { TwitchEventSubNotificationGameDeathToggleDto, TwitchEventSubNotificationGameDeathUpdateDto } from '@/common/interfaces/event-stream.interface';

const twitchStore = useTwitchStore();
const { category } = storeToRefs(twitchStore);
const { getChannelInformation } = twitchStore;

const { on } = useEventStreamComposable();
const eventCleanupFunctions: (() => void)[] = [];

const count = ref(0);
const enabled = ref(false);

onMounted(async () => {
  const onDeath = on<TwitchEventSubNotificationGameDeathUpdateDto>('game.death.update', (newCount) => {
    count.value = newCount?.count ?? 0;
  });

  const onToggle = on<TwitchEventSubNotificationGameDeathToggleDto>('game.death.toggle', (newToggle) => {
    enabled.value = newToggle?.enabled ?? false;
  });

  eventCleanupFunctions.push(onDeath, onToggle);

  await getChannelInformation();
  const response = await RequestCache.request<{ enabled: boolean; count: number }>(`${import.meta.env.VITE_BAMBBOT_API_URL}/misc/deaths?category=${category.value}`, {
    method: 'GET',
  }, 10);
  enabled.value = response?.enabled ?? false;
  count.value = response?.count ?? 0;
});

onUnmounted(() => {
  eventCleanupFunctions.forEach(cleanupFn => cleanupFn());
  eventCleanupFunctions.length = 0;
});
</script>

<style lang="scss" scoped>
@font-face {
  font-display: swap;
  font-family: 'Round Corner Font Regular';
  src: url("/fonts/RoundCornerFont/RoundCornerFont.eot?") format('eot'),
       url("/fonts/RoundCornerFont/RoundCornerFont.woff") format('woff'),
       url("/fonts/RoundCornerFont/RoundCornerFont.ttf") format('truetype'),
       url("/fonts/RoundCornerFont/RoundCornerFont.svg#RoundCornerFont-Regular") format('svg');
  font-weight: normal;
  font-style: normal;
}

.slide-up-and-fade-enter-active,
.slide-up-and-fade-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
.slide-up-and-fade-enter-from,
.slide-up-and-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
