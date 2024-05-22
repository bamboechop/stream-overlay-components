import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

export const useApplicationStore = defineStore('Application Store', () => {
  const activeApplications = ref<IProgram[]>([]);

  const addActiveApplication = (application: IProgram) => {
    /* timeout is necessary for pinia-shared-state to finish initializing
     * without it every application would be added to an empty state
     * resulting in only the last application added to be shown
     */
    window.setTimeout(() => {
      activeApplications.value.push(application);
    }, 1000);
  };

  const removeActiveApplication = (id: string) => {
    activeApplications.value = activeApplications.value.filter(activeApplication => activeApplication.id !== id);
  };

  return {
    activeApplications,
    addActiveApplication,
    removeActiveApplication,
  };
});
