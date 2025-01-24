<template>
  <div class="default-layout">
    <sidebar />
    <main class="content">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'DefaultLayout',
  components: {
    Sidebar
  }
};
</script>

<style scoped lang="scss">

.default-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
  }
}

</style>