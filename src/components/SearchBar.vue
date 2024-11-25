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
        <!-- <select id="options" v-model="selectedOption">
          <option value="repositories">Repositories</option>
          <option value="users" selected>Users</option>
        </select> -->

        <div class="dropdown-box">
          <p
            class="label-cards-for-page"
            @mouseenter="showDropdownOption = true"
            @mouseleave="showDropdownOption = false"
          >
            {{ selectedOption }}
          </p>
          <ul
            class="dropdown-pages"
            v-if="showDropdownOption"
            @mouseenter="showDropdownOption = true"
            @mouseleave="showDropdownOption = false"
          >
            <li
              v-for="(option, i) in itemsForSelectedOption"
              key="i"
              @click="selectOption(option.value)"
              class="dropdown-item"
            >
              {{ option.value }}
            </li>
          </ul>
        </div>

        <p class="label-sort-by">Sort By:</p>
        <select id="sort" class="sort-by" v-model="sortBy">
          <option v-if="selectedOption === 'repositories'" value="stars">
            stars
          </option>
          <option v-if="selectedOption === 'repositories'" value="forks">
            forks
          </option>
          <option v-if="selectedOption === 'repositories'" value="updated">
            updated
          </option>
          <option v-if="selectedOption === 'repositories'" value="issues">
            issues
          </option>
          <option v-if="selectedOption === 'users'" value="repositories">
            repositories
          </option>
          <option v-if="selectedOption === 'users'" value="followers">
            followers
          </option>
          <option v-if="selectedOption === 'users'" value="joined">
            joined
          </option>
        </select>
        <!-- <p class="label-cards-for-page">Cards/Page:</p>
        <select id="pages" class="cards-for-page" v-model.number="itemsForPage">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select> -->
        <div class="dropdown-box">
          <p
            class="label-cards-for-page"
            @mouseenter="showDropdownPages = true"
            @mouseleave="showDropdownPages = false"
          >
            Cards/Page: {{ itemsForPage }}
          </p>
          <ul
            class="dropdown-pages"
            v-if="showDropdownPages"
            @mouseenter="showDropdownPages = true"
            @mouseleave="showDropdownPages = false"
          >
            <li
              v-for="(option, i) in itemsForPageOptions"
              key="i"
              @click="selectItemsForPage(option.value)"
              class="dropdown-item"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>

        <button @click="sendDataToParent" id="search-button">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

export default {
  data() {
    return {
      selectedOption: "repositories",
      search: "",
      showAlert: false,
      showDropdownPages: false,
      showDropdownOption: false,
      erroreMessage: "min 3 chars",
      itemsForPage: 10,
      sortBy: "stars",
      itemsForPageOptions: [
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
      ],
      itemsForSelectedOption: [{ value: "repositories" }, { value: "users" }],
    };
  },

  methods: {
    selectItemsForPage(value) {
      this.itemsForPage = value;
      this.showDropdownPages = false;
    },

    selectOption(value) {
      this.selectedOption = value;
      this.showDropdownOption = false;
    },

    sendDataToParent() {
      if (this.validation(this.search)) {
        this.showAlert = false;
        this.$emit(
          "send-data-to-parent",
          this.selectedOption,
          this.search,
          this.itemsForPage,
          this.sortBy
        );
      } else {
        this.search = "";
        this.showAlert = true;
      }
    },

    validation(string) {
      string = string.trim();
      return string.length >= 0;
    },

    clearError() {
      this.showAlert = false;
    },
  },
  watch: {
    selectedOption: {
      handler() {
        this.selectedOption === "repositories"
          ? (this.sortBy = "stars")
          : (this.sortBy = "repositories");
      },
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

.label-cards-for-page,
.label-sort-by {
  height: 30px;
  padding: 3px 10px;
  border: 1px solid lightgray;
  border-right: none;
  border-left: none;
  line-height: 23px;
  font-size: 14px;
}

.cards-for-page,
.sort-by {
  border-left: none;
}

.dropdown-box {
  position: relative;
  cursor: pointer;
  width: 150px;
}

.dropdown-pages {
  width: 150px;
  position: absolute;
  top: 10;
  right: 0;
  text-align: end;
}

.dropdown-item {
  line-height: 23px;
  font-size: 14px;
  border-bottom: 1px solid lightgray;
  padding-right: 5px;
}

.dropdown-item:hover {
  background-color: lightgray;
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
