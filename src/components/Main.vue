<template>
  <div class="container">
    <div class="container">
      <div v-show="pageNumbers.length > 1" class="row">
        <button @click="prevPage" :disabled="!hasPrev">
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
        <button @click="nextPage" :disabled="!hasNext">
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
      linkText: "",
      page: 1,
      totalPages: 1,
      isLoading: false,
      totalResaults: null,
      itemsForPageValue: null,
      // hasNext: false,
      // hasPrev: false,
    };
  },

  methods: {
    reciveData(option, search, items) {
      // this.page = 1;
      this.searchValue = search;
      this.selectedOption = option;
      this.itemsForPageValue = items;

      this.selectedOption === "repositories"
        ? (this.linkText = "Go to repo")
        : (this.linkText = "Go to profile");

      this.fetch();

      console.log(option, search, items);
    },

    async fetch() {
      console.log("PAGE", this.page);

      let pageToFetch =
        Math.floor(((this.page - 1) * this.itemsForPageValue) / 100) + 1; // Calculate which block of 100 results to fetch
      pageToFetch > 10 ? (pageToFetch = 10) : pageToFetch;

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

      const url = `https://api.github.com/search/${this.selectedOption}?q=${this.searchValue}&sort=updated&order=desc&per_page=100&page=${pageToFetch}`;

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
        }));

        const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(this.repositories));
        this.applyPagination();
      } catch (error) {
        this.showAlert(error.message, error.code);
      } finally {
        this.isLoading = false; // Imposta isLoading su false solo dopo la richiesta API
      }
    },

    checkCache(pageToFetch) {
      console.log(
        `Checking cache for: ${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`
      );

      const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
      console.log("Generated Cache Key: ", cacheKey);
      console.log("SessionStorage:", sessionStorage);

      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        console.log("Using cached data");
        return (this.repositories = JSON.parse(cachedData));
      }
      return null;
    },

    applyPagination() {
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

      if (allResults.length < this.page * this.itemsForPageValue) {
        this.fetch();
      } else {
        const start = (this.page - 1) * this.itemsForPageValue;
        const end = start + this.itemsForPageValue;

        this.repositories = allResults.slice(start, end);

        this.updatePageNumbers();
        this.hasNext = this.page < this.totalPages;
        this.hasPrev = this.page > 1;
      }
    },
    checksIfResault(item) {
      if (!item.length) {
        const message = `Nothing found for "${this.searchValue}"`;
        this.showAlert(message);
      }
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        // this.checkCache();
        this.applyPagination();
        this.fetch();
      }
    },

    prevPage() {
      if (this.page > 0) {
        this.page--;
        // this.checkCache();
        this.applyPagination();
        this.fetch();
      }
    },

    goToPage(pageNumber) {
      this.page = pageNumber;
      this.applyPagination();
      this.fetch();
    },

    updatePageNumbers() {
      const pageRange = 10;
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
