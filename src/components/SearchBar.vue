<template>
  <div class="container">
    <div class="row">
      <div class="search">
        <input type="text" id="search" placeholder="Search..." required />
        <select id="options" v-model="selectedOption">
          <option value="repositories">Repositories</option>
          <option value="users">Users</option>
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
    };
  },

  methods: {
    sendDataToParent() {
      this.$emit("send-data-to-parent", this.selectedOption);
    },
  },
};
</script>

<style scoped>
.row {
  justify-content: center;
}

.search {
  display: flex;
  align-items: center;
}

input {
  color: lightgray;
  height: 30px;
  padding: 3px;
  border: 1px solid lightgray;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-right: none;
  font-size: 14px;
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
</style>
