import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import type { TProgramId } from '@/common/types/index.type';
import { useProgramInformationComposable } from '@/composables/program-information.composable';

export const useApplicationStore = defineStore('Application Store', () => {
  const { iconPath } = useProgramInformationComposable();

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

  const removeActiveApplication = (id: TProgramId) => {
    activeApplications.value = activeApplications.value.filter(activeApplication => activeApplication.id !== id);
    updateActiveApplication();
  };

  const removeActiveApplications = () => {
    activeApplications.value = [];
  };

  const updateMediaPlayerApplicationIcon = (id: TProgramId) => {
    const application = activeApplications.value.find(activeApplication => activeApplication.id === id);
    if (application) {
      application.iconPath = iconPath.value;
    }
  };

  return {
    activeApplications,
    addActiveApplication,
    removeActiveApplication,
    removeActiveApplications,
    updateMediaPlayerApplicationIcon,
  };
});
