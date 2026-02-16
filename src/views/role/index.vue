<!-- 角色管理 -->
<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column align="center" width="200" label="角色" prop="name">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.name"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="启用" prop="state">
          <!-- 自定义'启用'列结构  作用域插槽-->
          <template v-slot="{ row }">
            <!-- 开 1 关 0 -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0"></el-switch>
            <span v-else>{{ row.state ? '已启用' : '未启用' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="描述" prop="description">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" type="textarea" v-model="row.editRow.description"></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <!-- 自定义'操作'结构  -->
          <template v-slot="{ row }">
            <!-- 编辑状态 -->
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确认</el-button>
              <el-button type="info" size="mini">取消</el-button>
            </template>
            <!-- 非编辑状态 -->
            <template v-else>
              <el-button type="text" size="mini" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button type="text" size="mini" @click="btnEditRow(row)">编辑</el-button>
              <!-- 删除-气泡确认框 -->
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>

        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 total page-size current-page 是el语法-->
        <el-pagination layout="prev, pager, next" :total="pageParams.total" :page-size="pageParams.pagesize"
          :current-page="pageParams.page" @current-change="changePage" />
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
    <!-- '添加角色' 弹层 -->
    <el-dialog @close="btnCancel" width="500px" title="新增角色" :visible.sync="showDialog">
      <!-- .sync 会自动监听这个 update:visible 事件，把事件参数（false）赋值给 showDialog； -->

      <!-- 表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>

        <!-- 如果不需要校验 就不需要写 prop属性  如果需要重置就要写-->
        <el-form-item label="启用" prop="state">
          <!--  :active-value="1" switch 打开时的值 = 1
              :inactive-value switch 关闭时的值 = 0     (替换掉默认的布尔值) -->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>

        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <!-- 开启弹性布局 水平居中 col宽度占一半  -->
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配权限弹层 -->
    <el-dialog :visible.sync="showPermission" title="分配权限">
      <!-- 树结构数据  default-checked-keys 选中节点的key数组   node-key="id" id为节点的唯一标识  :check-strictly="true"父子不关联-->
      <el-tree ref="permTree" :check-strictly="true" :data="permissionData" :props="{ label: 'name' }"
        :default-expand-all="true" :show-checkbox="true" :default-checked-keys="permIds" node-key="id">
      </el-tree>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="12" style="text-align: center;">
            <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
            <el-button size="mini" @click="showPermission = false">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleListApi, addRoleApi, updateRoleApi, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { getPermissionApi } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'

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
        state: 0  // 默认是0关  1是开
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      // 分配权限
      showPermission: false, // 分配权限弹层
      permissionData: [], // 存储权限树形数据
      currentRoleId: null, // 点击的id
      permIds: [] // 角色关联的权限集合
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleListApi(this.pageParams)
      const { rows, total } = res
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      rows.forEach(item => {
        // item.isEdit = false // 添加一个属性 初始值为false
        // 数据响应式的问题  数据变化 视图更新
        // 添加的动态属性 不具备响应式特点
        // this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象 添加的属性 添加响应式
        // 用 this.$set 而不是直接赋值 item.isEdit = false，
        // 是为了让动态添加的 isEdit 具备 Vue 响应式，修改后能实时更新视图。
        this.$set(item, 'isEdit', false)
        // 再给每一项添加一个响应的缓存数据 与编辑状态时的列双向绑定
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      }); // 行内编辑需要
      // console.log(res);
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
      this.$refs.roleForm.resetFields() // 重置有绑定prop的字段 + 清校验
      this.showDialog = false // 关闭弹层
    },
    // 行内编辑 点击操作列的编辑
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name,
        row.editRow.state = row.state,
        row.editRow.description = row.description
      // console.log(row);
      // 更新缓存数据  row.editRow.name = row.name,,缓存数据来源于真实数据都是叫'王大'
      // 若编辑状态我给绑定了缓存数据的 输入框写了'王大'123，退出编辑状态再次点击编辑我希望
      // 输入框显示的是 '王大' 而不是 '王大'123
    },
    // 行内编辑 确定
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        // 点击 确定按钮行内编辑时不为空发请求更显数据
        await updateRoleApi({ ...row.editRow, id: row.id })
        this.$message.success('编辑成功')
        // 上面请求修改的缓存数据 editRow ,关闭行内编辑时
        // 要把缓存数据给显示的真实数据  
        row.name = row.editRow.name
        row.state = row.editRow.state
        row.description = row.editRow.description
        row.isEdit = false // 退出编辑模式
        // console.log('原始row.editRow:', { ...row.editRow }, '添加id后:', { ...row.editRow, id: row.id });
        //原来row.editRow没有id属性,这样写会加个id属性来满足接口要求
        //原始row.editRow: {name: '123', state: 0, description: '1231232'} 
        //添加id后:        {name: '123', state: 0, description: '1231232', id: 12}
      } else {
        this.$message.warning('不能为空')
      }
    },
    // 删除的气泡框点击确定时
    async confirmDel(id) {
      await delRole(id)
      this.$message.success('删除角色成功')
      // 删除的如果是最后一个 返回上一页
      // console.log(this.list);
      if (this.list.length === 1) {
        this.pageParams.page--
        this.getRoleList()
      }
    },
    // 点击分配权限
    async btnPermission(id) {
      const res = await getPermissionApi()
      // console.log(res);
      this.permissionData = transListToTreeData(res, 0) // 存储树结构数据
      // console.log(this.permissionData);
      this.currentRoleId = id  // 根据id获取该角色关联的权限集合
      const { permIds } = await getRoleDetail(this.currentRoleId)
      // console.log(permIds);
      this.permIds = permIds
      this.showPermission = true // 先获取数据再打开弹层 避免出现先开弹层数据还没获取的延迟现象
    },
    // 分配权限弹层 确认
    async btnPermissionOK() {
      const res = await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermission = false
    }
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
