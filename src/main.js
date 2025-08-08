import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios'

// Quasar styles
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)


app.config.globalProperties.$axios = axios


app.use(Quasar, {
  plugins: {} // Add Notify, Dialog, etc. if needed
})


app.use(router)


app.mount('#app')
