<template>
  <Windows95ChatWindow :active="active" />
</template>

<script lang="ts" setup>
import Windows95ChatWindow from '@/components/chat/windows95/ChatWindow.vue';

defineProps<{ active: boolean }>();
</script>
