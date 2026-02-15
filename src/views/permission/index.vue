<!-- 权限管理 -->
<template>
  <div class="container">
    <div class="app-container">
      <!-- 🔥 调用时传参数：一级权限传 (0,1)，二级权限传 (row.id,2) -->
      <el-button class="btn-add" size="mini" type="primary" @click="add(0, 1)">添加权限</el-button>
      <!-- 表格 -->
      <el-table default-expand-all :data="data" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <!-- 🔥 二级权限传 (row.id,2) -->
            <el-button v-if="row.type === 1" size="mini" type="text" @click="add(row.id, 2)">添加</el-button>
            <el-button size="mini" type="text" @click="edit(row)">编辑</el-button>
            <el-button slot="reference" @click="del(row.id)" style="margin-left:10px" size="mini"
              type="text">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!-- 弹层 -->
      <el-dialog title=" 新增" :visible.sync="showDialog" @close="btnCancel">
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="12">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPermissionApi, addPermission, updatePermission, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'

export default {
  name: 'Permission',
  data() {
    return {
      data: [],
      showDialog: false,
      formData: {
        name: '', //名称
        code: '', //标识
        description: '', // 描述
        type: '1', // 类型 1为一级添加 2为二级添加
        pid: '0', // 子pid = 父id 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0', // 默认关闭 0/1
        id: null, // 记录id 点击的id就是子项的pid
      },

      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },

  created() {
    this.getPermission()
  },
  methods: {
    async getPermission() {
      const res = await getPermissionApi()
      res.push({
        id: 9,
        name: '测试',
        code: 'cs',
        description: '测试',
        pid: 1,
        type: 2,
        enVisible: '1'
      })
      console.log(res);
      const list = transListToTreeData(res, 0)
      this.data = list
    },

    // 🔥 合并后的add方法：一个方法处理一级/二级权限
    add(pid, type) {
      // console.log(pid, type);// 0 1 是添加权限 1 2 给组织架构下添加 1是组织架构的id===子的pid
      this.btnCancel() // 先重置，避免旧数据
      this.formData.pid = pid // 父节点ID（0=一级，row.id=二级）
      this.formData.type = type // 类型（1=一级，2=二级）
      this.showDialog = true
    },

    // 弹层确认 区分新增/编辑
    btnOK() {
      this.$refs.perForm.validate(async (isok) => {
        if (isok) {
          // 有id是编辑
          if (this.formData.id) {
            await updatePermission(this.formData)
            this.$message.success('编辑成功')
          } else {
            // 添加
            const res = await addPermission(this.formData)
            // console.log(res);
            this.getPermission()
            this.$message.success('添加成功')
          }
          // 重置表单 + 刷新页面
          this.getPermission()
          this.btnCancel()
        }
      })
    },
    // 编辑 回显
    async edit(row) {
      // console.log(row);
      this.showDialog = true
      this.formData.id = row.id  // 把拿到的id存起来
      this.formData = row
    },
    // 删除
    async del(id) {
      // console.log(id);
      await this.$confirm('确定要删除该数据吗')
      await delPermission(id)
      this.getPermission()
      this.$message.success('删除成功！')
    },

    // 重置方法
    btnCancel() {
      this.showDialog = false
      this.$refs.perForm.resetFields() // 清除校验和表单数据
      // 手动重置表单数据
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '1',
        pid: '0',
        enVisible: '0',
        id: null
      }
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>