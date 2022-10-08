import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
import Login from '@/views/Login.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'
import Chat from '@/views/Chat/Chat.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Main,
    redirect: '/home',
    children: [
      { path: '/home', component: Home, name: 'home' },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  { path: '/search', component: Search, name: 'search' },
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true },
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 访问的是有权限的页面，需要判断用户是否登录
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 1.1 token 有值，已登录过（操作：直接放行）
      next()
    } else {
      // 1.2 token 不存在，没有登录（操作：强制跳转到登录页）
      // now：没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
      next(`/login?pre=${to.fullPath}`)
      console.log(`/login?pre=${to.fullPath}`)
      // next('/login')
    }
    next()
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

export default router
