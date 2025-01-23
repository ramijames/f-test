<template>
  <default-layout>
    <div class="single-podcast">
      <h2>Single Podcast {{ id }}</h2>
      <p>This is a single podcast.</p>
    </div>
  </default-layout>
</template>

<script setup>

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id);

const router = useRouter();

onMounted(() => {
  // Prevent blank screen in Electron builds
  if (router.currentRoute.value.path === '/' + id.value) {
    router.push('/' + id.value);
  }
});

</script>