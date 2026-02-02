import request from '@/utils/request'

// 获取组织信息
export function getDepartmentApi() {
    return request({
        url: '/company/department'
    })
}