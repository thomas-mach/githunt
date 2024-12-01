<template>
  <div class="hero-container">
    <div class="hero-box">
      <font-awesome-icon class="github-icon" :icon="['fab', 'github']" />
      <h1>GitHunt</h1>
    </div>
    <div class="title-box"></div>
    <h2>Discover repositories and users in one click</h2>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.hero-container {
  user-select: none;
  color: #f5e6ff;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hero-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.github-icon,
h1 {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 230px;
  line-height: 230px;
  color: var(--primary-color);
}

h2 {
  font-size: 32px;
  color: var(--secondary-color);
  text-align: right;
}

.title-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
