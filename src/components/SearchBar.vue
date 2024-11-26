<template>
  <div class="container-search">
    <div class="search">
      <input
        id="search"
        type="text"
        v-model="search"
        :class="{ 'alert-input': showAlert, inner: showAlert }"
        :placeholder="
          showAlert ? erroreMessage : 'Search for users or repositories...'
        "
        @focus="clearError"
        required
      />

      <div class="dropdown-box">
        <p
          class="label-cards-for-option"
          @mouseenter="showDropdownOption = true"
          @mouseleave="showDropdownOption = false"
        >
          {{ selectedOption }}
        </p>
        <ul
          class="dropdown-option"
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

      <div class="dropdown-box">
        <p
          class="label-sort-by"
          @mouseenter="showDropdownSortBy = true"
          @mouseleave="showDropdownSortBy = false"
        >
          Sort by: {{ sortBy }}
        </p>
        <ul
          class="dropdown-sort-by"
          @mouseenter="showDropdownSortBy = true"
          @mouseleave="showDropdownSortBy = false"
          v-if="showDropdownSortBy"
        >
          <li
            v-if="selectedOption === 'repositories'"
            v-for="(option, i) in itemsForSortBy[0]"
            :key="i"
            @click="selectOptionForSortBy(option.value)"
            class="dropdown-item"
          >
            {{ option.value }}
          </li>
          <li
            v-else-if="selectedOption === 'users'"
            v-for="(option, j) in itemsForSortBy[1]"
            :key="j"
            @click="selectOptionForSortBy(option.value)"
            class="dropdown-item"
          >
            {{ option.value }}
          </li>
        </ul>
      </div>

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

      <button @click="sendDataToParent" id="search-button">Search</button>
    </div>
  </div>
</template>

<script>
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

export default {
  data() {
    return {
      selectedOption: "repositories",
      sortBy: "stars",
      search: "",
      showAlert: false,
      showDropdownPages: false,
      showDropdownOption: false,
      showDropdownSortBy: false,
      erroreMessage: "min 3 chars",
      itemsForPage: 10,
      itemsForPageOptions: [
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
      ],
      itemsForSelectedOption: [{ value: "repositories" }, { value: "users" }],
      itemsForSortBy: [
        [
          { value: "stars" },
          { value: "forks" },
          { value: "updated" },
          { value: "issues" },
        ],
        [
          { value: "repositories" },
          { value: "followers" },
          { value: "joined" },
        ],
      ],
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

    selectOptionForSortBy(value) {
      this.sortBy = value;
      this.showDropdownSortBy = false;
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
      return string.length >= 3;
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
.search {
  display: flex;
  justify-content: center;
}

input {
  padding-left: 10px;
  width: 360px;
  height: 50px;
  border: 2px solid #ca7df9;
  border-right: 2px solid #ca7df9;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 16px;
}

input:focus {
  background-color: #f5e6ff;
  color: #564592;
}

input::placeholder {
  color: #564592;
}

.dropdown-box {
  position: relative;
  cursor: pointer;
  /* width: 200px; */
}

.label-cards-for-page,
.label-cards-for-option,
.label-sort-by {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 2px 0px;
  border: 2px solid #ca7df9;
  border-right: 3px solid #ca7df9;
  border-left: none;
  line-height: 23px;
  font-size: 16px;
  background-color: #564592;
  color: white;
  /* text-align: center; */
}

.label-cards-for-option {
  width: 150px;
}

.label-sort-by {
  width: 230px;
}

.label-cards-for-page {
  width: 170px;
}

.dropdown-pages,
.dropdown-option,
.dropdown-sort-by {
  width: 100%;
  position: absolute;
  top: 10;
  right: 0;
  text-align: end;
  background-color: white;
  z-index: 100;
}

.dropdown-option {
  text-align: start;
}

.dropdown-item {
  line-height: 30px;
  font-size: 16px;
  border-bottom: 2px solid #ca7df9;
  padding-right: 5px;
  cursor: pointer;
  text-align: center;
  color: #564592;
}

.dropdown-item:hover {
  color: #ca7df9;
  cursor: pointer;
}

input:focus,
select:focus {
  outline: none;
}

.alert-input {
  border: 2px solid red;
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
  height: 50px;
  padding: 10px;
  border: 2px solid #ca7df9;
  border-left: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  letter-spacing: 2px;
  font-weight: 800;
  background-color: #edf67d;
  color: #564592;
}

button:hover {
  background-color: #f9ffa6;
}
</style>
