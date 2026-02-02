<template>
    <el-dialog title="新增部门"
               :visible="showDialog"
               @close="close">
        <el-form :model="formData"
                 :rules="rules"
                 label-width="120px">
            <el-form-item prop="name"
                          label="部门名称">
                <el-input v-model="formData.name"
                          placeholder="2-10个字符"
                          style="width: 80%"
                          size="mini" />
            </el-form-item>
            <el-form-item prop="code"
                          label="部门编码">
                <el-input v-model="formData.code"
                          placeholder="2-10个字符"
                          style="width: 80%"
                          size="mini" />
            </el-form-item>
            <el-form-item prop="managerId"
                          label="部门负责人">
                <el-select v-model="formData.managerId"
                           placeholder="请选择负责人"
                           style="width: 80%"
                           size="mini">
                    <!-- label 显示字段 value 存储字段  -->
                    <el-option v-for="item in managerList"
                               :key="item.id"
                               :label="item.username"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="introduce"
                          label="部门介绍">
                <el-input v-model="formData.introduce"
                          placeholder="1-100个字符"
                          type="textarea"
                          size="mini"
                          :rows="4"
                          style="width: 80%" />
            </el-form-item>
            <el-form-item>
                <!-- 按钮 -->
                <el-row type="flex"
                        justify="center">
                    <el-col :span="12">
                        <el-button size="mini"
                                   type="primary">确定</el-button>
                        <el-button size="mini">取消</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import { getDepartmentApi, getManagerListApi } from '@/api/department'
export default {
    props: {
        showDialog: {
            type: Boolean
        }
    },
    created() {
        this.getManagerList()
    },
    data() {
        return {
            managerList: [], // 存储负责人列表
            formData: {
                code: '',//部门编码
                introduce: '',//部门介绍
                managerId: '',//部门负责人名字
                name: '',//部门名称
                pid: '',//部门父级部门id
            },
            rules: {
                // 部门编码
                code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
                {
                    min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
                },
                // 自定义校验规则 输入的不能跟 已有的数据重复
                {
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        const res = await getDepartmentApi()
                        if (res.some(item => item.code === value)) {
                            callback(new Error('已有此编码'))
                        } else {
                            callback()
                        }
                    }
                }
                ],
                // 部门介绍
                introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
                    min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
                }],
                // 部门负责人id
                managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
                // 部门名称
                name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
                {
                    min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur'
                },
                {
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        const res = await getDepartmentApi()
                        if (res.some(item => item.name === value)) {
                            callback(new Error('已有此名称'))
                        } else {
                            callback()
                        }
                    }
                }]
                // pid: '' // 父级部门的id 不需要做校验
            }
        }
    },
    methods: {
        close() {
            this.$emit('update:showDialog', false)
        },
        async getManagerList() {
            const res = await getManagerListApi()
            this.managerList = res
        }
    }
}
</script>