import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { PiniaSharedState } from 'pinia-shared-state';

import App from './App.vue';
import router from './router';

const app = createApp(App);

const pinia = createPinia();
pinia.use(PiniaSharedState({
  enable: true,
  initialize: true,
  type: 'localstorage',
}));

app.use(pinia);
app.use(router);

app.mount('#app');
