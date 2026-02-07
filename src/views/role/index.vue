<!-- 角色管理 -->
<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini"
                   type="primary">添加角色</el-button>
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
        <!-- 放置分页组件 -->
        <el-pagination layout="prev, pager, next"
                       :total="50" />
      </el-row>
      <!--
prev	上一页按钮	« 上一页
pager	页码数字按钮	1 2 3 4 5
next	下一页按钮	下一页 »
jumper	页码跳转输入框	前往第 □ 页
total	数据总条数显示	共 50 条
sizes	每页条数选择器	10 条 / 页 ▼（可选择 5/10/20） -->
    </div>
  </div>
</template>
<script>
import { getRoleListApi } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleListApi()
      // console.log(res);
      const { rows } = res
      this.list = rows
    }
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
