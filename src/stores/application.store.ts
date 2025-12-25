import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import type { TProgramId } from '@/common/types/index.type';
import { useProgramInformationComposable } from '@/composables/program-information.composable';

export const useApplicationStore = defineStore('Application Store', () => {
  const { iconPath } = useProgramInformationComposable();

  const activeApplications = ref<IProgram[]>([]);
  const intermissionVideoPlaying = ref(false);
  const previousActiveProgramId = ref<TProgramId | null>(null);

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
    previousActiveProgramId.value = null;
  };

  const setApplicationActive = (id: TProgramId, active: boolean) => {
    const application = activeApplications.value.find(app => app.id === id);
    if (application) {
      if (active) {
        // Store the currently active program before changing it
        const currentlyActive = activeApplications.value.find(app => app.active);
        if (currentlyActive && currentlyActive.id !== id) {
          previousActiveProgramId.value = currentlyActive.id;
        }

        // Deactivate all other applications first
        activeApplications.value.forEach((app) => {
          app.active = false;
        });
        // Then activate the target application
        application.active = true;
      } else {
        application.active = false;

        // If we're deactivating and have a previous active program, restore it
        if (previousActiveProgramId.value) {
          const previousActive = activeApplications.value.find(app => app.id === previousActiveProgramId.value);
          if (previousActive) {
            previousActive.active = true;
            previousActiveProgramId.value = null;
          }
        }
      }
    }
  };

  const ensureApplicationExists = (application: IProgram) => {
    const existingApplication = activeApplications.value.find(app => app.id === application.id);
    if (!existingApplication) {
      activeApplications.value.push(application);
    }
  };

  const updateMediaPlayerApplicationIcon = (id: TProgramId) => {
    const application = activeApplications.value.find(activeApplication => activeApplication.id === id);
    if (application) {
      application.iconPath = iconPath.value;
    }
  };

  return {
    activeApplications,
    intermissionVideoPlaying,
    addActiveApplication,
    removeActiveApplication,
    removeActiveApplications,
    setApplicationActive,
    ensureApplicationExists,
    updateMediaPlayerApplicationIcon,
  };
});
