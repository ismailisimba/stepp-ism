import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import { createI18n, useI18n } from "vue-i18n";
import { en } from "vuetify/locale";
import EN from "@/locales/en.json";
import LightTheme from "./themes/light";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/styles/main.scss";
import axios from "axios";

loadFonts();

//Axios
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.withCredentials = true;

const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {
      $vuetify: en,
      ...EN,
    },
  },
});

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        ...LightTheme,
      },
    },
  },
  defaults: {
    VTextField: {
      color: "primary",
      bgColor: "white",
    },
    // VTextarea: {
    //   color: "primary",
    //   bgColor: "white",
    //   variant: "outlined"
    // },
    VFileInput: {
      color: "primary",
      bgColor: "white",
    },
    VBtn: {
      text: "none",
    },
    VTabs: {
      color: "primary",
    },
    VSnackbar: {
      location: "top",
      timeout: 3000,
    },
    VCheckbox: {
      color: "primary",
    },
    VDataTableServer: {
      itemsPerPageOptions: [10, 25, 50, 100],
      color: "blue",
    },

    VAutoComplete: {
      color: "primary",
      bgColor: "white",
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .mount("#app");
