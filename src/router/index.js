import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/Main.vue'
import { useSystemStore, useGlobalStore, useDateStore } from '@/stores'

//不用登入即可觀看的頁面
const whiteList = ['/login']

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
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
        pageName: '首頁',
        fromPage: 'home'
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
        pageName: '會員標籤查詢',
        fromPage: 'bbin_customer_tag_list'
      },
      children: [
        {
          path: '/customer-tag-list',
          name: 'customer-tag-list',
          component: () => import('../views/CustomerTagList/CustomerTagList.vue')
        }
      ]
    },
    {
      path: '/manage-analysis',
      name: 'manage-analysis',
      component: MainLayout,
      meta: {
        pageName: '會員經營分析',
        fromPage: 'bbin_manage_analysis'
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
      path: '/vip-commercial-analysis',
      name: 'vip-commercial-analysis',
      component: MainLayout,
      meta: {
        pageName: 'VIP營運分析',
        fromPage: 'bbin_vip_commercial_analysis'
      },
      children: [
        {
          path: '/vip-commercial-analysis',
          name: 'vip-commercial-analysis',
          component: () => import('../views/VipCommercialAnalysis/VipCommercialAnalysis.vue')
        }
      ]
    },
    {
      path: '/activity-analysis-list',
      name: 'activity-analysis-list',
      component: MainLayout,
      meta: {
        pageName: '活動成效分析',
        fromPage: 'activity_analysis_list'
      },
      children: [
        {
          path: '/activity-analysis-list',
          name: 'activity-analysis-list',
          component: () => import('../views/ActivityAnalysisList/ActivityAnalysisList.vue')
        }
      ]
    },
    {
      path: '/custom-tags-setting',
      name: 'custom-tags-setting',
      component: MainLayout,
      meta: {
        pageName: '自訂標籤設置',
        fromPage: 'custom_tags_setting'
      },
      children: [
        {
          path: '/custom-tags-setting',
          name: 'custom-tags-setting',
          component: () => import('../views/CustomTagsSetting/CustomTagsSetting.vue')
        }
      ]
    },
    {
      path: '/user-export-report',
      name: 'user-export-report',
      component: MainLayout,
      meta: {
        pageName: '匯出報表清單',
        fromPage: 'user_export_report'
      },
      children: [
        {
          path: '/user-export-report',
          name: 'user-export-report',
          component: () => import('../views/ExportReportList/ExportReportList.vue')
        }
      ]
    },
    {
      path: '/admin-user-list',
      name: 'admin-user-list',
      component: MainLayout,
      meta: {
        pageName: '使用者帳戶管理',
        fromPage: 'admin_user_list'
      },
      children: [
        {
          path: '/admin-user-list',
          name: 'admin-user-list',
          component: () => import('../views/AdminUserList/AdminUserList.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const globalStore = useGlobalStore()
  globalStore.isLoading = true

  // 判斷使用者是否登入
  let isLogin = false
  if (!sessionStorage.access_token_go || !sessionStorage.user_info) {
    isLogin = false
  } else {
    isLogin = true
  }

  if (isLogin || whiteList.includes(to.path)) {
    const systemStore = useSystemStore()

    if (to.name === 'Home' && to.query && to.query.simulate) {
      // 如果路由是 Home 且 query 中有 simulate
      await systemStore.makeSystemConfig(0, true)
    } else if (to.name !== 'Login') {
      // 如果不是 Login 頁面，檢查是否有 hallChage query
      if (to.query && to.query.hallChage) {
        next()
        return
      }
      // 若無 hallChage query，則執行 makeSystemConfig
      await systemStore.makeSystemConfig(0)
    }

    next()
  } else {
    next({ name: 'Login' })
  }

  if (to.name !== 'Login' && sessionStorage.getItem('system_config') !== null) {
    const dateStore = useDateStore()
    dateStore.updateDate()
  }
})

router.afterEach((to, from) => {
  const globalStore = useGlobalStore()
  globalStore.isLoading = false
})

export default router
