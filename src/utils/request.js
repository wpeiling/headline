import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index.js'

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
    Toast.clear()
    return response
  },

  function (error) {
    return Promise.reject(error)
  }
)

export default request
