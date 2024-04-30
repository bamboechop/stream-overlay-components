import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Note } from '@/common/interfaces/notes.interface';

export const useCoworkingStore = defineStore('Coworking', () => {
  const notes = ref<Note[]>([]);

  const myNotes = computed(() => notes.value.filter(note => note.displayName === 'bamboechop'));
  const viewerNotes = computed(() => notes.value.filter(note => note.displayName !== 'bamboechop'));

  const updateNote = (note: Note) => {
    if (note.status === 'in-progress') {
      notes.value.push(note);
    } else {
      notes.value = notes.value.filter(n => n.id !== note.id);
    }
  };

  const setNotes = (notesToSet: Note[]) => {
    notes.value = notesToSet;
  };

  return {
    myNotes,
    setNotes,
    updateNote,
    viewerNotes,
  };
});
