import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import { useTargetGroupStore } from '@/stores'
import Filter from '@/views/TargetGroupAnalysis/components/AnalysisResult/Filter.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createTestingPinia } from '@pinia/testing'

describe('Filter', () => {
  let wrapper = null
  let hide
  let targetStore

  beforeEach(() => {
    hide = vi.fn()

    vi.useFakeTimers()

    const pinia = createTestingPinia({ createSpy: vi.fn })
    targetStore = useTargetGroupStore(pinia)

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
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('closePopover', () => {
    expect(hide).toHaveBeenCalledTimes(0)
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('click filter', async () => {
    const date = new Date(887123)
    vi.setSystemTime(date)

    expect(hide).toHaveBeenCalledTimes(0)
    expect(wrapper.vm.searchDate).toStrictEqual('')

    wrapper.vm.searchDate = '2024-04-08 ~ 2024-05-07'
    await wrapper.vm.handleClick()

    expect(targetStore.groupFilterDate).toStrictEqual('2024-04-08 ~ 2024-05-07')
    expect(targetStore.filtered).toStrictEqual(887123)
    expect(hide).toHaveBeenCalledTimes(1)
  })
})
