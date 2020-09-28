import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'


Vue.use(VueRouter)



const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/Login" },
    { path: '/Login', component: Login },
    {
      path: '/Home', component: Home, redirect: '/Welcome', children: [
        { path: '/Welcome', component: Welcome },
        { path: '/Users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
      ]
    },

  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to  将要访问的路径
  // from 从哪个路径跳转而来
  // next 是一个函数表示放行
  //    next（） 放行  next（'/login'）强制跳转

  // 判断是不是登录页
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()

})

export default router
