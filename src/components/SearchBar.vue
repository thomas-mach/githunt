<template>
  <div class="container">
    <div class="row">
      <div class="search">
        <input
          id="search"
          type="text"
          v-model="search"
          :class="{ 'alert-input': showAlert, inner: showAlert }"
          :placeholder="showAlert ? erroreMessage : 'Search...'"
          @focus="clearError"
          required
        />
        <select id="options" v-model="selectedOption">
          <option value="repositories">Repositories</option>
          <option value="users">Users</option>
        </select>
        <p class="label-cards-for-page">Cards/Page:</p>
        <select id="pages" class="cards-for-page" v-model.number="itemsForPage">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <button @click="sendDataToParent" id="search-button">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: "repositories",
      search: "",
      showAlert: false,
      erroreMessage: "min 3 chars",
      itemsForPage: 10,
    };
  },

  methods: {
    sendDataToParent() {
      if (this.validation(this.search)) {
        this.showAlert = false;
        this.$emit(
          "send-data-to-parent",
          this.selectedOption,
          this.search,
          this.itemsForPage
        );
      } else {
        this.search = "";
        this.showAlert = true;
      }
    },

    validation(string) {
      string = string.trim();
      return string.length > 2;
    },

    clearError() {
      this.showAlert = false;
    },
  },
};
</script>

<style scoped>
.row {
  justify-content: center;
  width: 100%;
}

.search {
  display: flex;
  align-items: center;
}

input {
  height: 30px;
  padding: 3px;
  border: 1px solid lightgray;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-right: none;
  font-size: 14px;
}

.label-cards-for-page {
  height: 30px;
  padding: 3px;
  border: 1px solid lightgray;
  border-right: none;
  border-left: none;
  line-height: 23px;
  font-size: 14px;
}

.cards-for-page {
  border-left: none;
}

input:focus,
select:focus {
  outline: none;
}

.alert-input {
  border: 1px solid red;
}

.inner::placeholder {
  color: red;
}

select {
  height: 30px;
  padding: 3px;
  border: 1px solid lightgray;
  cursor: pointer;
  font-size: 14px;
}

button {
  height: 30px;
  padding: 5px;
  border: 1px solid lightgray;
  border-left: none;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: rgb(218, 218, 218);
}
</style>
