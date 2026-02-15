// 获取权限
import request from '@/utils/request'

export function getPermissionApi() {
    return request({
        url: '/sys/permission'
    })
}