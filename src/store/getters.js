// 建立对模块属性的快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,//头像
  name: state => state.user.userInfo.username,// 名称
  userId: state => state.user.userInfo.userId,
  routes: state => state.user.routes,
  company: state => state.user.userInfo.company,//公司名
  departmentName: state => state.user.userInfo.departmentName //部门名
}
export default getters


