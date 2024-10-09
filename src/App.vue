<template>
  <div class="app">
    <Header class="header" />
    <Main class="main" />
    <Footer class="footer" />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Header,
    Main,
    Footer,
  },
};
</script>

<style scoped>
.header,
.main,
.footer {
  margin-top: 10px;
}

.app {
  display: flex;
  flex-direction: column;
}
</style>
