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
      <el-table>
        <!-- 放置列 -->
        <el-table-column align="center"
                         width="200"
                         label="角色" />
        <el-table-column align="center"
                         width="200"
                         label="启用" />
        <el-table-column align="center"
                         label="描述" />
        <el-table-column align="center"
                         label="操作" />
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
export default {
  name: 'Role'
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
