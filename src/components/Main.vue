<template>
  <Hero v-if="showHero" />

  <DetailsCard
    v-if="showDetails"
    @close-details="closeDetails"
    class="details-component"
    :details="details"
  />

  <!-- Search Bar -->
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

  <!-- Card -->
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

  <!-- Pagination -->
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
import axios from "axios";
import Swal from "sweetalert2";
import Hero from "./Hero.vue";
import SearchBar from "./SearchBar.vue";
import Card from "./Card.vue";
import DetailsCard from "./DetailsCard.vue";

export default {
  components: {
    Hero,
    SearchBar,
    Card,
    DetailsCard,
  },

  data() {
    return {
      repositories: [],
      pageNumbers: [],
      isLoading: false,
      showDetails: false,
      showHero: true,
      details: null,
      totalResaults: null,
      itemsForPageValue: null,
      selectedOption: "",
      searchValue: "",
      sortValue: "",
      linkText: "",
      page: 1,
      totalPages: 1,
    };
  },

  methods: {
    //Recive data from SearchBar component
    reciveData(option, search, items, sort) {
      sessionStorage.clear();
      this.selectedOption = option;
      this.searchValue = search;
      this.itemsForPageValue = items;
      this.sortValue = sort;
      this.page = 1;
      this.totalPages = 1;
      this.selectedOption === "repositories"
        ? (this.linkText = "Go to repo")
        : (this.linkText = "Go to profile");
      this.fetch();
      this.updatePageNumbers();
    },

    async fetch() {
      if (this.isLoading) return;
      this.scroll();

      let pageToFetch =
        Math.floor(((this.page - 1) * this.itemsForPageValue || 10) / 100) + 1;
      pageToFetch = Math.min(pageToFetch, 10);

      const cachedData = this.checkCache(pageToFetch);
      if (cachedData) {
        this.repositories = cachedData;
        this.applyPagination();
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";

      const url = `https://githunt-server-2f77ded310be.herokuapp.com/api/github-repos?selectedOption=${this.selectedOption}&searchValue=${this.searchValue}&sortValue=${this.sortValue}&page=${pageToFetch}`;

      try {
        const response = await axios.get(url, {});
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
          url: this.selectedOption === "repositories" ? null : item.url,
        }));

        if (this.sortValue === "issues") {
          this.sortClainetSide();
        }
        const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(this.repositories));
        this.applyPagination();
      } catch (error) {
        const statusCode = error.response.status;
        if (statusCode === 429) {
          this.showAlert(
            "Rate Limit Exceeded",
            "Too many requests. Please try again later."
          );
        } else {
          this.showAlert(error.message, error.code);
        }
      } finally {
        this.isLoading = false;
        this.showHero = false;
      }
    },

    async detailsFetch(url) {
      this.details = null;
      this.showDetails = true;
      document.body.classList.add("no-scroll");
      const url2 = `https://githunt-server-2f77ded310be.herokuapp.com/api/github-user-details?user=${url}`;
      try {
        const response = await axios.get(url2, {});
        this.details = response.data;
      } catch (error) {
        const statusCode = error.response.status;
        if (statusCode === 429) {
          this.showAlert(
            "Rate Limit Exceeded",
            "Too many requests. Please try again later."
          );
        } else {
          this.showAlert(error.message, error.code);
        }
      }
    },

    checkCache(pageToFetch) {
      const cacheKey = `${this.selectedOption}_${this.searchValue}_page_${pageToFetch}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return (this.repositories = JSON.parse(cachedData));
      }
      return null;
    },

    checksIfResault(item) {
      if (!item.length) {
        const message = `Nothing found for "${this.searchValue}"`;
        this.showAlert(message);
      }
    },

    applyPagination() {
      const totalItems = this.totalResaults > 1000 ? 1000 : this.totalResaults;
      this.totalPages = Math.ceil(totalItems / this.itemsForPageValue);
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
      if (allResults.length >= this.page * this.itemsForPageValue) {
        const start = (this.page - 1) * this.itemsForPageValue;
        const end = start + this.itemsForPageValue;
        this.repositories = allResults.slice(start, end);
        this.updatePageNumbers();
      } else {
        if (!this.isLoading) this.fetch();
      }
    },

    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetch();
        this.scroll();
      }
    },

    prevPage() {
      if (this.page > 0) {
        this.page--;
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
    },

    showAlert(title, code) {
      Swal.fire({
        icon: "warning",
        title: title,
        text: code,
      }).then((result) => {
        if (result.isConfirmed) {
          this.showDetails = false;
        }
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
        behavior: "smooth",
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
  gap: 20px;
}

.row {
  margin: 16px 0px;
  justify-content: center;
  align-items: center;
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
    margin-top: 43vw;
    gap: 10px;
  }
  .wraper {
    margin: 0;
  }
  button:hover {
    color: rgb(243, 243, 243);
    font-size: 16px;
  }
  button {
    width: 16px;
    font-size: 16px;
  }
  .active {
    font-size: 16px;
  }
}

/* Small Devices (Mobile Phones) */
@media (min-width: 576px) and (max-width: 767px) {
  .container-grid {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 35vw;
    gap: 10px;
  }
  .wraper {
    margin: 0;
  }
  button:hover {
    color: rgb(243, 243, 243);
    font-size: 18px;
  }
  button {
    width: 18px;
    font-size: 18px;
  }

  .active {
    font-size: 18px;
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
