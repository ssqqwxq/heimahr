import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
import { UserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 从缓存中读取默认token
  userInfo: '',// 用户基本信息
  routes: constantRoutes // 静态路由的数组
}

const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  delToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userinfoRes) {
    state.userInfo = userinfoRes
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 静态路由+动态路由
    console.log(state.routes);
  }
}

const actions = {
  async login(context, data) {
    // console.log('执行login方法', data);
    const token = await login(data)
    // 模拟登录成功 获得了token是123456，设置token
    context.commit('setToken', token)
  },
  // 获取用户基本资料（包括权限）
  async getUserInfo(context) {
    const res = await UserInfo()
    // console.log(res)
    context.commit('setUserInfo', res)
    return res
  },
  logout(context) {
    context.commit('setUserInfo', {}) //清理用户信息
    context.commit('delToken') //清理token
    // 重置路由
    resetRouter()
  }
}

export default {
  // 开启命名空间
  namespaced: true,
  state,
  mutations,
  actions
}