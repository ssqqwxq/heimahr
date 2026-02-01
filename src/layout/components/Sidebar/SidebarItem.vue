<template>
  <!-- 路由配置的信息{path: '/login', hidden: true, component: ƒ}
  如果这个页面时 false 就不显示  登录页 和 404页面的路由配置信息的 hidden: true 所以他俩不再侧边栏显示 -->
  <div v-if="!item.hidden">
    <template
              v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)"
                      :class="{ 'submenu-title-noDropdown': !isNest }">

          <!--(item.meta && item.meta.icon) 先确认爹路由（item）有meta这个属性，再去取meta里的icon；如果爹路由没有meta，直接不往后取，避免程序报错崩掉 -->
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else
                ref="subMenu"
                :index="resolvePath(item.path)"
                popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta"
              :icon="item.meta && item.meta.icon"
              :title="item.meta.title" />
      </template>
      <sidebar-item v-for="child in item.children"
                    :key="child.path"
                    :is-nest="true"
                    :item="child"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    // 接收父组件的地址
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },

    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      //判断 isExternal 是不是外部网站的链接
      if (isExternal(this.basePath)) {
        return this.basePath  // this.basePath：子组件从父组件那接收来的基础路径
      }
      // path.resolve(爹的地址, 自己的短地址) 拼接
      return path.resolve(this.basePath, routePath) //  将一级路由的地址'/' 和二级路由的地址'dashboard' 拼成正确地址
    }
  }
}
</script>
