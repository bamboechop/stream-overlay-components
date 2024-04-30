<template>
  <div
    ref="noteRef"
    class="single-note"
    :class="{ 'single-note--random-position': randomPosition }">
    <header class="single-note__header">
      <template v-if="note.displayName !== 'bamboechop'">
        <img
          :alt="`${note.displayName}'s avatar`"
          :src="note.avatarUrl ?? 'https://placebacon.net/48/48'" />
        {{ note.displayName }}
      </template>
      <span class="single-note__date">{{ date }}</span>
    </header>
    <p class="single-note__text">
      {{ note.text }}
    </p>
    <img
      alt=""
      class="single-note__push-pin"
      :src="pushPinSrc" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Note } from '@/common/interfaces/notes.interface';

const props = withDefaults(defineProps<{ note: Note; parentWidth: number; randomPosition?: boolean }>(), { randomPosition: false });

const pushPinColors = [
  'blue',
  'green',
  'pink',
  'purple',
  'red',
  'yellow',
];

const noteRef = ref<HTMLDivElement | null>(null);

const date = computed(() => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(props.note.date));
});

const notePositionPercentage = computed(() => {
  const percentage = Math.floor(Math.random() * 100);
  const position = Math.floor((props.parentWidth / 100) * percentage);
  return (position - 384 - (2 * 32)) > 0 ? `${position - 384 - (2 * 32)}px` : `${Math.floor(Math.random() * 45)}%`;
});

const noteRotationString = computed(() => {
  const rotation = Math.random() * 8;
  return `rotate(${(Math.random() > 0.5 ? rotation : rotation * -1).toFixed(2)}deg)`;
});

const pushPinRotationString = ref(Math.random() > 0.25 ? 'rotateY(180deg)' : 'rotateY(0deg)');

const pushPinSrc = ref(`/coworking/${pushPinColors[Math.floor(Math.random() * pushPinColors.length)]}.push-pin.png`);

const pushPinX = ref(`${Math.floor(Math.random() * 87)}%`);

const pushPinY = ref(`${(Math.floor(Math.random() * 35) * -1)}px`);
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/coworking.variables';

.single-note {
  background-color: $note-background-color;
  box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0.1) 0 20px 25px -5px, rgba(0, 0, 0, 0.1) 0 8px 10px -6px;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(rgba(0, 0, 0, 0.03) 0px 20px 13px) drop-shadow(rgba(0, 0, 0, 0.08) 0px 8px 5px);
  font-size: 1.5rem;
  position: relative;
  width: 384px;
  transform: v-bind(noteRotationString);

  &__date {
    bottom: 4px;
    font-size: 1rem;
    position: absolute;
    right: 8px;
  }

  &__header {
    align-items: center;
    background-color: #facc15;
    display: flex;
    gap: 1rem;
    height: 56px;
    padding: 8px 16px;
    position: relative;

    img {
      border-radius: 50%;
      height: $note-avatar-size;
      width: $note-avatar-size;
    }
  }

  &__push-pin {
    filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
    height: 48px;
    left: v-bind(pushPinX);
    position: absolute;
    top: v-bind(pushPinY);
    transform: v-bind(pushPinRotationString);
  }

  &__text {
    background-attachment: local;
    background-color: transparent;
    background-image:
        linear-gradient(to right, $note-background-color 10px, transparent 10px),
        linear-gradient(to left, $note-background-color 10px, transparent 10px),
        repeating-linear-gradient($note-background-color, $note-background-color 30px, #707070 30px, #707070 31px, $note-background-color 31px);
    border: 0;
    color: #464646;
    font-family: 'Caveat', sans-serif;
    font-size: 2rem;
    line-height: 31px;
    margin: 8px 0 24px 0;
    padding: 0 18px;
    white-space: break-spaces;
    word-wrap: break-word;
  }
}

.single-note--random-position {
  left: v-bind(notePositionPercentage);
}
</style>
