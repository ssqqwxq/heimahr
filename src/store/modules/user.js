import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
import { UserInfo } from '@/api/user'
import router from '@/router'

const state = {
  token: getToken(), // 从缓存中读取默认token
  userInfo: '' // 用户基本信息
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
  }
}

export default {
  // 开启命名空间
  namespaced: true,
  state,
  mutations,
  actions
}