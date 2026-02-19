import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from './router/modules/permission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 自定义指令 控制添加员工按钮权限
Vue.directive('permission', {
  // 会在指令作用的元素插入到页面完成以后触发
  inserted(el, binding) {
    // el 指令作用的元素的dom对象
    // binding 是v-permission="表达式" 拿到的信息
    console.log(el, binding);
    const points = store.state.user.userInfo.roles.points
    if (!points.includes(binding.value)) {
      // 不存在就要删除或者禁用
      el.remove() // 删除元素
      // el.disabled = true
      // 线上的权限数据和线下的代码进行对应
    }

  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
