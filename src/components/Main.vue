<template>
  <div class="container">
    <div class="container">
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
    <div class="search-bar-box">
      <span v-show="repositories.length" class="page-count-info"
        >Page {{ page }} of {{ totalPages }}</span
      >
      <div class="wrapper">
        <SearchBar @send-data-to-parent="reciveData" />
        <div class="box-loader">
          <div v-show="isLoading" class="loader"></div>
        </div>
      </div>
    </div>
    <div class="container-grid">
      <Card
        :repositories="repositories"
        :linkText="linkText"
        :typeOfCard="selectedOption"
      />
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import SearchBar from "./SearchBar.vue";
import Card from "../Card.vue";
export default {
  components: {
    Card,
    SearchBar,
  },
  data() {
    return {
      repositories: [],
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

      const url = `https://api.github.com/search/${this.selectedOption}?q=${this.searchValue}&sort=${this.sortValue}&order=desc&per_page=100&page=${pageToFetch}`;
      this.isLoading = true;
      try {
        console.log("try caled");
        const token = this.$githubToken;
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        this.totalResaults = response.data.total_count;
        this.checksIfResault(response.data.items);

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
        }));

        if (this.sortValue === "issues") {
          this.sortClainetSide();
        }
        const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(this.repositories));
        this.applyPagination();
      } catch (error) {
        this.showAlert(error.message, error.code);
      } finally {
        this.isLoading = false; // Imposta isLoading su false solo dopo la richiesta API

        if (this.selectedOption === "users") {
          console.log("USER FEATCH", this.userFetch());
        }
      }
    },

    async userFetch() {
      let results = []; // Corretto il nome da resaults a results
      let users = [];
      this.repositories.forEach((el) => users.push(el.name)); // users già contiene stringhe, non è necessario toString()

      // Utilizza un ciclo for...of per gestire le promesse
      for (const el of users) {
        try {
          const token = this.$githubToken;
          const response = await axios.get(
            `https://api.github.com/users/${el}`,
            {
              // Usare el direttamente
              headers: {
                Authorization: `token ${token}`,
              },
            }
          );
          results.push(response.data); // Aggiungi la risposta all'array results
        } catch (error) {
          console.error(`Errore nel fetch per ${el}:`, error); // Gestione dell'errore
        }
      }

      return results; // Restituisci i risultati se necessario
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
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        console.log("nextPage");
        this.fetch();
      }
    },

    prevPage() {
      if (this.page > 0) {
        this.page--;
        console.log("prevPage");
        this.fetch();
      }
    },

    goToPage(pageNumber) {
      this.page = pageNumber;
      this.fetch();
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
  },
};
</script>

<style scoped>
.container-grid {
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px; /* Spazio tra righe e colonne */
  justify-items: center; /* Centra gli elementi nel contenitore */
}

.row {
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.search-bar-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.box-loader {
  height: 4px;
}

.page-count-info {
  font-size: 12px;
}

button {
  width: 20px;
  aspect-ratio: 1;
  color: rgb(83, 83, 83);
  font-size: 18px;
  cursor: pointer;
  border: none;
  margin: 6px;
  padding: 0;
  overflow: visible;
  background: transparent;
}

button:hover {
  color: #007bff;
  font-size: 20px;
}

.active {
  color: #007bff;
  font-size: 20px;
  text-decoration: underline;
}

.loader {
  height: 4px;
  width: 520px;
  --c: no-repeat linear-gradient(#007bff 0 0);
  background: var(--c), var(--c), #75b8ff;
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
</style>
