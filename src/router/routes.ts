import type { RouteRecordRaw } from 'vue-router';
import MediaPlayerView from '@/views/MediaPlayerView.vue';
import TaskBarView from '@/views/TaskBarView.vue';
import ChatView from '@/views/ChatView.vue';
import CoworkingView from '@/views/CoworkingView.vue';

export const routes: RouteRecordRaw[] = [
  {
    component: ChatView,
    path: '/chat',
  },
  {
    component: CoworkingView,
    path: '/coworking',
  },
  {
    component: MediaPlayerView,
    path: '/media-player',
  },
  {
    component: TaskBarView,
    path: '/task-bar',
  },
];
