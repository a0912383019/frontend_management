import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

//不用登入即可觀看的頁面
const whiteList = ['/login']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/example',
      name: 'example',
      component: () => import('../views/Example.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home/Home.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  const sessionStorageUserInfo = sessionStorage.user_info
  let isLogin = false
  if (sessionStorageUserInfo !== '') {
    const accessToken = sessionStorage.access_token
    isLogin = accessToken === undefined ? false : true
  }
  if (isLogin || whiteList.includes(to.path)) {
    next()
  } else {
    next({ name: 'Login' })
  }
  // next();
})

export default router
