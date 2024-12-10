import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import ActivityDetail from '@/views/ActivityAnalysisList/components/activityDetail/ActivityDetail.vue'
import Tab from '@/components/Tab.vue'
import ActivityData from '@/views/ActivityAnalysisList/components/activityDetail/activityData/ActivityData.vue'
import Filter from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/Filter.vue'
import ChildAnalysis from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/ChildAnalysis.vue'

describe('ActivityDetail', () => {
  let wrapper = null
  let activityStore
  const findSelectedOption = vi.fn()
  const initChildData = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)
    activityStore.findSelectedOption = findSelectedOption
    activityStore.initChildData = initChildData
    activityStore.childListData = []

    wrapper = shallowMount(ActivityDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          },
          KeepAlive: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        modelValue: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(Tab).exists()).toBeTruthy()
    expect(wrapper.findComponent(Filter).exists()).toBeFalsy()
    expect(wrapper.findComponent(ActivityData).exists()).toBeTruthy()
    expect(wrapper.findComponent(ChildAnalysis).exists()).toBeFalsy()

    wrapper.vm.currentTabs = 'ChildAnalysis'
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(Filter).exists()).toBeTruthy()
    expect(wrapper.findComponent(ActivityData).exists()).toBeFalsy()
    expect(wrapper.findComponent(ChildAnalysis).exists()).toBeTruthy()
  })

  it('variables', () => {
    const tabData = [
      {
        label: '活動資料',
        name: 'ActivityData'
      },
      {
        label: '子活動分析',
        name: 'ChildAnalysis'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
    expect(wrapper.vm.currentTabs).toStrictEqual('ActivityData')
    const componentMap = {
      ActivityData,
      ChildAnalysis
    }
    expect(wrapper.vm.componentMap).toStrictEqual(componentMap)
    expect(wrapper.vm.currentTabComponent).toStrictEqual(ActivityData)

    wrapper.vm.currentTabs = 'ChildAnalysis'
    expect(wrapper.vm.currentTabs).toStrictEqual('ChildAnalysis')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(ChildAnalysis)
  })

  it('disabledTab & watch & generateChildListOptions & handleDialogClosed', async () => {
    wrapper.vm.currentTabs = 'ChildAnalysis'
    expect(wrapper.vm.currentTabs).toStrictEqual('ChildAnalysis')
    expect(wrapper.vm.disabledTab).toStrictEqual([1])
    expect(findSelectedOption).toBeCalledTimes(0)

    // 觸發 watch
    activityStore.childListData = [
      {
        id: 53,
        name: '1',
        filter_start_date: '2024-01-01',
        filter_end_date: '2024-11-01',
        promotion_id: 0,
        original_id: 8907,
        offer_id: 22,
        operator_id: 307,
        created_time: '2024-12-05T22:16:13-04:00',
        promotion_name: 'CSMLUKE2-自動優惠 新會員推薦_自動優惠_新會員推薦_2023-11-02',
        promotion_start_date: '2023-11-02',
        promotion_end_date: '2023-11-04'
      },
      {
        id: 54,
        name: '二',
        filter_start_date: '2024-01-01',
        filter_end_date: '2024-11-01',
        promotion_id: 0,
        original_id: 6611,
        offer_id: 43,
        operator_id: 307,
        created_time: '2024-12-05T22:16:13-04:00',
        promotion_name: 'E26电子玛莉 百万彩池赠豪礼_抽紅包優惠_營運紅包_2024-11-27',
        promotion_start_date: '2024-11-27',
        promotion_end_date: '2024-11-30'
      },
      {
        id: 55,
        name: '3333',
        filter_start_date: '2024-01-01',
        filter_end_date: '2024-11-01',
        promotion_id: 0,
        original_id: 11747,
        offer_id: 24,
        operator_id: 307,
        created_time: '2024-12-05T22:16:13-04:00',
        promotion_name: 'sinyi 禮金大灑幣_自動優惠_禮金送_2024-09-25',
        promotion_start_date: '2024-09-25',
        promotion_end_date: '2024-09-26'
      }
    ]
    await wrapper.vm.$nextTick()
    const optionChildList = [
      {
        label: '1',
        value: 53
      },
      {
        label: '二',
        value: 54
      },
      {
        label: '3333',
        value: 55
      }
    ]
    expect(activityStore.optionChildList).toStrictEqual(optionChildList)
    expect(activityStore.currentChildAnalysis.id).toStrictEqual(53)
    expect(wrapper.vm.disabledTab).toStrictEqual([])
    expect(findSelectedOption).toBeCalledTimes(1)

    expect(initChildData).toBeCalledTimes(0)
    wrapper.vm.handleDialogClosed()
    expect(wrapper.vm.disabledTab).toStrictEqual([1])
    expect(wrapper.vm.currentTabs).toStrictEqual('ActivityData')
    expect(initChildData).toBeCalledTimes(1)
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })
})
