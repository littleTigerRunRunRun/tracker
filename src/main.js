import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import VueMaterial from 'vue-material'
import VueMaterialMd from './lib/vue-material-md/index.js'
import 'vue-material/dist/vue-material.css'
import './assets/tracker.css'
import './assets/font/icon.css'
Vue.use(VueMaterial)
Vue.use(VueMaterialMd)

Vue.config.productionTip = false

new Vue({
  // router,
  render: h => h(App)
}).$mount('#app')
