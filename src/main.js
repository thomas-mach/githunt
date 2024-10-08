import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

const app = createApp(App);

// Definisci il token come proprietà globale
app.config.globalProperties.$githubToken = import.meta.env.VITE_GITHUB_TOKEN;

app.mount('#app');
