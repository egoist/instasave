import Vue from 'vue'
// Global stylesheet
import 'normalize.css/normalize.css'
import './styl/global.styl'

import App from './components/App.vue'

// Farewell annoying tip and I know what I'm doing :)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
