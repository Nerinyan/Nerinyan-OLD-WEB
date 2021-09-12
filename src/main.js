import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import './assets/element-plus-#366284/index.css'

const vue = createApp(App);
vue.use(store).use(router).use(ElementPlus).mount('#app')
