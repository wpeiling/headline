import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI'

Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}

const stateStr = localStorage.getItem('state')

if (stateStr) {
  // 加载本地的数据
  initState = JSON.parse(stateStr)
}

const store = new Vuex.Store({
  state: initState,
  getters: {
    // 用户头像的计算属性
    userAvatar (state) {
    // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  },
  mutations: {
    // 更新 tokenInfo 数据的方法
    updataTokenInfo (state, payload) {
      state.tokenInfo = payload
      this.commit('saveStateToStorage')
    },
    // 将 state 持久化存储到本地
    saveStateToStorage (state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新userInfo的方法
    updateUserInfo (state, payload) {
      state.userInfo = payload
      this.commit('saveStateToStorage')
    },
    // 清空 vuex 和本地的数据
    cleanState (state) {
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 将清空后的 state 存储到本地
      this.commit('saveStateToStorage')
    },
    updateUserProfile (state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    }
  },
  actions: {
    async initUserInfo (ctx) {
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserInfo', res.data)
      }
    },
    async initUserProfile (ctx) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  modules: {
  }
})

export default store
