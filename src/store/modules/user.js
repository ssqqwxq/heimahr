import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 从缓存中读取默认token
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
  }
}

const actions = {
  async login(context, data) {
    // console.log('执行login方法', data);
    const token = await login(data)
    // 模拟登录成功 获得了token是123456，设置token
    context.commit('setToken', token)
  }
}

export default {
  // 开启命名空间
  namespaced: true,
  state,
  mutations,
  actions
}