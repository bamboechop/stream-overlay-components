import { createRouter, createWebHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  useTitle(to.name as string);
});

export default router;
