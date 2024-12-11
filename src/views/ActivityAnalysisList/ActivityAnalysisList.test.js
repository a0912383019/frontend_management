import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import ActivityAnalysisList from '@/views/ActivityAnalysisList/ActivityAnalysisList.vue'
import ChartFilter from '@/views/ActivityAnalysisList/components/ChartFilter.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Overview from '@/views/ActivityAnalysisList/components/Overview.vue'
import GrowthRate from '@/views/ActivityAnalysisList/components/GrowthRate.vue'
import GrowthGap from '@/views/ActivityAnalysisList/components/GrowthGap.vue'
import TotalSum from '@/views/ActivityAnalysisList/components/TotalSum.vue'
import AddButton from '@/components/Button/AddButton.vue'
import AddDialog from '@/views/ActivityAnalysisList/AddActivity.vue'
import Filter from '@/views/ActivityAnalysisList/Filter.vue'

describe('ActivityAnalysisList', () => {
  let wrapper = null
  let activityStore
  const date = new Date(2000, 1, 1, 13)
  const resetState = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)
    activityStore.resetState = resetState

    vi.useFakeTimers()
    vi.setSystemTime(date)

    wrapper = shallowMount(ActivityAnalysisList, {
      global: {
        plugins: [i18n, ElementPlus],
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
    vi.clearAllMocks()
    vi.useRealTimers()
    expect(resetState).toBeCalledTimes(0)
    wrapper.unmount()
    expect(resetState).toBeCalledTimes(1)
  })

  it('components', async () => {
    expect(wrapper.findComponent(ChartFilter).exists()).toBe(true)
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(AddButton).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(AddDialog).exists()).toBe(true)
    expect(wrapper.findComponent(Overview).exists()).toBe(true)
    expect(wrapper.findComponent(GrowthRate).exists()).toBe(false)
    expect(wrapper.findComponent(GrowthGap).exists()).toBe(false)
    expect(wrapper.findComponent(TotalSum).exists()).toBe(false)

    // 切換 tab
    wrapper.vm.currentTabs = 'GrowthRate'
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(Overview).exists()).toBe(false)
    expect(wrapper.findComponent(GrowthRate).exists()).toBe(true)
    expect(wrapper.findComponent(GrowthGap).exists()).toBe(false)
    expect(wrapper.findComponent(TotalSum).exists()).toBe(false)
    expect(wrapper.findComponent(AddButton).exists()).toBe(false)
    expect(wrapper.findComponent(Filter).exists()).toBe(false)
  })

  it('tabData', () => {
    const tabData = [
      {
        label: '總覽',
        name: 'Overview'
      },
      {
        label: '成長率',
        name: 'GrowthRate'
      },
      {
        label: '成長差額',
        name: 'GrowthGap'
      },
      {
        label: '總和',
        name: 'TotalSum'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
  })

  it('componentMap', () => {
    const componentMap = {
      Overview,
      GrowthRate,
      GrowthGap,
      TotalSum
    }
    expect(wrapper.vm.componentMap).toStrictEqual(componentMap)
  })

  it('currentTabComponent', () => {
    expect(wrapper.vm.currentTabs).toStrictEqual('Overview')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(Overview)
    wrapper.vm.currentTabs = 'GrowthRate'
    expect(wrapper.vm.currentTabs).toStrictEqual('GrowthRate')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(GrowthRate)
  })

  it('openAddDialog & openAddDialog', () => {
    expect(wrapper.vm.dialogVisible).toBeFalsy()
    wrapper.vm.openAddDialog()
    expect(wrapper.vm.dialogVisible).toBeTruthy()
    wrapper.vm.closeDialog()
    expect(wrapper.vm.dialogVisible).toBeFalsy()
  })

  it('addSuccess', () => {
    expect(activityStore.activityAddChange).toBe(0)
    wrapper.vm.addSuccess()
    expect(activityStore.activityAddChange).toBe(date.getTime())
  })
})
