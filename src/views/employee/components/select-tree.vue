<template>
    <!-- element-ui级联组件 -->
    <el-cascader size="mini"
                 :options="treeData"
                 :props="props"
                 separator="-" />
</template>
<script>
import { transListToTreeData } from '@/utils'
import { getDepartmentApi } from '@/api/department'
export default {
    data() {
        return {
            treeData: [], // 赋值给 级联组件的options
            props: {
                label: 'name', // 要展示的字段
                value: 'id' // 要存储的字段
            }
        }
    },
    created() {
        this.getDepartment()
    },
    methods: {
        async getDepartment() {
            const res = await getDepartmentApi()
            this.treeData = transListToTreeData(res, 0) // 将组织架构的数据 转化树形赋值给treeData
            console.log(this.treeData);

        }
    }
}
</script>