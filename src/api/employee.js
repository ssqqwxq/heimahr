import request from '@/utils/request'
// 获取员工列表
export function getEmployeeListApi(params) {
    return request({
        url: '/sys/user',
        params
    })
}