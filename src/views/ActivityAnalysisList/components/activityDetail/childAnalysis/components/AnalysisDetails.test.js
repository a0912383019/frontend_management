import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import AnalysisDetails from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisDetails.vue'
import ExportCSV from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/ExportCSV.vue'
import Filter from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/Filter.vue'
import Tab from '@/components/Tab.vue'
import History from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/history/History.vue'
import TagStatistics from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/tagStatistics/TagStatistics.vue'
import Commissionable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/commissionable/Commissionable.vue'
import DetailList from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/DetailList.vue'
import { useActivityAnalysisStore } from '@/stores'

describe('AnalysisDetails', () => {
  let wrapper = null
  let activityStore

  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore()

    wrapper = shallowMount(AnalysisDetails, {
      global: {
        plugins: [i18n],
        stubs: {
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
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components & currentTabComponent', async () => {
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(activityStore.currentDetailTab).toBe('Commissionable')
    expect(wrapper.vm.currentTabComponent).toBe(Commissionable)
    expect(wrapper.findComponent(Commissionable).exists()).toBe(true)

    // 模擬更改 tab
    activityStore.currentDetailTab = 'TagStatistics'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabComponent).toBe(TagStatistics)
    expect(wrapper.findComponent(TagStatistics).exists()).toBe(true)

    // 模擬更改 tab
    activityStore.currentDetailTab = 'DetailList'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabComponent).toBe(DetailList)
    expect(wrapper.findComponent(DetailList).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(ExportCSV).exists()).toBe(true)

    // 模擬更改 tab
    activityStore.currentDetailTab = 'History'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabComponent).toBe(History)
    expect(wrapper.findComponent(History).exists()).toBe(true)
  })

  it('Expected tabData is correctly', () => {
    const tabData = [
      {
        label: '有效投注統計',
        name: 'Commissionable'
      },
      {
        label: '標籤統計',
        name: 'TagStatistics'
      },
      {
        label: '詳細名單',
        name: 'DetailList'
      },
      {
        label: '歷程統計',
        name: 'History'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
  })

  it('componentMap', () => {
    const componentMap = {
      Commissionable,
      TagStatistics,
      DetailList,
      History
    }
    expect(wrapper.vm.componentMap).toStrictEqual(componentMap)
  })
})
