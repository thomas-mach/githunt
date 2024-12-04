<template>
  <div class="hero-container">
    <div class="logo-box">
      <font-awesome-icon class="github-icon" :icon="['fab', 'github']" />
      <h1>it<span>Hunt</span></h1>
    </div>
    <h2>Discover repositories and users in one click</h2>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.hero-container {
  display: flex;
  flex-direction: column;
  user-select: none;
  color: #f5e6ff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.logo-box {
  display: flex;
  align-items: center;
  color: #f5e6ff;
}

.github-icon,
h1 {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 20vw;
  line-height: 20vw;
}

span {
  color: var(--primary-color);
  font-weight: 600;
}

.github-icon {
  transform: rotate(-90deg);
}

h2 {
  margin-top: 2vw;
  font-size: 3vw;
  color: var(--secondary-color);
  text-align: right;
  font-weight: 500;
}

.title-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* MEDIA QUERY */

/* Extra Small Devices (Mobile Phones) */
@media (max-width: 575px) {
  .hero-container {
    top: 35%;
  }
}
/* Small Devices (Mobile Phones) */
@media (min-width: 576px) and (max-width: 767px) {
  .hero-container {
    top: 40%;
  }
}

/* Medium Devices (Tablets) */
@media (min-width: 768px) and (max-width: 991px) {
}

/* Large Devices (Desktops) */
@media (min-width: 992px) and (max-width: 1199px) {
}

/* Extra Large Devices (Desktops) */
@media (min-width: 1200px) {
  .github-icon,
  h1 {
    font-size: 17vw;
    line-height: 17vw;
  }

  h2 {
    font-size: 2.5vw;
  }
}
</style>
