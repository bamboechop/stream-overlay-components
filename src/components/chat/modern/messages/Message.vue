<template>
  <li class="message">
    {{ displayName }}: {{ messageParts[0].value }}
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IChat>();

const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text);

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
});
</script>

<style lang="scss" scoped>
.message {

}
</style>
