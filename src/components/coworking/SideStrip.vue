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
      <template v-if="viewerNotes.length === 0">
        <NoViewerNote />
      </template>
      <template
        v-for="(note, index) of viewerNotes"
        :key="`${note.displayName}-note-${index}`">
        <SingleNote
          :note="note"
          :parent-width="sideStripWidth" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useCoworkingStore } from '@/stores/coworking.store';
import SingleNote from '@/components/coworking/SingleNote.vue';
import NoViewerNote from '@/components/coworking/NoViewerNote.vue';

const store = useCoworkingStore();
const { myNotes, viewerNotes } = storeToRefs(store);

const sideStripRef = ref<HTMLDivElement | null>(null);

const padding = ref(12);
const paddingString = computed(() => `${padding.value}px`);

const sideStripWidth = computed(() => {
  if (!sideStripRef.value) {
    return 0;
  }
  const width = sideStripRef.value.getBoundingClientRect().width;
  return width - (padding.value * 2);
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
  gap: 2rem;
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
    padding: 48px v-bind(paddingString);
  }

  &__viewer-notes {
    display: flex;
    justify-content: center;
    margin-top: auto;
    padding-bottom: 50px;
  }
}
</style>
