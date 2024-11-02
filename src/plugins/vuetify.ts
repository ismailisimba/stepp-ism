// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

//I18n
import { createI18n, useI18n } from 'vue-i18n'
import { en } from 'vuetify/locale'
import EN from '@/locales/en.json'

const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'en',
  messages : {
    en: {
      $vuetify: {
        ...en,
        ...EN,
        dataIterator:{
        },
      },
    }
  }
})

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light'
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
})
