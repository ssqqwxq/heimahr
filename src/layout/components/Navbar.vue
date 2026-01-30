<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container"
                   trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar"
               :src="avatar"
               class="user-avatar">
          <!-- 没有头像信息就默认显示用户名首字母(?若没有名字就不往下进行charAt方法) -->
          <span v-else
                class="username">{{ name?.charAt(0) }}</span>
          <!-- 名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank"
             href="https://github.com/ssqqwxq/heimahr.git">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank"
             @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native 是指给原生的标签绑定事件
          这里使用 @click.native 而不是 @click 是因为 el-dropdown-item 组件没有clike事件 -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码的对话窗 -->
    <el-dialog width="500px"
               title="修改密码"
               :modal="false"
               :visible.sync="showDialog">
      <!-- 密码区域 show-password密码形式-->
      <el-form ref="passForm"
               label-width="120px"
               :model="passForm"
               :rules="rules">
        <el-form-item label="旧密码"
                      prop="oldPassword">
          <el-input v-model="passForm.oldPassword"
                    show-password
                    size="small" />
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-input v-model="passForm.newPassword"
                    size="small" />
        </el-form-item>
        <el-form-item label="重复密码"
                      prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword"
                    size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini"
                     type="primary"
                     @click="btnOK">确认修改</el-button>
          <el-button size="mini"
                     @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      rules: {
        oldPassword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar' //头像
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatePassword() {
      this.showDialog = true
    },
    // 修改密码按钮
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    // 取消按钮
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .name {
          margin-right: 10px;
          font-size: 13px;
        }

        .username {
          width: 30px;
          height: 30px;
          background-color: #409eff;
          color: #fff;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
