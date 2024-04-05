import type { RouteRecordRaw } from 'vue-router';
import MediaPlayerView from '@/views/MediaPlayerView.vue';
import TaskBarView from '@/views/TaskBarView.vue';

export const routes: RouteRecordRaw[] = [
  {
    component: MediaPlayerView,
    path: '/media-player',
  },
  {
    component: TaskBarView,
    path: '/task-bar',
  },
];
