<template>
  <div class="container">
    <SearchBar @send-data-to-parent="reciveData" />
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
      selectedOption: "",
      searchValue: "",
      linkText: "",
    };
  },

  methods: {
    reciveData(option, search) {
      this.searchValue = search;
      this.selectedOption = option;
      this.selectedOption === "repositories"
        ? (this.linkText = "Go to repo")
        : (this.linkText = "Go to profile");
      this.fetch();
      console.log(option, search);
    },

    async fetch() {
      this.errorMessage = "";
      const baseUrl = `https://api.github.com/search/${this.selectedOption}`;
      const query =
        this.selectedOption === "repositories"
          ? `language:${this.searchValue}`
          : this.searchValue;

      const url = `${baseUrl}?q=${query}&sort=updated&order=desc&per_page=10&page=1`;
      try {
        const token = this.$githubToken;
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
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
      } catch (error) {
        this.showAlert(error.message, error.code);
        console.log(error);
        console.error("Error fetching:", error);
      }
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
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px; /* Spazio tra righe e colonne */
  justify-items: center; /* Centra gli elementi nel contenitore */
}
</style>
