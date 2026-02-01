<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo"
          :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu"
               :collapse="isCollapse"
               :background-color="variables.menuBg"
               :text-color="variables.menuText"
               :unique-opened="false"
               :active-text-color="variables.menuActiveText"
               :collapse-transition="false"
               mode="vertical">
        <sidebar-item v-for="route in routes"
                      :key="route.path"
                      :item="route"
                      :base-path="route.path" />
        <!-- 给子组件传递父组件的地址 子组件实现拼接 如：父'/' 子/'dashboard'
        子组件给它拼起来 '/dashboard' -->

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  // created() {
  //   console.log(this.res());
  // },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // 获取全部的路由是数组 例如 [0.{path: '/login', hidden: true, component: ƒ}，{1}，{2}]
      return this.$router.options.routes
    },
    // 获取当前地址 
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  // methods: {
  //   res() {
  //     const r = this.routes
  //     console.log(r);

  //   }
  // }
}
</script>
