<template>
  <div v-for="el in repositories" :key="el.id">
    <div class="card" :class="{ 'card-user': typeOfCard === 'users' }">
      <div class="header">
        <div
          class="avatar-container"
          :class="{ 'avatar-container-user': typeOfCard === 'users' }"
        >
          <img :src="el.avatar_url" alt="" class="avatar" />
        </div>
      </div>
      <div class="main">
        <p class="name">{{ el.name }}</p>
        <div class="description-box">
          <p class="description">{{ el.description }}</p>
        </div>
        <div v-if="typeOfCard === 'repositories'" class="box">
          <div class="stars">
            <font-awesome-icon :icon="['fas', 'star']" />
            <p>{{ el.stargazers_count }}</p>
          </div>
          <div class="issues">
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
            <p>{{ el.open_issues_count }}</p>
          </div>
          <div class="forks">
            <font-awesome-icon :icon="['fas', 'code-fork']" />
            <p>{{ el.forks_count }}</p>
          </div>
        </div>
      </div>
      <button
        class="details-btn"
        v-if="typeOfCard === 'users'"
        @click="detailsUrlEmit(el.url)"
      >
        View details <font-awesome-icon :icon="['fas', 'eye']" />
      </button>
      <div class="footer">
        <a class="button" :href="el.html_url" target="_blank"
          >{{ linkText }}
          <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']"
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    repositories: Array,
    typeOfCard: String,
    linkText: String,
  },

  methods: {
    detailsUrlEmit(url) {
      this.$emit("details-url-emit", url);
    },
  },
};
</script>

<style scoped>
.card {
  color: rgb(83, 83, 83);
  background-color: rgb(243, 243, 243);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  width: 235px;
  height: 47vh;
  border-radius: 20px;
}

.card-user {
  height: 330px;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  flex-grow: 1;
}

.footer {
  color: rgb(83, 83, 83);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-top: 2px solid var(--background-color);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.avatar-container {
  background: linear-gradient(to right, #7f00ff, #e100ff);
  display: flex;
  justify-content: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 15px;
}

.avatar-container-user {
  background: linear-gradient(to right, #7f00ff, #2ebf91);
}

.name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.6; /* Altezza della riga */
  max-height: 3.2em; /* Limita l'altezza massima per 2 righe */
}

.description {
  display: -webkit-box; /* Necessario per -webkit-line-clamp */
  -webkit-box-orient: vertical; /* Imposta l'orientamento verticale */
  -webkit-line-clamp: 3; /* Limita a 3 righe */
  overflow: hidden;
  text-overflow: ellipsis; /* Aggiunge i puntini di sospensione */
  font-size: 14px;
  font-weight: 400;
  line-height: 22px; /* Altezza della riga */
  max-height: 67px; /* Limita l'altezza massima per 2 righe */
}

.description-box {
  display: flex;
  flex-grow: 2;
}

.stars,
.issues,
.forks {
  display: flex;
  align-items: center;
  padding-left: 20px;
  display: flex;
  gap: 10px;
}

.button {
  color: rgb(83, 83, 83);
  font-weight: 500;
  display: inline-block;
  text-align: center;
  text-decoration: none; /* Rimuove la sottolineatura */
  border-radius: 5px; /* Aggiunge angoli arrotondati */
  font-size: 16px; /* Dimensione del testo */
  cursor: pointer; /* Cambia il puntatore a mano */
}

.details-btn {
  color: rgb(83, 83, 83);
  font-weight: 500;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  height: 50px;
  background: none;
  border: none;
  border-top: 2px solid var(--background-color);
}

.button:hover,
.details-btn:hover {
  color: var(--primary-color);
}

.box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* MEDIA QUERY */

/* Extra Small Devices (Mobile Phones) */
@media (max-width: 575px) {
  .card {
    width: 45vw;
  }
  button {
    font-size: 14px;
  }
}

/* Small Devices (Mobile Phones) */
@media (min-width: 576px) and (max-width: 767px) {
  .card {
    width: 45vw;
  }
  button {
    font-size: 14px;
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
