import type { RouteRecordRaw } from 'vue-router';
import TaskBarView from '@/views/TaskBarView.vue';

export const routes: RouteRecordRaw[] = [
  {
    component: TaskBarView,
    path: '/task-bar',
  },
];
