import { createRouter, createWebHashHistory } from 'vue-router';
import Podcasts from '../views/Podcasts.vue';
import Preferences from '../views/Preferences.vue';
import SinglePodcast from '../views/SinglePodcast.vue';

const routes = [
  {
    path: '/',
    name: 'Podcasts',
    component: Podcasts
  },
  {
    path: '/preferences',
    name: 'Preferences',
    component: Preferences
  },
  {
    path: '/podcast/:id',
    name: 'SinglePodcast',
    component: SinglePodcast
  }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});

export default router;