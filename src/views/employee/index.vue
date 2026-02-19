<!-- 员工 -->
<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small"
          placeholder="输入员工姓名全员搜索" v-model="queryParams.keyword" @input="changeValue" />
        <!-- 树形组件 -->
        <!-- node-key="id" 把节点的id作为标识便可使用setCurrentKey()方法 -->
        <!-- @current-change="selectNode" 当节点切换时触发 会传递当前节点对象 -->
        <el-tree ref="deptTree" :data="depts" :props="defaultProps" node-key="id" @current-change="selectNode"
          :default-expand-all="true" :expand-on-click-node="false" :highlight-current="true"></el-tree>
        <!-- 默认展开 点击箭头才展开 选中高亮 -->
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'员工-add'" size="mini" type="primary"
            @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="姓名" prop="username"></el-table-column>

          <el-table-column label="手机号" prop="mobile" sortable></el-table-column>
          <!-- sortable属性即可实现该列的排序功能 -->
          <el-table-column label="工号" prop="workNumber" sortable></el-table-column>

          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template slot-scope="{ row }">
              <span v-if="row.formOfEmployment === 1"> 正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
            </template>
          </el-table-column>

          <el-table-column label="部门" prop="departmentName"></el-table-column>

          <el-table-column label="入职时间" prop="timeOfEntry" sortable></el-table-column>

          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination layout="total,prev, pager, next" :total="total" :page-size="queryParams.pagesize"
            :current-page="queryParams.page" @current-change="changePage" />
        </el-row>
      </div>
      <ImportExcel :showExcelDialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList">
      </ImportExcel>
      <!-- 角色弹层 -->
      <el-dialog :visible.sync="showRoleDialog" title="选择角色">
        <!-- 多选框 label属性是该 checkbox 的值， el-checkbox-group v-model="roleIds" 记录点击的值 -->
        <el-checkbox-group v-model="roleIds">
          <el-checkbox :label="item.id" v-for="item in roleList" :key="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
        <template #footer>
          <el-row type="flex" justify="center">
            <el-col :span="12" style="text-align: center;">
              <el-button type="primary" size="mini" @click="btnRoleOK">确定</el-button>
              <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
            </el-col>
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDepartmentApi } from '@/api/department'
import { transListToTreeData } from '@/utils'
import { getEmployeeListApi, exportEmployeeApi, delEmployeeApi, getEnableRoleList, getEmployeeDetailApi, assignRole } from '@/api/employee'
import ImportExcel from './components/import-excel.vue'
import FileSaver from 'file-saver'

export default {
  name: 'Employee',
  data() {
    return {
      depts: [], //树组织数据
      defaultProps: {
        children: 'children', //读取子节点字段名
        label: 'name' //显示需要的字段名字
      },
      // 存储查询参数
      queryParams: {
        departmentId: null, //当前部门的id
        page: 1, //当前页码
        pagesize: 10,//当前页显示条数
        keyword: ''//根据名字模糊查询
      },
      total: 0,// 总条数数据
      list: [], // 用户数据
      showExcelDialog: false, // 导入文件弹层显示

      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据的
      currentUserId: null // 用来记录当前点击的用户id
    }
  },
  components: {
    ImportExcel
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取组织信息转换成树结构
    async getDepartment() {
      const res = await getDepartmentApi()
      this.depts = transListToTreeData(res, 0)
      // console.log(this.depts);
      // 默认选中节点 是第一个传智教育
      this.queryParams.departmentId = this.depts[0].id // log. 1
      // 等Dom渲染完再进行
      // node-key="id" → 声明 “用节点的 id 字段当唯一标识”；
      // setCurrentKey(1) → 选中 “id=1” 的节点（即 “传智教育”）；
      // setCurrentKey() 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      }) // 记录第一个默认显示的项后 发请求获取数据  这个接口传this.queryParam.departmentId=1是获取全部数据
      // 因为 所有的数据 都是 传智教育 这个项目下的部门
      this.getEmployeeList()
    },
    selectNode(node) {
      // console.log(node);
      // 切换节点时再次记录id
      this.queryParams.departmentId = node.id
      console.log(this.queryParams.departmentId);
      // 切换树结构的项记录id后再次发请求  你点别的树结构子项(传智教育下的其他部门)
      // this.queryParam.departmentId=(你点的部门的id)获取这个部门的数据
      this.queryParams.page = 1 // 切换其他部门默认页码第一页开始渲染数据
      this.getEmployeeList()
    },
    // 获取员工列表的方法
    async getEmployeeList() {
      const res = await getEmployeeListApi(this.queryParams)
      this.list = res.rows
      this.total = res.total
      // console.log(res);
    },
    // 切换页码时能拿到当前页的页码数
    changePage(newPage) {
      // alert(newPage)
      this.queryParams.page = newPage   // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    // 输入框值内容发生改变触发
    changeValue() {
      // 防抖处理  就是说你输入框值改变后1秒后发请求 如果没到1秒你又输入新值那就清除上一个定时器重新计时
      // this的实例上赋值了一个timer的属性
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1  // 从第一页开始渲染数据
        this.getEmployeeList()
      }, 1000)
    },
    // 导出员工execle表
    async exportEmployee() {
      const res = await exportEmployeeApi() //导出所有的员工接口
      console.log(res);
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(res, '员工信息表.xlsx') // 下载文件
    },
    // 删除员工
    async confirmDel(id) {
      await delEmployeeApi(id)
      console.log(this.list);
      // 如果当前页显示的数据是最后一条 那么自动往前翻一页
      if (this.list.length === 1) {
        this.queryParams.page--
      }
      this.getEmployeeList()
      this.$message.success('删除成功')
    },
    // 点击角色
    async btnRole(id) {
      const res = await getEnableRoleList()
      // console.log(res);
      this.roleList = res
      this.currentUserId = id // 记录用户id
      const { roleIds } = await getEmployeeDetailApi(this.currentUserId)
      // console.log(roleIds);
      this.roleIds = roleIds // 请求到这个用户拥有几个角色 赋值完成回显
      this.showRoleDialog = true
    },
    // 点击角色的确定
    async btnRoleOK() {
      await assignRole({
        id: this.currentUserId,//员工id
        roleIds: this.roleIds //员工角色id数组
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
