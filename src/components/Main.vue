<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <SearchBar @send-data-to-parent="reciveData" />
        <!-- <Card /> -->
        <div v-for="el in data">
          <p>{{ el.name }}</p>
        </div>
      </div>
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
      data: [],
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
        let url = `https://api.github.com/search/${this.selectedOption}?q=language:PHP&sort=updated&order=desc&per_page=100&page=1`;
        const token = this.$githubToken;
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        this.data = response.data.items;
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
.col {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}
</style>
