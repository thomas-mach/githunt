<template>
  <Hero v-if="showHero" />
  <DetailsCard
    v-if="showDetails"
    @close-details="closeDetails"
    class="details-component"
    :details="details"
  />

  <section class="search-section" :class="{ blur: showDetails === true }">
    <div class="container">
      <div class="search-bar-box">
        <div class="page-cuont-info-wraper">
          <span v-show="repositories.length" class="page-count-info"
            >Page {{ page }} of {{ totalPages }}</span
          >
        </div>
        <div class="wraper">
          <SearchBar @send-data-to-parent="reciveData" />
          <div class="box-loader">
            <div v-show="isLoading" class="loader"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container" :class="{ blur: showDetails === true }">
    <div class="container-grid">
      <Card
        :repositories="repositories"
        :linkText="linkText"
        :typeOfCard="selectedOption"
        @details-url-emit="detailsFetch"
      />
    </div>
  </div>
  <div class="container" :class="{ blur: showDetails === true }">
    <div v-show="pageNumbers.length > 1" class="row">
      <button @click="prevPage" :disabled="page === 1">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <span v-for="pageNumber in pageNumbers" key="pageNumber">
        <button
          @click="goToPage(pageNumber)"
          :disabled="page === pageNumber"
          :class="{ active: page === pageNumber }"
        >
          {{ pageNumber }}
        </button></span
      >
      <button @click="nextPage" :disabled="page === totalPages">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
  <div :class="{ overlay: showDetails === true }"></div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import SearchBar from "./SearchBar.vue";
import Card from "../Card.vue";
import DetailsCard from "./DetailsCard.vue";
import Hero from "./Hero.vue";

export default {
  components: {
    Card,
    SearchBar,
    DetailsCard,
    Hero,
  },
  data() {
    return {
      repositories: [],
      details: null,
      pageNumbers: [],
      selectedOption: "",
      searchValue: "",
      sortValue: "",
      linkText: "",
      page: 1,
      totalPages: 1,
      isLoading: false,
      totalResaults: null,
      itemsForPageValue: null,
      showDetails: false,
      showHero: true,
    };
  },

  methods: {
    reciveData(option, search, items, sort) {
      sessionStorage.clear();
      this.selectedOption = option;
      this.searchValue = search;
      this.itemsForPageValue = items;
      this.sortValue = sort;
      console.log("sort by:", this.sortValue);

      this.page = 1;
      this.totalPages = 1;

      this.selectedOption === "repositories"
        ? (this.linkText = "Go to repo")
        : (this.linkText = "Go to profile");

      this.fetch();
      this.updatePageNumbers();

      console.log(option, search, items);
    },

    async fetch() {
      //Effettua una richiesta API per ottenere i repository, gestisce il caching e il caricamento.
      if (this.isLoading) return;

      let pageToFetch =
        Math.floor(((this.page - 1) * this.itemsForPageValue || 10) / 100) + 1;
      pageToFetch = Math.min(pageToFetch, 10); // Non superare la pagina 10

      // Controlla se c'è cache disponibile
      const cachedData = this.checkCache(pageToFetch);
      if (cachedData) {
        console.log("Using cached data");
        this.repositories = cachedData;
        this.applyPagination(); // Applica la paginazione direttamente
        return; // Esci senza fare la richiesta API
      }

      // Se non c'è cache, procedi con la richiesta API
      this.isLoading = true; // Solo qui impostiamo isLoading su true
      this.errorMessage = "";

      const url = `https://githunt-server-a3ae0070cecf.herokuapp.com/api/github-repos?selectedOption=${this.selectedOption}&searchValue=${this.searchValue}&sortValue=${this.sortValue}&page=${pageToFetch}`;
      this.isLoading = true;
      try {
        console.log("try caled");
        const token = this.$githubToken;
        const response = await axios.get(url, {
          // headers: {
          //   Authorization: `token ${token}`,
          // },
        });

        this.totalResaults = response.data.total_count;
        this.checksIfResault(response.data.items);
        console.log("RESPONSE DATA", response.data);
        this.repositories = response.data.items.map((item) => ({
          id: item.id,
          avatar_url:
            this.selectedOption === "repositories"
              ? item.owner.avatar_url
              : item.avatar_url,
          name:
            this.selectedOption === "repositories"
              ? item.full_name
              : item.login,
          description:
            this.selectedOption === "repositories"
              ? item.description
              : item.type,
          stargazers_count:
            this.selectedOption === "repositories"
              ? item.stargazers_count
              : null,
          open_issues_count:
            this.selectedOption === "repositories"
              ? item.open_issues_count
              : null,
          html_url: item.html_url,
          language:
            this.selectedOption === "repositories" ? item.language : null,
          forks_count:
            this.selectedOption === "repositories" ? item.forks_count : null,
          url: this.selectedOption === "repositories" ? null : item.url,
        }));

        console.log("Repositoreis Featch", this.repositories);

        if (this.sortValue === "issues") {
          this.sortClainetSide();
        }
        const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(this.repositories));
        // this.userFetch();
        this.applyPagination();
      } catch (error) {
        this.showAlert(error.message, error.code);
      } finally {
        this.isLoading = false;
        this.showHero = false;
      }
    },

    async detailsFetch(url) {
      console.log(url);
      this.details = null;
      this.showDetails = true;
      document.body.classList.add("no-scroll");
      const url2 = `https://githunt-server-a3ae0070cecf.herokuapp.com/api/github-user-details?user=${url}`;
      try {
        console.log(url);
        console.log("try caled");
        const token = this.$githubToken;
        console.log(token);
        const response = await axios.get(url2, {
          // headers: {
          //   Authorization: `token ${token}`,
          // },
        });
        this.details = response.data;
        console.log("Card details", this.details);
      } catch (error) {
        console.error(
          "Errore durante il fetch:",
          error.response || error.message
        );
      }
    },

    checkCache(pageToFetch) {
      //Controlla se i dati richiesti sono già memorizzati in sessionStorage.
      console.log(
        `Checking cache for: ${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`
      );

      const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
      console.log("Page to fetch: ", pageToFetch);
      console.log("SessionStorage:", sessionStorage);

      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return (this.repositories = JSON.parse(cachedData));
      }
      return null;
    },

    checksIfResault(item) {
      // Controlla se sono stati trovati risultati e mostra un messaggio di avviso se non ce ne sono.
      if (!item.length) {
        const message = `Nothing found for "${this.searchValue}"`;
        this.showAlert(message);
      }
    },

    applyPagination() {
      console.log("applyPagination called");
      //Calcola le pagine totali e applica la paginazione.
      console.log("PAGE", this.page);

      // Usa il numero reale di risultati per il calcolo delle pagine
      const totalItems = this.totalResaults > 1000 ? 1000 : this.totalResaults;

      this.totalPages = Math.ceil(totalItems / this.itemsForPageValue);

      console.log("Total Pages", this.totalPages);
      console.log("Total Resaults", this.totalResaults);

      let allResults = [];

      const totalPagesToCheck = Math.ceil(
        (this.page * this.itemsForPageValue) / 100
      );

      for (let i = 1; i <= totalPagesToCheck; i++) {
        const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${i}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          allResults = allResults.concat(JSON.parse(cachedData));
        }
      }

      console.log("allResults:", allResults);
      if (allResults.length >= this.page * this.itemsForPageValue) {
        const start = (this.page - 1) * this.itemsForPageValue;
        const end = start + this.itemsForPageValue;
        this.repositories = allResults.slice(start, end);
        this.updatePageNumbers();
      } else {
        // In questo caso non eseguiamo `fetch` se i dati sono in cache
        if (!this.isLoading) this.fetch(); // Condizione per chiamare fetch solo se non è già in esecuzione
      }

      return allResults;
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        console.log("nextPage");
        this.fetch();
        this.scroll();
      }
    },

    prevPage() {
      if (this.page > 0) {
        this.page--;
        console.log("prevPage");
        this.fetch();
        this.scroll();
      }
    },

    goToPage(pageNumber) {
      this.page = pageNumber;
      this.fetch();
      this.scroll();
    },

    updatePageNumbers() {
      //Aggiorna la lista dei numeri di pagina visualizzati.

      let pageRange = 10;

      this.totalPages < 10 ? (pageRange = this.totalPages) : (pageRange = 10);
      let start = Math.max(1, this.page - Math.floor(pageRange));
      if (this.totalPages > 10) {
        start = Math.max(1, this.page - Math.floor(pageRange / 2));
      }

      const end = Math.min(this.totalPages, start + pageRange - 1);

      this.pageNumbers = [];

      for (let i = start; i <= end; i++) {
        this.pageNumbers.push(i);
      }
      console.log("array con page numbers", this.pageNumbers);
    },

    showAlert(title, code) {
      Swal.fire({
        icon: "warning",
        title: title,
        text: code,
      });
    },

    sortClainetSide() {
      this.repositories.sort(
        (a, b) => b.open_issues_count - a.open_issues_count
      );
    },

    closeDetails() {
      this.showDetails = false;
      document.body.classList.remove("no-scroll");
    },

    scroll() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth", // Scroll fluido
      });
    },
  },
};
</script>

<style scoped>
.container-grid {
  margin-top: 120px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px; /* Spazio tra righe e colonne */
  justify-items: center; /* Centra gli elementi nel contenitore */
}

.row {
  margin: 16px 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.search-section {
  width: 100%;
  background-color: var(--background-color);
  position: fixed;
}

.search-bar-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wraper {
  margin: 0 auto;
  max-width: 1080px;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.box-loader {
  padding: 0px 28px;
  width: 100%;
  height: 3px;
}

.page-count-info {
  font-size: 12px;
  margin-left: 24px;
  color: rgb(243, 243, 243);
}

.page-cuont-info-wraper {
  height: 30px;
}

button {
  width: 24px;
  aspect-ratio: 1;
  color: rgb(243, 243, 243);
  font-size: 20px;
  cursor: pointer;
  border: none;
  margin: 6px;
  overflow: visible;
  background: transparent;
}

button:hover {
  color: var(--secondary-color);
  font-size: 24px;
}

.details-component {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.active {
  color: var(--secondary-color);
  font-size: 24px;
  text-decoration: underline;
}

.blur {
  filter: blur(5px);
  overflow: hidden;
}

.overlay {
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loader {
  height: 3px;
  width: 100%;
  --c: no-repeat linear-gradient(var(--primary-color) 0 0);
  background: var(--c), var(--c), var(--secondary-color);
  background-size: 60% 100%;
  animation: l16 3s infinite;
}
@keyframes l16 {
  0% {
    background-position: -150% 0, -150% 0;
  }
  66% {
    background-position: 250% 0, -150% 0;
  }
  100% {
    background-position: 250% 0, 250% 0;
  }
}

/* MEDIA QUERY */

/* Extra Small Devices (Mobile Phones) */
@media (max-width: 575px) {
  .container-grid {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 170px;
  }
  .wraper {
    margin: 0;
  }
}

/* Small Devices (Mobile Phones) */
@media (min-width: 576px) and (max-width: 767px) {
  .container-grid {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 170px;
  }
  .wraper {
    margin: 0;
  }
}

/* Medium Devices (Tablets) */
@media (min-width: 768px) and (max-width: 991px) {
  .container-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Devices (Desktops) */
@media (min-width: 992px) and (max-width: 1199px) {
  .container-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Extra Large Devices (Desktops) */
@media (min-width: 1200px) {
}
</style>
