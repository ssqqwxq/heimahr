<!-- 员工 -->
<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px"
                  type="text"
                  prefix-icon="el-icon-search"
                  size="small"
                  placeholder="输入员工姓名全员搜索" />
        <!-- 树形组件 -->
        <!-- node-key="id" 把节点的id作为标识便可使用setCurrentKey()方法 -->
        <!-- @current-change="selectNode" 当节点切换时触发 会传递当前节点对象 -->
        <el-tree ref="deptTree"
                 :data="depts"
                 :props="defaultProps"
                 node-key="id"
                 @current-change="selectNode"
                 :default-expand-all="true"
                 :expand-on-click-node="false"
                 :highlight-current="true"></el-tree>
        <!-- 默认展开 点击箭头才展开 选中高亮 -->
      </div>
      <div class="right">
        <el-row class="opeate-tools"
                type="flex"
                justify="end">
          <el-button size="mini"
                     type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartmentApi } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Employee',
  data() {
    return {
      depts: [], //组织数据
      defaultProps: {
        children: 'children', //读取子节点字段名
        label: 'name' //显示需要的字段名字
      },
      // 存储查询参数
      queryParams: {
        departmentId: null
      }
    }
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
      })
    },
    selectNode(node) {
      // console.log(node);
      // 切换节点时再次记录id
      this.queryParams.departmentId = node.id
      console.log(this.queryParams.departmentId);
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
