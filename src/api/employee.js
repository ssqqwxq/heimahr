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
// 下载员工excel模板
export function getExportTemplate() {
    return request({
        url: '/sys/user/import/template',
        // 改变接收数据的类型
        responseType: 'blob' // 使用blob接收二进制文件流
    })
}
// 上传用户的excel
export function uploadExcelApi(data) {
    return request({
        url: '/sys/user/import',
        method: 'post',
        data // form-data类型 因为要上传文件类型
    })
}
// 删除员工
export function delEmployeeApi(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'DELETE',
    })
}
// 添加员工
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}