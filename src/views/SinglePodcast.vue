<template>
  <div class="single-podcast">
    <h2>Single Podcast {{ id }}</h2>
    <p>This is a single podcast.</p>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';

const route = useRoute();
const id = ref(route.params.id);

</script>