import type { RouteRecordRaw } from 'vue-router';
import MediaPlayerView from '@/views/MediaPlayerView.vue';
import TaskBarView from '@/views/TaskBarView.vue';
import ChatView from '@/views/ChatView.vue';
import CoworkingView from '@/views/CoworkingView.vue';
import ClockView from '@/views/ClockView.vue';
import PokemonCommunityGameView from '@/views/PokemonCommunityGameView.vue';
import WebcamView from '@/views/WebcamView.vue';
import IntermissionView from '@/views/IntermissionView.vue';
import AdView from '@/views/AdView.vue';

export const routes: RouteRecordRaw[] = [
  {
    component: AdView,
    name: 'Ad Component',
    path: '/ad',
  },
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
    component: IntermissionView,
    name: 'Intermission Component',
    path: '/intermission',
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
