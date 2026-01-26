import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
//把 SvgIcon 组件注册为全局组件，组件名是 svg-icon
Vue.component('svg-icon', SvgIcon)

// require.context(扫描路径，是否扫描子路径，正则-只扫描以.svg结尾的文件) 是 webpack 提供的一个特殊函数
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
// 1. requireAll(req) 把req传递给requireAll函数就是 req.keys()
// 2.req.keys() 会返回 ./svg 文件夹下所有 SVG 文件的路径数组
requireAll(req) // 调用函数传参
// console.log(req.keys());  ['./eye.svg', './wechat.svg'......]
// 总结 req.keys() 是扫描  .map(req)是导入