<template>
  <default-layout>
    <div class="preferences">
      <h2>Preferences</h2>
      <p>This is the preferences page.</p>
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
    router.push('/preferences');
  }
});

</script>