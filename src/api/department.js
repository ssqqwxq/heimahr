import request from '@/utils/request'

export function getDepartmentApi() {
    return request({
        url: '/company/department'
    })
}