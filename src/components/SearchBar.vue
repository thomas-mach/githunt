<template>
  <div class="container-search">
    <div class="search">
      <input
        id="search"
        type="text"
        v-model="search"
        :class="{ 'alert-input': showAlert, inner: showAlert }"
        :placeholder="
          showAlert ? erroreMessage : 'Search for users or repos...'
        "
        @focus="clearError"
        required
      />

      <div class="dropdown-box-options">
        <p
          class="label-cards-for-option"
          @mouseenter="showDropdownOption = true"
          @mouseleave="showDropdownOption = false"
        >
          {{ selectedOptionLabel }}
        </p>
        <ul
          class="dropdown-option fade-in"
          v-if="showDropdownOption"
          @mouseenter="showDropdownOption = true"
          @mouseleave="showDropdownOption = false"
        >
          <li
            v-for="(option, i) in itemsForSelectedOption"
            key="i"
            @click="selectOption(option.value, option.label)"
            class="dropdown-item fade-in"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>

      <div class="dropdown-box-sort-by">
        <p
          class="label-sort-by"
          @mouseenter="showDropdownSortBy = true"
          @mouseleave="showDropdownSortBy = false"
        >
          Sort by: {{ sortByLabel }}
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
            @click="selectOptionForSortBy(option.value, option.label)"
            class="dropdown-item"
          >
            {{ option.label }}
          </li>
          <li
            v-else-if="selectedOption === 'users'"
            v-for="(option, j) in itemsForSortBy[1]"
            :key="j"
            @click="selectOptionForSortBy(option.value, option.label)"
            class="dropdown-item"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>

      <div class="dropdown-box-cards-for-page">
        <p
          class="label-cards-for-page"
          @mouseenter="showDropdownPages = true"
          @mouseleave="showDropdownPages = false"
        >
          {{ itemsForPage }} per page
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
export default {
  data() {
    return {
      selectedOptionLabel: "repo",
      selectedOption: "repositories",
      sortByLabel: "stars",
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
      itemsForSelectedOption: [
        { value: "repositories", label: "repo" },
        { value: "users", label: "users" },
      ],
      itemsForSortBy: [
        [
          { value: "stars", label: "stars" },
          { value: "forks", label: "forks" },
          { value: "updated", label: "updated" },
          { value: "issues", label: "issues" },
        ],
        [
          { value: "repositories", label: "repos" },
          { value: "followers", label: "followers" },
          { value: "joined", label: "joined" },
        ],
      ],
    };
  },

  methods: {
    selectOption(value, label) {
      this.selectedOption = value;
      this.selectedOptionLabel = label;
      this.showDropdownOption = false;
    },

    selectOptionForSortBy(value, label) {
      this.sortBy = value;
      this.sortByLabel = label;
      this.showDropdownSortBy = false;
    },

    selectItemsForPage(value) {
      this.itemsForPage = value;
      this.showDropdownPages = false;
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
          ? (this.sortByLabel = "stars")
          : (this.sortByLabel = "repos");
      },
    },
  },
};
</script>

<style scoped>
.container-search {
  user-select: none;
  width: 100%;
}
.search {
  /* display: flex;
  justify-content: center; */
  max-width: 1080px;
  padding: 0 25px;
  margin: 0px auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

input {
  grid-column: span 4;
  width: 100%;
  padding: 0.6vw 0px;
  background-color: white;
  padding-left: 0.7vw;
  /* height: 50px; */
  border: 2px solid var(--secondary-color);
  border-right: 2px solid var(--secondary-color);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: min(1.5vw, 18px);
}

input:focus {
  background-color: #f5e6ff;
  color: var(--primary-color);
}

input::placeholder,
input:-webkit-autofill {
  color: var(--primary-color);
}

.dropdown-box-options,
.dropdown-box-cards-for-page,
.dropdown-box-sort-by,
button {
  width: 100%;
  position: relative;
  cursor: pointer;
}

.dropdown-box-options,
.dropdown-box-cards-for-page {
  grid-column: span 2;
}

.dropdown-box-sort-by {
  grid-column: span 3;
}

button {
  grid-column: span 1;
}

.label-cards-for-page,
.label-cards-for-option,
.label-sort-by {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  /* height: 50px; */
  text-align: center;
  border: 2px solid var(--secondary-color);
  border-right: 3px solid var(--secondary-color);
  border-left: none;
  /* line-height: 23px; */
  padding: 0.6vw 0px;
  font-size: min(1.5vw, 18px);
  background-color: var(--primary-color);
  color: white;
}

/* .label-cards-for-option {
  width: 150px;
} */

/* .label-sort-by {
  width: 230px;
} */

/* .label-cards-for-page {
  width: 170px;
} */

.dropdown-pages,
.dropdown-option,
.dropdown-sort-by {
  width: 100%;
  position: absolute;
  top: 1;
  right: 0;
  text-align: end;
  background-color: white;
  z-index: 100;
  margin: 0px 1px;
}

.dropdown-option {
  text-align: start;
}

.dropdown-item {
  padding: 0.2vw 0px;
  font-size: min(1.5vw, 18px);
  /* line-height: 30px;
  font-size: 16px; */
  border-bottom: 2px solid var(--secondary-color);
  color: var(--primary-color);
  /* padding-right: 5px; */
  cursor: pointer;
  text-align: center;
}

.dropdown-item:last-child {
  border-bottom: 4px solid rgb(3, 188, 3);
}

.dropdown-item:hover {
  color: var(--secondary-color);
  cursor: pointer;
}

input:focus,
select:focus {
  outline: none;
}

.alert-input {
  border: 2px solid #ff00a9;
}

.inner::placeholder {
  color: #ff00a9;
}

select {
  height: 30px;
  padding: 3px;
  border: 1px solid lightgray;
  cursor: pointer;
  font-size: 14px;
}

button {
  /* height: 50px; */
  width: 100%;
  padding: 0.6vw 0.5vw;
  border: 2px solid var(--secondary-color);
  border-left: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
  font-size: min(1.5vw, 18px);
  letter-spacing: 2px;
  font-weight: 800;
  background-color: #edf67d;
  color: var(--primary-color);
}

button:hover {
  background-color: #f9ffa6;
}
</style>
