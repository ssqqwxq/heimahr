<!-- 权限管理 -->
<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary">添加权限</el-button>
      <!-- 表格 -->
      <!-- default-expand-all 默认展开树结构 -->
      <el-table default-expand-all :data="data" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text">添加</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissionApi } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      data: []
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
    async getPermission() {
      const res = await getPermissionApi()
      res.push({
        id: 9, // 不重复的id
        name: '测试',
        code: 'cs',
        description: '测试',
        pid: 1, // 关键：父节点是组织架构（id=1）
        type: 2,
        enVisible: '1'
      })
      console.log(res);
      const list = transListToTreeData(res, 0) // 将列表数据转化成树形结构
      this.data = list
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>