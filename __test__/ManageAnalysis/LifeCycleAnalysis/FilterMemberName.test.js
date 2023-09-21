import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSliders, faCircleInfo, faSearch } from '@fortawesome/free-solid-svg-icons'
import FilterMemberName from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/components/FilterMemberName.vue'

library.add(faSliders, faCircleInfo, faSearch)

describe('開啟 Dialog Member', () => {
  let wrapper = null
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
          FontAwesomeIcon
        }
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('測試 closePopover', () => {
    wrapper.vm.closePopover()
  })

  it('測試 handleCsvSuccess', () => {
    const manageAnalysisStore = useManageAnalysisStore()
    const submitSpy = vi.spyOn(wrapper.vm.ctx, 'handleBeforeSubmit')

    wrapper.vm.handleCsvSuccess()
    expect(manageAnalysisStore.useCustomList).toBe(true)

    expect(submitSpy).toHaveBeenCalled()
  })

  it('測試 handleClick', () => {
    const manageAnalysisStore = useManageAnalysisStore()
    wrapper.vm.searchName = '123'
    wrapper.vm.useCustomList = []
    wrapper.vm.fuzzySearch = false

    wrapper.vm.handleClick()

    expect(manageAnalysisStore.searchName).toBe('123')
    expect(manageAnalysisStore.useCustomList).toStrictEqual([])
    expect(manageAnalysisStore.fuzzySearch).toBe(false)
  })

  it('測試 updateFilterTimestamp', () => {
    const manageAnalysisStore = useManageAnalysisStore()
    let time = new Date().getTime()
    wrapper.vm.updateFilterTimestamp()
    expect(manageAnalysisStore.filterTimestamp).toBe(time)
  })

  it('資料送出前的欄位檢查', () => {
    const manageAnalysisStore = useManageAnalysisStore()

    // if useCustomList 為 true 的狀況
    wrapper.vm.useCustomList = ['123', '456']

    wrapper.vm.handleBeforeSubmit()

    expect(wrapper.vm.searchName).toBe('')
    expect(manageAnalysisStore.searchName).toBe('')

    // if useCustomList 為 false 的狀況
    wrapper.vm.useCustomList = false

    wrapper.vm.handleBeforeSubmit()

    expect(wrapper.vm.filterCustomUserList).toStrictEqual([])
  })

  it('測試頁面切換，是否會執行initSetting', async () => {
    const manageAnalysisStore = useManageAnalysisStore()
    // 設定資料
    wrapper.vm.searchName = '123'
    wrapper.vm.fuzzySearch = true
    manageAnalysisStore.searchName = '123'
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
