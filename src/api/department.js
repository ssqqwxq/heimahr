import request from '@/utils/request'

// 获取组织信息
export function getDepartmentApi() {
    return request({
        url: '/company/department'
    })
}
// 获取部门负责人信息
export function getManagerListApi() {
    return request({
        url: '/sys/user/simple'
    })
}

// 新增部门
export function addDepartmentApi(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}
// 获取部门详情用于回显
export function getDepartmentDetailApi(id) {
    return request({
        url: `/company/department/${id}`
    })
}
// 编辑/更新部门信息
export function updateDepartmentApi(data) {
    return request({
        method: 'put',
        url: `/company/department/${data.id}`,
        data
    })
}
// 删除部门
export function delDepartmentApi(id) {
    return request({
        method: 'delete',
        url: `/company/department/${id}`
    })
}
