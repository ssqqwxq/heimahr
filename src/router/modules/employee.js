import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: '/employee/detail/:id?', // 可以动态传参  ？表示非强制
    component: () => import('@/views/employee/detail.vue'),
    meta: {
      title: '员工详情'  // 表示隐藏在左侧菜单
    },
    hidden: true  // 表示隐藏在左侧菜单
  }
  ]
}
