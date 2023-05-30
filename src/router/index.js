import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/Main.vue'

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
      component: MainLayout,
      meta: {
        pageName: '首頁'
      },
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/customer-tag-list',
      name: 'customer-tag-list',
      component: MainLayout,
      meta: {
        pageName: '會員標籤查詢'
      },
      children: [
        {
          path: '/customer-tag-list',
          name: 'customer-tag-list'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/manage-analysis',
      name: 'manage-analysis',
      component: MainLayout,
      meta: {
        pageName: '會員經營分析'
      },
      children: [
        {
          path: '/manage-analysis',
          name: 'manage-analysis',
          component: () => import('../views/ManageAnalysis/ManageAnalysis.vue')
        }
      ]
    },
    {
      path: '/registered-no-deposit-analysis',
      name: 'registered-no-deposit-analysis',
      component: MainLayout,
      meta: {
        pageName: '存款機率預測'
      },
      children: [
        {
          path: '/registered-no-deposit-analysis',
          name: 'registered-no-deposit-analysis'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/vip-commercial-analysis',
      name: 'vip-commercial-analysis',
      component: MainLayout,
      meta: {
        pageName: 'VIP營運分析'
      },
      children: [
        {
          path: '/vip-commercial-analysis',
          name: 'vip-commercial-analysis'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/target-group-analysis-list',
      name: 'target-group-analysis-list',
      component: MainLayout,
      meta: {
        pageName: '目標族群分析'
      },
      children: [
        {
          path: '/target-group-analysis-list',
          name: 'target-group-analysis-list'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/game-tag-analysis',
      name: 'game-tag-analysis',
      component: MainLayout,
      meta: {
        pageName: '遊戲標籤分析'
      },
      children: [
        {
          path: '/game-tag-analysis',
          name: 'game-tag-analysis'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/activity-analysis-list',
      name: 'activity-analysis-list',
      component: MainLayout,
      meta: {
        pageName: '活動成效分析'
      },
      children: [
        {
          path: '/activity-analysis-list',
          name: 'activity-analysis-list'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/offer-analysis-list',
      name: 'offer-analysis-list',
      component: MainLayout,
      meta: {
        pageName: '優惠成效分析'
      },
      children: [
        {
          path: '/offer-analysis-list',
          name: 'offer-analysis-list'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/rank-analysis',
      name: 'rank-analysis',
      component: MainLayout,
      meta: {
        pageName: '數據排名分析'
      },
      children: [
        {
          path: '/rank-analysis',
          name: 'rank-analysis'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/custom-tags-setting',
      name: 'custom-tags-setting',
      component: MainLayout,
      meta: {
        pageName: '自訂標籤設置'
      },
      children: [
        {
          path: '/custom-tags-setting',
          name: 'custom-tags-setting'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/tag-synchronization',
      name: 'tag-synchronization',
      component: MainLayout,
      meta: {
        pageName: '標籤同步管理'
      },
      children: [
        {
          path: '/tag-synchronization',
          name: 'tag-synchronization'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/user-export-report',
      name: 'user-export-report',
      component: MainLayout,
      meta: {
        pageName: '匯出報表清單'
      },
      children: [
        {
          path: '/user-export-report',
          name: 'user-export-report'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/user-detail-info',
      name: 'user-detail-info',
      component: MainLayout,
      meta: {
        pageName: '帳戶資訊'
      },
      children: [
        {
          path: '/user-detail-info',
          name: 'user-detail-info'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
    },
    {
      path: '/admin-user-list',
      name: 'admin-user-list',
      component: MainLayout,
      meta: {
        pageName: '使用者帳戶管理'
      },
      children: [
        {
          path: '/admin-user-list',
          name: 'admin-user-list'
          // component: () => import('../views/Home/Home.vue')
        }
      ]
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
