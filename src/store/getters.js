// 建立对模块属性的快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,//头像
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId
}
export default getters
