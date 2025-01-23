import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
      app.use(router);
      app.mount('#app');

// Import main.scss file globally
import './assets/main.scss';