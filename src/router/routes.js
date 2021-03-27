// @ts-nocheck

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout'),
    children: [
      { path: '/', component: () => import('../pages/Index.vue'),name:'index' },
      { path: '/free', component: () => import('../pages/Index.vue'),name:'free' },
      { path: '/auto', component: () => import('../pages/autoPower.vue') ,name:'auto' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('../pages/Error404.vue')
  }
]

export default routes
