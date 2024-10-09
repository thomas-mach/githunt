<template>
  <div class="container">
    <SearchBar @send-data-to-parent="reciveData" />
    <div class="container-grid">
      <Card :repositories="repositories" />
    </div>
  </div>
</template>

<script>
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
      errorMessage: "",
      repositories: [],
      username: "thomas-mach",
      selectedOption: "",
    };
  },

  methods: {
    reciveData(data) {
      this.fetch();
      this.selectedOption = data;
      console.log(data);
      console.log("array data", this.data);
    },

    async fetch() {
      this.errorMessage = "";
      try {
        let url = `https://api.github.com/search/${this.selectedOption}?q=language:PHP&sort=updated&order=desc&per_page=10&page=1`;
        const token = this.$githubToken;
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        this.repositories = response.data.items.map((item) => ({
          id: item.id,
          avatar_url: item.owner.avatar_url,
          name: item.full_name,
          description: item.description,
          stargazers_count: item.stargazers_count,
          open_issues_count: item.open_issues_count,
          html_url: item.html_url,
        }));
        console.log("repositories", this.repositories);
      } catch (error) {
        this.errorMessage = "Failed to fetch. Please try again later.";
        console.log(error);
        console.error("Error fetching:", error);
      }
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
