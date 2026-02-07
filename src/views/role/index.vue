<!-- 角色管理 -->
<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini"
                   type="primary"
                   @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column align="center"
                         width="200"
                         label="角色"
                         prop="name">
        </el-table-column>
        <el-table-column align="center"
                         width="200"
                         label="启用"
                         prop="state">
          <!-- 自定义'启用'列结构  作用域插槽-->
          <template v-slot="{ row }">
            <span>{{ row.state ? '已启用' : '未启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="描述"
                         prop="description">
        </el-table-column>
        <el-table-column align="center"
                         label="操作">
          <!-- 自定义'操作'结构 默认插槽 -->
          <template v-slot>
            <el-button type="text"
                       size="mini">分配权限</el-button>
            <el-button type="text"
                       size="mini">编辑</el-button>
            <el-button type="text"
                       size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex"
              style="height:60px"
              align="middle"
              justify="end">
        <!-- 放置分页组件 total page-size current-page 是el语法-->
        <el-pagination layout="prev, pager, next"
                       :total="pageParams.total"
                       :page-size="pageParams.pagesize"
                       :current-page="pageParams.page"
                       @current-change="changePage" />
        <!-- currentPage 触发会显示当前页 比如点击第2页会跳到第二页 -->
      </el-row>
      <!--
prev	上一页按钮	« 上一页
pager	页码数字按钮	1 2 3 4 5
next	下一页按钮	下一页 »
jumper	页码跳转输入框	前往第 □ 页
total	数据总条数显示	共 50 条
sizes	每页条数选择器	10 条 / 页 ▼（可选择 5/10/20） -->
    </div>
    <el-dialog @close="btnCancel"
               width="500px"
               title="新增角色"
               :visible.sync="showDialog">
      <!-- .sync 会自动监听这个 update:visible 事件，把事件参数（false）赋值给 showDialog； -->

      <!-- 表单内容 -->
      <el-form ref="roleForm"
               :model="roleForm"
               :rules="rules"
               label-width="120px">
        <el-form-item prop="name"
                      label="角色名称">
          <el-input v-model="roleForm.name"
                    style="width:300px"
                    size="mini" />
        </el-form-item>

        <!-- 如果不需要校验 就不需要写 prop属性  如果需要重置就要写-->
        <el-form-item label="启用"
                      prop="state">
          <!--  :active-value="1" switch 打开时的值 = 1
              :inactive-value switch 关闭时的值 = 0         -->
          <el-switch v-model="roleForm.state"
                     :active-value="1"
                     :inactive-value="0"
                     size="mini" />
        </el-form-item>

        <el-form-item prop="description"
                      label="角色描述">
          <el-input v-model="roleForm.description"
                    type="textarea"
                    :rows="3"
                    style="width:300px"
                    size="mini" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <!-- 开启弹性布局 水平居中 col宽度占一半  -->
          <el-row type="flex"
                  justify="center">
            <el-col :span="12">
              <el-button type="primary"
                         size="mini"
                         @click="btnOK">确定</el-button>
              <el-button size="mini"
                         @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleListApi, addRoleApi } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false,// 控制弹层
      list: [],
      pageParams: {
        page: 1, //当前页
        pagesize: 5, //当前页显示的数据条数
        total: 0 //	总条目数
      },
      roleForm: {
        name: '',
        description: '',
        state: 0  // 默认是0  1是开
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleListApi(this.pageParams)
      // console.log(res);
      const { rows, total } = res
      this.list = rows
      this.pageParams.total = total
    },
    // 切换分页，请求新数据
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getRoleList()
    },
    // 确认按钮 添加角色逻辑
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRoleApi(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    // 取消按钮 重置表单关闭弹层逻辑
    btnCancel() {
      this.$refs.roleForm.resetFields() // 重置表单数据
      this.showDialog = false // 关闭弹层
    },
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
