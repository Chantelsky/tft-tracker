import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useDataDragon } from './composables/useDataDragon'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.checkAuth()

const { loadDataDragon } = useDataDragon()
loadDataDragon()

app.mount('#app')
