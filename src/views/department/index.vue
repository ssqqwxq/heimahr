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
                 default-expand-all
                 :expand-on-click-node="false">
            <!--  ↑↑↑如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 -->

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
                        <!-- 下拉菜单区域  -->
                        <!-- $event 是指传递默认的command='add/edit/del'参数 data.id是指你点的是谁的操作按钮的id  -->
                        <el-dropdown @command="operateDept($event, data.id)">
                            <span class="el-dropdown-link">
                                操作<i class="el-icon-arrow-down el-icon--right" />
                            </span>
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
        <!-- 操作 弹层 -->
        <!-- sync 是语法糖 把原本的 @update:showDialog="showDialog = $event"监听子组件派发的update:showDialog事件，直接把事件参数赋值给父组件简写了 -->
        <addDialog ref="addDept"
                   :showDialog.sync="showDialog"
                   :current_NodeId="currentNodeId"
                   @updateList=getDepartment>
        </addDialog>
        <!-- :current_NodeId="currentNodeId" 是指把你点击的比如'传智教育'的id传给子组件
         因树结构id=pid所以根据id能明白点的是不是某个父项的子项-->
    </div>
</template>

<script>
import { Icon } from 'element-ui';

import { getDepartmentApi } from '@/api/department'
import { transListToTreeData } from '@/utils'
import addDialog from './components/add-dialog.vue';

export default {
    name: 'department',
    created() {
        this.getDepartment()
    },
    data() {
        return {
            currentNodeId: null, // 存储当前点击的id
            showDialog: false,  // 操作 弹层
            depts: [],
            defaultProps: {
                children: 'children', //读取子节点字段名
                label: 'name' //显示需要的字段名字
            }
        }
    },
    methods: {
        // 获取部门信息
        async getDepartment() {
            const res = await getDepartmentApi()
            this.depts = transListToTreeData(res, 0)
            console.log(this.depts);
        },
        // 点击 操作菜单触发的函数
        operateDept(type, id) {
            // console.log('父组件点击的原始id：', id, typeof id); // 新增：看点击的真实id
            if (type === 'add') {
                this.showDialog = true
                this.currentNodeId = id
                // console.log(type, id);
            } else if (type == 'edit') {
                this.showDialog = true
                this.currentNodeId = id // 存储本次点击的id传给子
                // console.log('父组件赋值给currentNodeId的id：', this.currentNodeId); // 新增：看赋值后的值
                //nextTick(() => {}) 等Dom加载完成
                this.$nextTick(() => {
                    this.$refs.addDept.getDepartmentDetail() // this.$refs.addDept等同于子组件的this
                })
            }
        }
    },
    computed: {

    },
    components: { addDialog }
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
    width: 70px;
    display: inline-block;
    margin: 30px;
}
</style>
