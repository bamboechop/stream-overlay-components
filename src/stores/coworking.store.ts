import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Note } from '@/common/interfaces/notes.interface';

export const useCoworkingStore = defineStore('Coworking', () => {
  const notes = ref<Note[]>([]);

  const myNotes = computed(() => notes.value.filter(note => note.displayName === 'bamboechop'));
  const viewerNotes = computed(() => notes.value.filter(note => note.displayName !== 'bamboechop'));

  const removeNotesFromUser = (displayName: string) => {
    notes.value = notes.value.filter(n => n.displayName !== displayName);
  };

  const updateNote = (note: Note) => {
    if (note.status === 'in-progress') {
      notes.value.push(note);
    } else {
      notes.value = notes.value.filter(n => n.note_id !== note.note_id);
    }
  };

  const setNotes = (notesToSet: Note[]) => {
    notes.value = notesToSet;
  };

  return {
    myNotes,
    removeNotesFromUser,
    setNotes,
    updateNote,
    viewerNotes,
  };
});
