import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 箭头函数写法
// export const login = (data) => {
//   return request.post('/sys/login', data

//   )
// }

// 获取用户信息
export function UserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get',
  })
}
// 修改密码
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

