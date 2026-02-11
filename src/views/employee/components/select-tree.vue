<template>
    <!-- element-ui级联组件 -->
    <el-cascader size="mini"
                 :options="treeData"
                 :props="props"
                 separator="-"
                 :value="value"
                 @change="changeValue" />
</template>
<script>
import { transListToTreeData } from '@/utils'
import { getDepartmentApi } from '@/api/department'
export default {
    props: {
        value: {
            type: Number,
            default: null
        }
    },
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
            // console.log(this.treeData);
        },
        // 切换选项把值通知父组件更新选项
        changeValue(list) {
            // console.log(list); // list:[1(传智教育)，2(总裁部)]
            if (list.length > 0) {
                this.$emit('input', list[list.length - 1]) // 将最后一位的id取出来 传出去
            } else {
                this.$emit('input', null) // 如果长度为 0 说明值为空
            }
        }
    }
}
</script>