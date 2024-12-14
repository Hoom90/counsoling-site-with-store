import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import "@/assets/css/font.css"

export default defineNuxtPlugin((app) => {
  const LightTheme = {
    dark: false,
    colors: {
      background: '#EEE',
      surface: '#FFF',
      primary: '#6200EE',
      'primary-darken-1': '#3700B3',
      secondary: '#03DAC6',
      'secondary-darken-1': '#018786',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
      'theme-blue': '#428e9d',
      black: "#000",
    },
  }
  const DarkTheme = {
    dark: true,
    // colors: {
    //   background: '#121212',
    //   surface: '#1E1E1E',
    //   primary: '#BB86FC',
    //   'primary-darken-1': '#3700B3',
    //   secondary: '#03DAC6',
    //   'secondary-darken-1': '#03DAC6',
    //   error: '#CF6679',
    //   info: '#2196F3',
    //   success: '#4CAF50',
    //   warning: '#FB8C00',
    //   'theme-blue': '#428e9d',
    //   black: '#000',
    // },
  }
  const vuetify = createVuetify({
    // theme: {
    //   defaultTheme: user.getTheme || 'LightTheme',
    //   themes: { LightTheme, DarkTheme },
    // },
    theme: {
      defaultTheme: 'LightTheme',
      themes: { LightTheme, DarkTheme },
    },
    // defaults: {
    //   global: {
    //     ripple: false,
    //   },
    //   VSheet: {
    //     elevation: 4,
    //   },
    //   VCard: {
    //     elevation: 2,
    //   },
    //   VBtn: {
    //     variant: 'outlined',
    //     style: 'text-transform: none;',
    //   },
    // },
    // ... your configuration
    // aliases: {
    //   VBtnPrimary: VBtn,
    // },
    defaults: {
      global: {
        ripple: false,
      },
      VSheet: {
        elevation: 4,
      },
      VCard: {
        VBtn: { variant: 'outlined' },
      },
      VBtn: {
        style: 'text-transform: none;',
      },
    },

  })
  app.vueApp.use(vuetify)
})