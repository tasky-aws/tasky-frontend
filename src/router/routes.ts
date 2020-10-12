import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/Base.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'ecs', component: () => import('pages/Ecs.vue') },
      { path: 'logs/:service/:logGroup', component: () => import('pages/Log.vue') },
      { path: 'logs/:service/:logGroup/:streamPrefix', component: () => import('pages/Log.vue') }
    ]
  },
  // http://localhost:8080/?code=h3swH2BN60jehfqYUO6-&state=uTYXiKirQ36uEbDZSBRbq0skLToHHiusZsNt5nLVCIMUC0qoidHo9StjX1cZOeSZ#/
  // { path: '*', redirect: '/' },
  {
    path: '*',
    redirect: to => ({
      path: '/',
      query: to.query
    })
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
