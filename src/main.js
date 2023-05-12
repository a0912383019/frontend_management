//載入全域css
import './assets/scss/master.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//整理全局註冊
import { globalRegister } from '@/global'

const app = createApp(App)
globalRegister(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
