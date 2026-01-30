<!-- // 首页 -->
<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 使用svg图标组件
    设置icon-class属性来切换图标 -->
    <svg-icon icon-class="eye"></svg-icon>
    <svg-icon icon-class="wechat"></svg-icon>
  </div>
</template>

<script>
import { Icon } from 'element-ui';
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.$store.dispatch('user/getUserInfo')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
