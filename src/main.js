import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.less'
import './styles/index.less'
import 'amfe-flexible'
import './index.less'
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 导入本地化语言
import Vant, { Lazyload } from 'vant'

Vue.use(Lazyload)

// 注册时可以配置额外的选项
Vue.use(Lazyload)

// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 使用本地化语言

Vue.filter('dateFormate', dt => {
  return dayjs().to(dt)
})

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
