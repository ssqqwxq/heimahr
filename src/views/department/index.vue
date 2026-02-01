<!-- // 组织架构-->
<template>
    <div class="dashboard-container">
        <div class="dashboard-text"></div>
        <!-- 使用svg图标组件
    设置icon-class属性来切换图标 -->
        <!-- <svg-icon icon-class="eye"></svg-icon>
    <svg-icon icon-class="wechat"></svg-icon> -->

        <!-- 展示树结构 -->
        <el-tree :data="depts"
                 :props="defaultProps"
                 default-expand-all>
            <!-- 节点结构 -->
            <!--自定义节点内容 插槽获取到  v-slot="{ data,和 node }" -->
            <template v-slot="{ data }">
                <el-row style="width:100%;height:40px"
                        type="flex"
                        justify="space-between"
                        align="middle">
                    <el-col>{{ data.name }}</el-col>
                    <el-col :span="4">
                        <span class="tree-manager">{{ data.managerName }}</span>
                        <!-- $event 实参 表示类型 -->
                        <el-dropdown>
                            <!-- 显示区域内容 -->
                            <span class="el-dropdown-link">操作<i class="el-icon-arrow-down el-icon--right" /></span>
                            <!-- 下拉菜单选项 -->
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                                <el-dropdown-item command="del">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </template>
        </el-tree>
    </div>
</template>

<script>
import { Icon } from 'element-ui';

import { getDepartmentApi } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
    name: 'department',
    created() {
        this.getDepartment()
    },
    data() {
        return {
            depts: [],
            defaultProps: {
                children: 'children', //读取子节点字段名
                label: 'name' //显示需要的字段名字
            }
        }
    },
    methods: {
        async getDepartment() {
            const res = await getDepartmentApi()
            this.depts = transListToTreeData(res, 0)
            console.log(this.depts);
        }
    },
    computed: {

    },
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;

    }

    &.row {
        border: 1px solid blue;
    }

    &-text {
        font-size: 30px;
        line-height: 46px;
    }


}

.tree-manager {
    width: 50px;
    display: inline-block;
    margin: 60px;
}
</style>
