import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/Main.vue'
import { useDateStore } from '@/stores/dateConfig.js'
import { useSystemStore } from '@/stores/system.js'

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
      path: '/member-details-popup',
      name: 'member-details-popup',
      component: () => import('../views/MemberDetailsPopup/MemberDetailsPopup.vue')
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
      path: '/registered-no-deposit-analysis',
      name: 'registered-no-deposit-analysis',
      component: MainLayout,
      meta: {
        pageName: '存款機率預測',
        fromPage: 'bbin_registered_no_deposit_analysis'
      },
      children: [
        {
          path: '/registered-no-deposit-analysis',
          name: 'registered-no-deposit-analysis',
          component: () =>
            import('../views/RegisteredNoDepositAnalysis/RegisteredNoDepositAnalysis.vue')
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
        pageName: '目標族群分析',
        fromPage: 'target_group_analysis_list'
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
        pageName: '遊戲標籤分析',
        fromPage: 'bbin_game_tag_analysis'
      },
      children: [
        {
          path: '/game-tag-analysis',
          name: 'game-tag-analysis',
          component: () => import('../views/GameTagAnalysis/GameTagAnalysis.vue')
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
        pageName: '優惠成效分析',
        fromPage: 'bbin_offer_analysis_list'
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
        pageName: '數據排名分析',
        fromPage: 'bbin_rank_analysis'
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
      path: '/risk-controll-analysis',
      name: 'risk_controll_analysis',
      component: MainLayout,
      meta: {
        pageName: '風險控管分析',
        fromPage: 'risk_controll_analysis'
      },
      children: [
        {
          path: '/risk_controll_analysis',
          name: 'risk_controll_analysis'
          // component: () => import('../views/Home/Home.vue')
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
        pageName: '標籤同步管理',
        fromPage: 'tag_synchronization'
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
        pageName: '匯出報表清單',
        fromPage: 'user_export_report'
      },
      children: [
        {
          path: '/user-export-report',
          name: 'user-export-report',
          component: () => import('../views/UserExportReport/UserExportReport.vue')
        }
      ]
    },
    {
      path: '/user-detail-info',
      name: 'user-detail-info',
      component: MainLayout,
      meta: {
        pageName: '帳戶資訊',
        fromPage: 'user_detail_info'
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
        pageName: '使用者帳戶管理',
        fromPage: 'admin_user_list'
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

const beforeRouteEnterHandler = async () => {
  const systemStore = useSystemStore()
  await systemStore.storeGetSystemConfig()
}

router.beforeEach((to, from, next) => {
  const sessionStorageUserInfo = sessionStorage.user_info
  //將from page寫入window內
  sessionStorage.from_page = `?fromPage=${to.meta.fromPage}`
  let isLogin = false
  if (sessionStorageUserInfo !== '') {
    const accessToken = sessionStorage.access_token
    if (accessToken === undefined) {
      isLogin = false
    } else {
      isLogin = true
    }
  }
  if (isLogin || whiteList.includes(to.path)) {
    if (to.name !== 'Login') {
      beforeRouteEnterHandler().then(() => {
        next()
      })
    } else {
      next()
    }
  } else {
    next({ name: 'Login' })
  }

  if (to.name !== 'Login' && sessionStorage.getItem('system_config') !== null) {
    const dateStore = useDateStore()
    dateStore.updateDate()
  }
})

export default router
