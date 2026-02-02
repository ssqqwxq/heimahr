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