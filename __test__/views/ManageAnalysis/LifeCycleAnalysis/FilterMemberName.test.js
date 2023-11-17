import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import { library } from '@/utils/fontawsome.js'
import FilterMemberName from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/components/FilterMemberName.vue'

describe('FilterMemberName', () => {
  let wrapper = null
  let manageAnalysisStore = null
  beforeEach(() => {
    wrapper = mount(FilterMemberName, {
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
    manageAnalysisStore = useManageAnalysisStore()
  })
  afterEach(() => {
    wrapper.unmount()
    manageAnalysisStore = null
  })

  // 測試 closePopover
  it('test closePopover', () => {
    wrapper.vm.closePopover()

    const el = wrapper.find('.unit-test-people-changes')
    const attr = el.attributes()['aria-hidden']

    // 預期執行關閉後，aria-hidden要為true
    expect(attr).toBe('true')
  })

  // 測試 handleCsvSuccess
  it('test handleCsvSuccess', () => {
    wrapper.vm.handleCsvSuccess()
    expect(manageAnalysisStore.useCustomList).toBe(true)

    const el = wrapper.find('.unit-test-people-changes')
    const attr = el.attributes()['aria-hidden']

    // 預期執行關閉後，aria-hidden要為true
    expect(attr).toBe('true')
  })

  // 測試 handleClick
  it('test handleClick', () => {
    wrapper.vm.searchName = 'a123'
    wrapper.vm.useCustomList = false
    wrapper.vm.fuzzySearch = false

    wrapper.vm.handleClick()

    expect(manageAnalysisStore.searchName).toBe('a123')
    expect(manageAnalysisStore.useCustomList).toBe(false)
    expect(manageAnalysisStore.fuzzySearch).toBe(false)
  })

  // 測試 updateFilterTimestamp
  it('test updateFilterTimestamp', () => {
    let time = new Date().getTime()
    wrapper.vm.updateFilterTimestamp()
    expect(manageAnalysisStore.filterTimestamp).toBe(time)
  })

  // 資料送出前的欄位檢查
  it('Field checking before data is sent', () => {
    // if useCustomList 為 true 的狀況
    wrapper.vm.useCustomList = ['a123', 'b456']

    wrapper.vm.handleBeforeSubmit()

    expect(wrapper.vm.searchName).toBe('')
    expect(manageAnalysisStore.searchName).toBe('')

    // if useCustomList 為 false 的狀況
    wrapper.vm.useCustomList = false

    wrapper.vm.handleBeforeSubmit()

    expect(wrapper.vm.filterCustomUserList).toStrictEqual([])
  })

  // 測試頁面切換，是否會執行initSetting
  it('Test page switching, whether initSetting will be executed', async () => {
    // 設定資料
    wrapper.vm.searchName = 'a123'
    wrapper.vm.fuzzySearch = true
    manageAnalysisStore.searchName = 'a123'
    manageAnalysisStore.fuzzySearch = true

    //切換路由，觸發watch
    router.push('/home')

    // 等待路由準備
    await router.isReady()

    // 驗證 initSetting 執行過後，資料是否正確
    expect(wrapper.vm.searchName).toBe('')
    expect(manageAnalysisStore.searchName).toBe('')
    expect(wrapper.vm.fuzzySearch).toBe(false)
    expect(manageAnalysisStore.fuzzySearch).toBe(false)
  })
})
