import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

export const useApplicationStore = defineStore('Application Store', () => {
  const activeApplications = ref<IProgram[]>([]);

  const updateActiveApplication = () => {
    activeApplications.value = activeApplications.value.map((application, index) => {
      if (index === activeApplications.value.length - 1) {
        return {
          ...application,
          active: true,
        };
      }

      return {
        ...application,
        active: false,
      };
    });
  };

  const addActiveApplication = (application: IProgram) => {
    activeApplications.value.push(application);
    updateActiveApplication();
  };

  const removeActiveApplication = (id: string) => {
    activeApplications.value = activeApplications.value.filter(activeApplication => activeApplication.id !== id);
    updateActiveApplication();
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
