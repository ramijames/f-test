<template>
  <default-layout>
    <div class="podcasts">
      <h2>Podcasts</h2>
      <p>This is the podcasts page.</p>
      <router-link to="/podcast/1">Single Podcast 1</router-link>
    </div>
  </default-layout>
</template>

<script setup>

import DefaultLayout from '../layouts/DefaultLayout.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Prevent blank screen in Electron builds
  if (router.currentRoute.value.path === '/') {
    router.push('/');
  }
});

</script>