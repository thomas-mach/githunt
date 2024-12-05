<template>
  <div v-if="details" class="card">
    <div class="header">
      <div class="avatar-container">
        <img :src="details.avatar_url" alt="" class="avatar" />
      </div>
    </div>
    <div class="main">
      <div class="name-location">
        <p class="name">{{ details.name }}</p>
        <p class="location">{{ details.location }}</p>
      </div>
      <div class="info">
        <p><span>Login:</span> {{ details.login }}</p>
        <p><span>Bio:</span> {{ details.bio }}</p>
        <p><span>View Type:</span> {{ details.user_view_type }}</p>
        <p><span>Followers:</span> {{ details.followers }}</p>
        <p><span>Following:</span> {{ details.following }}</p>
        <p><span>Company:</span> {{ details.company }}</p>
        <p><span>Public repos:</span> {{ details.public_repos }}</p>
        <p>
          <span>Created at:</span>
          {{ new Date(details.created_at).toLocaleDateString() }}
        </p>
        <p>
          <span>Updated at:</span>
          {{ new Date(details.updated_at).toLocaleDateString() }}
        </p>
      </div>
    </div>
    <div class="footer"></div>
    <button class="close-btn" @click="closeDetails">
      <font-awesome-icon :icon="['fas', 'xmark']" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    details: Object,
  },

  methods: {
    closeDetails() {
      console.log("btn close");
      this.$emit("close-details");
    },
  },
};
</script>

<style scoped>
.card {
  width: 500px;
  /* height: calc((500px * 16) / 9); */
  color: rgb(83, 83, 83);
  background-color: rgb(243, 243, 243);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 20px;
  position: relative;
}

.avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.avatar-container {
  background: linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);
  display: flex;
  justify-content: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 15px;
}

.close-btn {
  color: rgb(243, 243, 243);
  font-size: 32px;
  position: absolute;
  top: 14px;
  right: 16px;
  cursor: pointer;
  background: none;
  line-height: 0;
  border: 0;
}

span {
  font-weight: bold;
}

.main {
  padding: 20px;
  overflow: auto;
}

.name {
  color: black;
  font-size: 28px;
}

.location {
  margin-bottom: 10px;
}

.name-location {
  border-bottom: 2px solid lightgray;
}

.info p {
  border-bottom: 1px solid lightgray;
}

.info {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* MEDIA QUERY */

/* Extra Small Devices (Mobile Phones) */
@media (max-width: 575px) {
  .card {
    width: 90vw;
    height: 80vh;
  }
}

/* Small Devices (Mobile Phones) */
@media (min-width: 576px) and (max-width: 767px) {
  .card {
    width: 90vw;
    height: 80vh;
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
}
</style>
