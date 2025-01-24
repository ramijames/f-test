<template>
  <default-layout>
    <div class="podcasts">
      <feed-list :feeds="feeds" />
    </div>
  </default-layout>
</template>

<script setup>

import { ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import FeedList from '../components/feeds/FeedList.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const feeds = ref([])

async function getFeeds() {
  try {
    if (!window?.api?.getFeeds) {
      console.error('API not available')
      return
    }
    feeds.value = await window.api.getFeeds()
  } catch (error) {
    console.error('Failed to get feeds:', error)
  }
}

onMounted(() => {
  // Prevent blank screen in Electron builds
  if (router.currentRoute.value.path === '/') {
    router.push('/');
  }
  getFeeds()
});

</script>