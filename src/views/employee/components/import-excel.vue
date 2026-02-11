<template>
    <el-dialog width="500px"
               title="员工导入"
               :visible="showExcelDialog"
               @close="$emit('update:showExcelDialog', false)">
        <el-row type="flex"
                justify="center">
            <div class="upload-excel">
                <!-- 上传文件的弹出选择文件 -->
                <input ref="excel-upload-input"
                       class="excel-upload-input"
                       type="file"
                       accept=".xlsx, .xls"
                       @change="uploadChange"> <!--选择文件-打开 触发后-->
                <div class="drop">
                    <i class="el-icon-upload" />
                    <el-button type="text"
                               @click="getTemplate">下载导入模板
                    </el-button>
                    <span>将文件拖到此处或
                        <el-button type="text"
                                   @click="handleUpload">点击上传
                        </el-button>
                    </span>
                </div>
            </div>
        </el-row>
        <el-row type="flex"
                justify="end">
            <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
            <el-button size="mini"
                       type="primary"
                       @click="$emit('update:showExcelDialog', false)">取消</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { getExportTemplate, uploadExcelApi } from '@/api/employee'
import FileSaver from 'file-saver'
export default {
    props: {
        showExcelDialog: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async getTemplate() {
            const res = await getExportTemplate()
            FileSaver.saveAs(res, '员工导入模版.xlsx')  // FileSaver.saveAs(blob对象,文件名称)
        },
        // 点击上传-弹出文件选择框
        handleUpload() {
            this.$refs["excel-upload-input"].click() // this.$refs.属性名 和 this.$refs[属性名] 等价
        },
        // 选择文件-打开 触发后
        // e 事件对象	e.target.files触发事件对象的input元素的文件列表（FileList）
        uploadChange(e) {
            //console.log(e.target.files);// {name: '员工信息表.xlsx'....} length:1
            // 如果 length > 0 说明有文件要上传
            if (e.target.files.length > 0) {
                const data = new FormData()
                data.append('file', e.target.files[0])
                // 成功
                try {
                    uploadExcelApi(data)
                    this.$emit('uploadSuccess') // 通知父组件 我上传成功
                    this.$emit('update:showExcelDialog', false) // 关闭弹层
                }
                // 失败
                catch (error) { }
                // 成功失败都会执行
                finally {
                    this.$refs["excel-upload-input"].value = '' // 避免下次上传是同一个文件
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.upload-excel {
    display: flex;
    justify-content: center;
    margin: 20px;
    width: 360px;
    height: 180px;
    align-items: center;
    color: #697086;

    .excel-upload-input {
        display: none;
        z-index: -9999;
    }

    .btn-upload,
    .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .drop {
        line-height: 40px;
        color: #bbb;

        i {
            font-size: 60px;
            display: block;
            color: #c0c4cc;
        }
    }
}
</style>