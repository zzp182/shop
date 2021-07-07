import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css'
import axios from 'axios'
// import notice from './components/notice/index';


axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use((config)=>{
     config.headers.Authorization = window.sessionStorage.getItem('token')
     return config
})
Vue.prototype.$http = axios
// Vue.prototype.$notice = notice

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')