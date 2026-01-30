import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  // Vue代码中NODE_ENV之外，所有的变量必须以VUE_APP_开头
  baseURL: process.env.VUE_APP_BASE_API, //( '/api' )页面请求地址会加上这个前缀 如 /api/sys/login
  timeout: 10000 //请求超时时间
})

// 请求拦截器
service.interceptors.request.use((config) => {
  // 注入token
  // store.getters.token => 请求头里面
  // 成功
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
},
  // 失败
  (error) => {
    return Promise.reject(error)
  })

// 响应拦截器
// 根据返回的默认数据格式(可解析出success) 判断 如果成功那就返回数据 否则提示错误信息
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message: message })
    return Promise.reject(new Error(message))
  }
},
  (error) => {
    // debugger
    if (error.response.status === 401) {
      Message({ type: 'error', message: 'token过期,请重新登录' })
      // token过期
      store.dispatch('user/logout')
      router.push('/login') //跳转到登录页
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  })

export default service