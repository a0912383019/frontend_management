import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useRegisteredNoDepositAnalysisStore } from '@/stores/registeredNoDepositAnalysis.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import Filter from '@/views/RegisteredNoDepositAnalysis/components/Filter.vue'

describe('Filter', () => {
  let wrapper = null
  const hide = vi.fn()
  let mockQuerySelectorAll = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const depositStore = useRegisteredNoDepositAnalysisStore(pinia)
    depositStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })
    wrapper.vm.$refs.popover.hide = hide

    mockQuerySelectorAll = vi
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(() => [null, { setAttribute: vi.fn() }])
  })

  afterEach(() => {
    mockQuerySelectorAll = null
    wrapper.unmount()
  })

  it('closePopover', async () => {
    await wrapper.vm.closePopover()

    expect(hide).toHaveBeenCalled()
  })

  it('selectDepositOptions', () => {
    let options = [
      { value: 'all', label: '全部', selected: true },
      { value: false, label: '未存款' },
      { value: true, label: '已存款' }
    ]

    expect(wrapper.vm.selectDepositOptions).toStrictEqual(options)
  })

  it('setAttributeValue', async () => {
    await wrapper.vm.setAttributeValue()
    expect(mockQuerySelectorAll).toHaveBeenCalled()
  })

  it('handleSubmitClick', async () => {
    wrapper.vm.selectDepositValue = true
    wrapper.vm.updatedTimeDate = '2023-12-03 ~ 2023-12-09'
    wrapper.vm.slideValue = '0;10'
    await wrapper.vm.handleSubmitClick()

    expect(wrapper.vm.depositStore.selectDepositValue).toBe(true)
    expect(wrapper.vm.depositStore.deatilRangeDate).toBe('2023-12-03 ~ 2023-12-09')
    expect(wrapper.vm.depositStore.ipDuplicateRange).toBe('0;10')
  })

  it('handleSliderInput', async () => {
    await wrapper.vm.handleSliderInput([10, 20])
    expect(wrapper.vm.isMax).toBe(false)

    await wrapper.vm.handleSliderInput([10, 90])
    expect(wrapper.vm.isMax).toBe(true)

    await wrapper.vm.handleSliderInput([10, 100])
    expect(mockQuerySelectorAll).toHaveBeenCalled()
  })
})
