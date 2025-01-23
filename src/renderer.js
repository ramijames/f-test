import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

// Import main.scss file globally
import './assets/main.scss';