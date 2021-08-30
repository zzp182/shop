import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// import notice from './components/notice/index';


axios.defaults.baseURL = 'http://121.5.240.120:8000/api/private/v1/'
axios.interceptors.request.use((config)=>{
     config.headers.Authorization = window.sessionStorage.getItem('token')
     return config
})
Vue.prototype.$http = axios
Vue.component('tree-table',TreeTable)
// Vue.prototype.$notice = notice

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
