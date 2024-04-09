import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import Filter from '@/views/DataRankAnalysis/BetAmount/components/Filter.vue'
import { useDataRankAnalysisStore } from '@/stores'

describe('Filter', () => {
  let wrapper = null
  let rankStore
  const hide = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    rankStore = useDataRankAnalysisStore(pinia)
    rankStore.betAmountFilter = {
      searchDate: '2024-03-12 ~ 2024-03-22',
      rank: 10
    }

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })

    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試 closePopover
  it('closePopover', () => {
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalled()
  })

  it('selectRankLists data', () => {
    const selectRankLists = [
      {
        value: 10,
        label: '前10名'
      },
      {
        value: 20,
        label: '前20名'
      },
      {
        value: 50,
        label: '前50名'
      }
    ]
    expect(wrapper.vm.selectRankLists).toStrictEqual(selectRankLists)
    expect(wrapper.vm.filterData.searchDate).toBe('2024-03-12 ~ 2024-03-22')
    expect(wrapper.vm.filterData.rank).toBe(10)
  })

  it('handleClick', async () => {
    wrapper.vm.filterData.searchDate = '2024-02-20 ~ 2024-02-28'
    wrapper.vm.filterData.rank = 20
    await wrapper.vm.handleClick()

    expect(rankStore.betAmountFilter.searchDate).toBe('2024-02-20 ~ 2024-02-28')
    expect(rankStore.betAmountFilter.rank).toBe(20)
    expect(wrapper.emitted('update:filter')).toBeTruthy()
    expect(hide).toHaveBeenCalled()
  })
})
