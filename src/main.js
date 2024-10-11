import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Swal from "sweetalert2";
import "@fontsource/comfortaa";
import "@fontsource/roboto-mono/100.css";
import "@fontsource/roboto-mono/400.css"; // Regular 400
import "@fontsource/roboto-mono/500.css"; // Medium 500
import "@fontsource/roboto-mono/700.css"; // Bold 700
import "typeface-cutive-mono";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// Aggiungi le icone alla libreria
library.add(
  faStar,
  faCircleExclamation,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faGithub
);
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.config.globalProperties.$githubToken = import.meta.env.VITE_GITHUB_TOKEN;

app.mount("#app");
