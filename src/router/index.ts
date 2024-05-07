import { createRouter, createWebHashHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { routes } from './routes';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  useTitle(to.name as string);
});

export default router;
