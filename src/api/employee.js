import request from '@/utils/request'
// 获取员工列表
export function getEmployeeListApi(params) {
    return request({
        url: '/sys/user',
        params
    })
}
// 导出员工的excel
export function exportEmployeeApi() {
    return request({
        url: '/sys/user/export',
        // 改变接收数据的类型
        responseType: 'blob' // 使用blob接收二进制文件流
    })
} 