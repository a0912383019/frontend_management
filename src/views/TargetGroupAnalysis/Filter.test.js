import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import Filter from '@/views/TargetGroupAnalysis/Filter.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('Filter', () => {
  let wrapper = null
  let hide

  beforeEach(() => {
    hide = vi.fn()
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

  it('closePopover', () => {
    expect(hide).toHaveBeenCalledTimes(0)
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('click filter', async () => {
    expect(hide).toHaveBeenCalledTimes(0)
    expect(wrapper.vm.searchName).toStrictEqual('')

    wrapper.vm.searchName = 'yuyu'
    await wrapper.vm.handleClick()

    expect(wrapper.emitted('searchWithTargetName')).toBeTruthy()
    expect(wrapper.emitted('searchWithTargetName')[0]).toEqual(['yuyu'])
    expect(hide).toHaveBeenCalledTimes(1)
  })
})
