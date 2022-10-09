import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index.js'
import { exchangeTokenAPI } from '@/api/userAPI.js'
import router from '@/router'

// 调用 axios.create() 方法，创建 axios 的实例对象
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    Toast.loading({
      message: '加载中...', // 文本内容
      duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    // 1. 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      //  添加身份认证字段
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },

  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },

  function (error) {
    Toast.clear()
    const tokenInfo = store.state.tokenInfo
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      console.log('token过期啦')
      try {
        const { data: res } = exchangeTokenAPI(tokenInfo.refresh_token)
        store.commit('updataTokenInfo', { token: res.tokenInfo.token, refresh_token: tokenInfo.refresh_token })

        return request(error.config)
      } catch (error) {
        store.commit('cleanState')
        router.replace('/login?pre=' + router.currentRoute.fullPath)
      }
    }
    return Promise.reject(error)
  }
)

export default request
