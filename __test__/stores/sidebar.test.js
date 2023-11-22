import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSidebarStore } from '@/stores/sidebar.js'
import * as module from '@/utils/commonUtils.js'

describe('useSystemStore', () => {
  let spy

  beforeEach(() => {
    setActivePinia(createPinia())

    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    //模擬呼叫getSessionStorageEntity
    module.getSessionStorageEntity.mockReturnValueOnce({
      menu_config: [
        {
          item_id: 'home',
          item_name: '首頁',
          folder_path: 'common/',
          page_name: 'home',
          nav_icon: 'fas fa-home',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'home',
          svg_icon: 'menuHome',
          sub_menu: []
        },
        {
          item_id: 'bbin_customer_tag_list',
          item_name: '會員標籤查詢',
          folder_path: 'bbin/',
          page_name: 'bbin_customer_tag_list',
          nav_icon: 'fas fa-tags',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'customer-tag-list',
          svg_icon: 'menuTag',
          sub_menu: []
        },
        {
          item_id: 'bbin_manage_analysis',
          item_name: '會員經營分析',
          folder_path: 'bbin/',
          page_name: 'bbin_manage_analysis',
          nav_icon: 'fas fa-people-arrows',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'manage-analysis',
          svg_icon: 'menuManage',
          sub_menu: []
        },
        {
          item_id: 'bbin_registered_no_deposit_analysis',
          item_name: '存款機率預測',
          folder_path: 'bbin/',
          page_name: 'bbin_registered_no_deposit_analysis',
          nav_icon: 'fas fa-donate',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'registered-no-deposit-analysis',
          svg_icon: 'menuDeposit',
          sub_menu: []
        },
        {
          item_id: 'bbin_vip_commercial_analysis',
          item_name: 'VIP營運分析',
          folder_path: 'bbin/',
          page_name: 'bbin_vip_commercial_analysis',
          nav_icon: 'fab fa-vimeo-v',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'vip-commercial-analysis',
          svg_icon: 'menuVIP',
          sub_menu: []
        },
        {
          item_id: 'target_group_analysis_list',
          item_name: '目標族群分析',
          folder_path: 'common/',
          page_name: 'target_group_analysis_list',
          nav_icon: 'fas fa-chart-pie',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'target-group-analysis-list',
          svg_icon: 'menuTarget',
          sub_menu: []
        },
        {
          item_id: 'bbin_game_tag_analysis',
          item_name: '遊戲標籤分析',
          folder_path: 'bbin/',
          page_name: 'bbin_game_tag_analysis',
          nav_icon: 'fas fa-dice',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'game-tag-analysis',
          svg_icon: 'menuGame',
          sub_menu: []
        },
        {
          item_id: 'activity_analysis_list',
          item_name: '活動成效分析',
          folder_path: 'common/',
          page_name: 'activity_analysis_list',
          nav_icon: 'fas fa-chart-line',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'activity-analysis-list',
          svg_icon: 'menuActivity',
          sub_menu: []
        },
        {
          item_id: 'bbin_offer_analysis_list',
          item_name: '優惠成效分析',
          folder_path: 'bbin/',
          page_name: 'bbin_offer_analysis_list',
          nav_icon: 'fas fa-gift',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'offer-analysis-list',
          svg_icon: 'menuDiscount',
          sub_menu: []
        },
        {
          item_id: 'bbin_rank_analysis',
          item_name: '數據排名分析',
          folder_path: 'bbin/',
          page_name: 'bbin_rank_analysis',
          nav_icon: 'fas fa-sort-amount-down',
          is_loading_auto_hide: true,
          status: 1,
          status_description: '',
          url_path: 'rank-analysis',
          svg_icon: 'menuData',
          sub_menu: []
        },
        {
          item_id: 'risk_controll_analysis',
          item_name: '風險控管分析',
          folder_path: 'common/',
          page_name: 'risk_controll_analysis',
          nav_icon: 'fas fa-shield-alt',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'risk-controll-analysis',
          svg_icon: 'menuRisk',
          sub_menu: []
        },
        {
          item_id: 'custom_tags_setting',
          item_name: '自訂標籤設置',
          folder_path: 'common/',
          page_name: 'custom_tags_setting',
          nav_icon: 'fas fa-cog',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'custom-tags-setting',
          svg_icon: 'menuLabel',
          sub_menu: []
        },
        {
          item_id: 'tag_synchronization',
          item_name: '標籤同步管理',
          folder_path: 'common/',
          page_name: 'tag_synchronization',
          nav_icon: 'fas fa-sync-alt',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'tag-synchronization',
          svg_icon: 'menuSynchronize',
          sub_menu: []
        },
        {
          item_id: 'user_export_report',
          item_name: '匯出報表清單',
          folder_path: 'common/',
          page_name: 'user_export_report',
          nav_icon: 'fas fa-list',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'user-export-report',
          svg_icon: 'menuExport',
          sub_menu: []
        },
        {
          item_id: 'user_detail_info',
          item_name: '帳戶資訊',
          folder_path: 'user/',
          page_name: 'user_detail_info',
          nav_icon: 'fas fa-user-cog',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'user-detail-info',
          svg_icon: 'menuAccount',
          sub_menu: []
        },
        {
          item_id: 'admin_user_list',
          item_name: '使用者帳戶管理',
          folder_path: 'user/',
          page_name: 'admin_user_list',
          nav_icon: 'fas fa-users-cog',
          is_loading_auto_hide: false,
          status: 1,
          status_description: '',
          url_path: 'admin-user-list',
          svg_icon: 'menuUser',
          sub_menu: []
        }
      ]
    })
  })

  it('calls apiLogout and clears storage on storeLogout', async () => {
    // 取得 store 實例
    const sidebarStore = useSidebarStore()

    expect(sidebarStore.menuLists).toStrictEqual([])
    // 調用 generateSidebarMenu 方法
    await sidebarStore.generateSidebarMenu()
    const menuList = [
      {
        item_id: 'home',
        item_name: '首頁',
        folder_path: 'common/',
        page_name: 'home',
        nav_icon: 'fas fa-home',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'home',
        svg_icon: 'menuHome',
        sub_menu: []
      },
      {
        item_id: 'bbin_customer_tag_list',
        item_name: '會員標籤查詢',
        folder_path: 'bbin/',
        page_name: 'bbin_customer_tag_list',
        nav_icon: 'fas fa-tags',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'customer-tag-list',
        svg_icon: 'menuTag',
        sub_menu: []
      },
      {
        item_id: 'bbin_manage_analysis',
        item_name: '會員經營分析',
        folder_path: 'bbin/',
        page_name: 'bbin_manage_analysis',
        nav_icon: 'fas fa-people-arrows',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'manage-analysis',
        svg_icon: 'menuManage',
        sub_menu: []
      },
      {
        item_id: 'bbin_registered_no_deposit_analysis',
        item_name: '存款機率預測',
        folder_path: 'bbin/',
        page_name: 'bbin_registered_no_deposit_analysis',
        nav_icon: 'fas fa-donate',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'registered-no-deposit-analysis',
        svg_icon: 'menuDeposit',
        sub_menu: []
      },
      {
        item_id: 'bbin_vip_commercial_analysis',
        item_name: 'VIP營運分析',
        folder_path: 'bbin/',
        page_name: 'bbin_vip_commercial_analysis',
        nav_icon: 'fab fa-vimeo-v',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'vip-commercial-analysis',
        svg_icon: 'menuVIP',
        sub_menu: []
      },
      {
        item_id: 'target_group_analysis_list',
        item_name: '目標族群分析',
        folder_path: 'common/',
        page_name: 'target_group_analysis_list',
        nav_icon: 'fas fa-chart-pie',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'target-group-analysis-list',
        svg_icon: 'menuTarget',
        sub_menu: []
      },
      {
        item_id: 'bbin_game_tag_analysis',
        item_name: '遊戲標籤分析',
        folder_path: 'bbin/',
        page_name: 'bbin_game_tag_analysis',
        nav_icon: 'fas fa-dice',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'game-tag-analysis',
        svg_icon: 'menuGame',
        sub_menu: []
      },
      {
        item_id: 'activity_analysis_list',
        item_name: '活動成效分析',
        folder_path: 'common/',
        page_name: 'activity_analysis_list',
        nav_icon: 'fas fa-chart-line',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'activity-analysis-list',
        svg_icon: 'menuActivity',
        sub_menu: []
      },
      {
        item_id: 'bbin_offer_analysis_list',
        item_name: '優惠成效分析',
        folder_path: 'bbin/',
        page_name: 'bbin_offer_analysis_list',
        nav_icon: 'fas fa-gift',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'offer-analysis-list',
        svg_icon: 'menuDiscount',
        sub_menu: []
      },
      {
        item_id: 'bbin_rank_analysis',
        item_name: '數據排名分析',
        folder_path: 'bbin/',
        page_name: 'bbin_rank_analysis',
        nav_icon: 'fas fa-sort-amount-down',
        is_loading_auto_hide: true,
        status: 1,
        status_description: '',
        url_path: 'rank-analysis',
        svg_icon: 'menuData',
        sub_menu: []
      },
      {
        item_id: 'risk_controll_analysis',
        item_name: '風險控管分析',
        folder_path: 'common/',
        page_name: 'risk_controll_analysis',
        nav_icon: 'fas fa-shield-alt',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'risk-controll-analysis',
        svg_icon: 'menuRisk',
        sub_menu: []
      },
      {
        item_id: 'custom_tags_setting',
        item_name: '自訂標籤設置',
        folder_path: 'common/',
        page_name: 'custom_tags_setting',
        nav_icon: 'fas fa-cog',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'custom-tags-setting',
        svg_icon: 'menuLabel',
        sub_menu: []
      },
      {
        item_id: 'tag_synchronization',
        item_name: '標籤同步管理',
        folder_path: 'common/',
        page_name: 'tag_synchronization',
        nav_icon: 'fas fa-sync-alt',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'tag-synchronization',
        svg_icon: 'menuSynchronize',
        sub_menu: []
      },
      {
        item_id: 'user_export_report',
        item_name: '匯出報表清單',
        folder_path: 'common/',
        page_name: 'user_export_report',
        nav_icon: 'fas fa-list',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'user-export-report',
        svg_icon: 'menuExport',
        sub_menu: []
      },
      {
        item_id: 'user_detail_info',
        item_name: '帳戶資訊',
        folder_path: 'user/',
        page_name: 'user_detail_info',
        nav_icon: 'fas fa-user-cog',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'user-detail-info',
        svg_icon: 'menuAccount',
        sub_menu: []
      },
      {
        item_id: 'admin_user_list',
        item_name: '使用者帳戶管理',
        folder_path: 'user/',
        page_name: 'admin_user_list',
        nav_icon: 'fas fa-users-cog',
        is_loading_auto_hide: false,
        status: 1,
        status_description: '',
        url_path: 'admin-user-list',
        svg_icon: 'menuUser',
        sub_menu: []
      }
    ]
    expect(sidebarStore.menuLists).toStrictEqual(menuList)

    expect(sidebarStore.isSidebarClose).toBe(false)
    // 調用 toggleSidebarOpen 方法
    await sidebarStore.toggleSidebarOpen()
    expect(sidebarStore.isSidebarClose).toBe(true)
  })
})
