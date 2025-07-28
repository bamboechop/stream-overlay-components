<template>
  <div class="coworking-view">
    <SideStrip />
    <MainArea />
    <img
      alt=""
      class="coworking-view__pencil"
      src="/stationeries/pencil-gray.png" />
    <img
      alt=""
      class="coworking-view__rubber-eraser"
      src="/stationeries/rubber-eraser.png" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue';
import MainArea from '@/components/coworking/MainArea.vue';
import SideStrip from '@/components/coworking/SideStrip.vue';
import { useCoworkingStore } from '@/stores/coworking.store';
import type { Note } from '@/common/interfaces/notes.interface';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { RequestCache } from '@/services/request-cache.service';

let eventSource: EventSource | null = null;

const { initChat, initTwitch } = useTwitchChat();

const store = useCoworkingStore();
const { removeNotesFromUser, setNotes, updateNote } = store;

function eventSourceSetup() {
  eventSource = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_URL}/coworking/eventstream`);

  eventSource.addEventListener('ban-user', (event) => {
    const { displayName } = JSON.parse(event.data) as { displayName: string };
    removeNotesFromUser(displayName);
  });

  eventSource.addEventListener('note-update', (event) => {
    const data = JSON.parse(event.data) as Note;
    updateNote(data);
  });

  eventSource.onerror = (error) => {
    console.error(error);
    eventSource?.close();
  };
}

onMounted(async () => {
  try {
    await initTwitch();
    await initChat();

    eventSourceSetup();

    try {
      const notes: Note[] = await RequestCache.request(`${import.meta.env.VITE_DIGITAL_DOPPLER_BASE_URL}/api/open-notes`, {
        method: 'GET',
      }, 10);
      setNotes(notes);
    } catch (notesError) {
      if (notesError instanceof Error && notesError.message === 'REQUEST_RECENTLY_MADE_BY_OTHER_INSTANCE') {
        return;
      }
      throw notesError;
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    window.alert('Failed to fetch notes. Check the OBS debug view for this scene for more information.');
  }
});

onBeforeUnmount(() => {
  eventSource?.close();
});
</script>

<style lang="scss" scoped>
@import '@/assets/coworking.variables';

:global(body) {
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  width: 100vw;
}

:global(#app) {
  height: 100%;
}

.coworking-view {
  background-color: #000;
  background-image: url('/coworking/bg.png');
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;
  overflow: hidden;
  position: relative;

  &__pencil {
    filter: drop-shadow(-8px -8px 4px rgba(0, 0, 0, 0.5));
    height: 32px;
    left: 55%;
    position: absolute;
    bottom: 12%;
    transform: translate(-50%, -50%) rotate(-25deg);
    width: 666px;
  }

  &__rubber-eraser {
    filter: drop-shadow(-6px -6px 4px rgba(0, 0, 0, 0.5));
    height: 74px;
    left: 62%;
    position: absolute;
    bottom: 8%;
    transform: translate(-50%, -50%) rotate(-18deg);
    width: 215px;
  }
}
</style>
