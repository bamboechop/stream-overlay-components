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
import PDFViewer from '@/views/PDFViewer.vue';
import OnScreenCelebrationView from '@/views/OnScreenCelebrationView.vue';
import GigantifiedEmoteView from '@/views/GigantifiedEmoteView.vue';
import ScheduleView from '@/views/ScheduleView.vue';
import PollView from '@/views/PollView.vue';

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
    component: OnScreenCelebrationView,
    name: 'On Screen Celebration',
    path: '/on-screen-celebration',
  },
  {
    component: PokemonCommunityGameView,
    name: 'Pokemon Community Game Component',
    path: '/pcg',
  },
  {
    component: PollView,
    name: 'Poll Component',
    path: '/poll',
  },
  {
    component: PDFViewer,
    name: 'PDF Viewer Component',
    path: '/pdf',
  },
  {
    component: ScheduleView,
    name: 'Schedule Component',
    path: '/schedule',
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
  {
    component: GigantifiedEmoteView,
    name: 'Gigantified Emote',
    path: '/gigantified-emote',
  },
];
