import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import SideBar from '@/components/SideBar.vue'
import { library } from '@/utils/fontawsome.js'

describe('SideBar', () => {
  let wrapper = null
  beforeEach(() => {
    const user_info = {
      user_name: 'test'
    }
    sessionStorage.setItem('user_info', JSON.stringify(user_info))
    sessionStorage.setItem('access_token', JSON.stringify('awdedwaefjihiu'))
    wrapper = mount(SideBar, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
    wrapper.vm.menuLists = [
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
        sub_menu: [],
        svg_icon: 'menuHome'
      }
    ]
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 驗證SideBar是否關閉
  it('Verify that SideBar is closed', async () => {
    // 設定關閉，sidebar class是否正確
    wrapper.vm.isSidebarClose = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.sidebar').classes()).toContain('isClose')
  })

  // 驗證選單
  it('Verification menu', async () => {
    await wrapper.vm.$nextTick()
    // 預期選單第一筆的標題為 首頁
    expect(wrapper.find('.el-menu-item:nth-child(1) .cdp-menu__title').text()).toBe('首頁')

    //切換路由，驗證第一筆選單是否active
    router.push('/home')

    // 等待路由準備
    await router.isReady()

    expect(wrapper.find('.el-menu-item:nth-child(1)').classes()).toContain('is-active')
  })
})
