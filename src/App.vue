<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>

console.log('Hello, Vue 3!');

</script>

<style scoped lang="scss">

@use './assets/variables' as *;

#app {
  height: 100%;
}

</style>