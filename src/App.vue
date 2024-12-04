<template>
  <div class="app">
    <Main />
  </div>
</template>

<script>
import Main from "./components/Main.vue";

export default {
  components: {
    Main,
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
}
</style>
