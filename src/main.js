import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "@fontsource/comfortaa";
import "@fontsource/roboto-mono/100.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";
import "typeface-cutive-mono";
import "typeface-poppins";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCodeFork } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

library.add(
  faStar,
  faCircleExclamation,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faGithub,
  faCodeFork,
  faEye,
  faXmark,
  faMagnifyingGlass
);
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.config.globalProperties.$githubToken = import.meta.env.VITE_GITHUB_TOKEN;

app.mount("#app");
