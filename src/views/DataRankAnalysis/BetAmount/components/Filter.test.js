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
  const hide = vi.fn()
  const resetState = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const rankStore = useDataRankAnalysisStore(pinia)
    rankStore.resetState = resetState
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

    // 確認 resetState有被呼叫
    expect(resetState).toHaveBeenCalled()
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
  })

  it('handleClick', async () => {
    await wrapper.vm.handleClick()
    expect(wrapper.vm.filterData.searchDate).toBe('2024-03-12 ~ 2024-03-22')
    expect(wrapper.vm.filterData.rank).toBe(10)
    expect(wrapper.emitted('update:filter')).toBeTruthy()
    expect(hide).toHaveBeenCalled()
  })
})
