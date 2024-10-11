<template>
  <div class="container">
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
      <font-awesome-icon :icon="['fab', 'github']" />
    </div>
    <div class="container-grid">
      <Card
        :repositories="repositories"
        :linkText="linkText"
        :typeOfCard="selectedOption"
      />
    </div>
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
      selectedOption: "",
      searchValue: "",
      linkText: "",
      isLoading: false,
      page: 1,
      hasNext: false,
      hasPrev: false,
      totalPages: 1,
      pageNumbers: [],
    };
  },

  methods: {
    reciveData(option, search) {
      this.page = 1;
      this.searchValue = search;
      this.selectedOption = option;
      this.selectedOption === "repositories"
        ? (this.linkText = "Go to repo")
        : (this.linkText = "Go to profile");
      this.fetch();
      console.log(option, search);
    },

    async fetch() {
      this.isLoading = true;
      this.errorMessage = "";
      const url = `https://api.github.com/search/${this.selectedOption}?q=${this.searchValue}&sort=updated&order=desc&per_page=10&page=${this.page}`;
      try {
        const token = this.$githubToken;
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        this.checkPagination(response.headers.link);
        this.totalPages = Math.ceil(response.data.total_count / 10);
        this.updatePageNumners();
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
        console.log("repositories", this.repositories);
        console.log("Toto Pages", this.totPages);
      } catch (error) {
        this.showAlert(error.message, error.code);
        console.log(error);
        console.error("Error fetching:", error);
      } finally {
        this.isLoading = false;
      }
    },

    checkPagination(linkHeader) {
      console.log(linkHeader);
      if (!linkHeader) {
        this.hasPrev = false;
        this.hasPrev = false;
        return;
      }

      const parts = linkHeader.split(",");
      const links = {};
      console.log("parts", parts);

      parts.forEach((part) => {
        const section = part.split(";");
        const url = section[0].replace(/<(.*)>/, "$1").trim();
        const name = section[1].replace(/rel="(.*)"/, "$1").trim();
        links[name] = url;
        console.log(section);
        console.log(url);
        console.log(links);
      });
      this.hasNext = !!links.next;
      this.hasPrev = !!links.prev;
    },

    checksIfResault(item) {
      if (!item.length) {
        const message = `Nothing found for "${this.searchValue}"`;
        this.showAlert(message);
      }
    },

    nextPage() {
      if (this.hasNext) {
        this.page++;
        this.fetch();
      }
    },

    prevPage() {
      if (this.hasPrev) {
        this.page--;
        this.fetch();
      }
    },

    goToPage(pageNumber) {
      this.page = pageNumber;
      this.fetch();
    },

    updatePageNumners() {
      const pageRange = 20;
      const start = Math.max(1, this.page - Math.floor(pageRange / 2));
      const end = Math.min(this.totalPages, start + pageRange - 1);

      this.pageNumbers = [];

      for (let i = start; i <= end; i++) {
        this.pageNumbers.push(i);
      }
      console.log(this.pageNumbers);
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
  width: 372px;
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
