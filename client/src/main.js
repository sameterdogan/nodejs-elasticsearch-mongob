import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import InfiniteLoading from 'vue-infinite-loading'
import axios from 'axios'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.component('infinite-loading', InfiniteLoading)
axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.config.productionTip = false

store.dispatch('attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
})
