import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

export const useApplicationStore = defineStore('Application Store', () => {
  const activeApplications = ref<IProgram[]>([]);

  const addActiveApplication = (application: IProgram) => {
    activeApplications.value.push(application);
  };

  const removeActiveApplication = (id: string) => {
    activeApplications.value = activeApplications.value.filter(activeApplication => activeApplication.id !== id);
  };

  const removeActiveApplications = () => {
    activeApplications.value = [];
  };

  return {
    activeApplications,
    addActiveApplication,
    removeActiveApplication,
    removeActiveApplications,
  };
});
