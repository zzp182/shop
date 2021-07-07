import Vue from 'vue'
import VueRouter from 'vue-router'
 import Home from '../components/Home.vue'
import login from '../components/login.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/user.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'

Vue.use(VueRouter)

  const routes = [

    {path: '/',redirect:'/login'},
    {path:'/login',component:login},
    {path: '/home',name: 'Home',component: Home , redirect:'/welcome', 
    children:[
      {path: '/welcome' ,component:Welcome},
      {path: '/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:GoodsList},
    ]}
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import( '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router

//防止重复点击而报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
