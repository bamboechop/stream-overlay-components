import type { RouteRecordRaw } from 'vue-router';
import MediaPlayerView from '@/views/MediaPlayerView.vue';
import TaskBarView from '@/views/TaskBarView.vue';
import ChatView from '@/views/ChatView.vue';
import CoworkingView from '@/views/CoworkingView.vue';
import ClockView from '@/views/ClockView.vue';
import PokemonCommunityGameView from '@/views/PokemonCommunityGameView.vue';
import WebcamView from '@/views/WebcamView.vue';

export const routes: RouteRecordRaw[] = [
  {
    component: ChatView,
    name: 'Chat Component',
    path: '/chat',
  },
  {
    component: ClockView,
    name: 'Clock Component',
    path: '/clock',
  },
  {
    component: CoworkingView,
    name: 'Coworking Component',
    path: '/coworking',
  },
  {
    component: MediaPlayerView,
    name: 'Media Player Component',
    path: '/media-player',
  },
  {
    component: PokemonCommunityGameView,
    name: 'Pokemon Community Game Component',
    path: '/pcg',
  },
  {
    component: TaskBarView,
    name: 'Task Bar Component',
    path: '/task-bar',
  },
  {
    component: WebcamView,
    name: 'Webcam Component',
    path: '/webcam',
  },
];
