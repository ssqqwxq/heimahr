<script>
export default {
  name: 'MenuItem',
  functional: true, //函数式组件
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染函数
  render(h, context) {
    const { icon, title } = context.props // 从上下文解构出父组件传递的icon和title
    const vnodes = [] // 存储要渲染的虚拟DOM节点（图标节点+标题节点）
    // 第一步：判断是否有icon，有则创建图标节点并加入vnodes
    if (icon) {
      // 区分：Element UI内置图标（以el-icon开头） 和 自定义SVG图标（其他名称）
      if (icon.includes('el-icon')) {
        // 渲染Element内置图标：创建<i>标签，添加图标类和自定义样式类sub-el-icon
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
        // 等价于h('i', { class: [icon, 'sub-el-icon'] })
      } else {
        // 渲染自定义SVG图标：复用项目中的<svg-icon>组件，传递icon-class属性
        vnodes.push(<svg-icon icon-class={icon} />)
        // 等价于h('svg-icon', { props: { iconClass: icon } })
      }
    }
    // 第二步：判断是否有title，有则创建标题节点并加入vnodes
    if (title) {
      // 渲染菜单标题：创建<span>标签，指定slot="title"，内容为title
      // slot="title"是Element UI el-menu的官方要求：菜单标题必须放在title插槽中，才能正常显示
      vnodes.push(<span slot='title'>{(title)}</span>)
      // 等价于h('span', { slot: 'title' }, title)
    }
    // 第三步：返回所有创建的虚拟DOM节点，Vue会自动渲染到页面
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
