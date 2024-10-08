<template>
  <div>
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

  mounted() {
    const githubToken = this.$githubToken;
  },
};
</script>

<style scoped>
.header,
.main,
.footer {
  margin-top: 10px;
}

.header {
  margin-bottom: 30px;
}
</style>
