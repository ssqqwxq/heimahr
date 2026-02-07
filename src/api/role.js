// 获取角色列表
import request from '@/utils/request'

export function getRoleListApi(params) {
    return request({
        url: '/sys/role',
        params // 查询参数
    })
}