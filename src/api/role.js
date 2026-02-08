// 获取角色列表
import request from '@/utils/request'

export function getRoleListApi(params) {
    return request({
        url: '/sys/role',
        params // 查询参数
    })
}
// 新增角色
export function addRoleApi(data) {
    return request({
        url: '/sys/role',
        method: 'post',
        data
    })
}
//  行内 编辑/更新 角色
export function updateRoleApi(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'put',
        data
    })
}
// 删除角色
export function delRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'DELETE',
    })
}