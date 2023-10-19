import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import TotalPagination from '@/components/Pagination/TotalPagination.vue'

describe('TotalPagination', () => {
  let wrapper = null
  const propsData = {
    page: 1,
    pageSize: 10,
    total: 102,
    filtered: true,
    totalDataCount: 150
  }

  beforeEach(() => {
    wrapper = shallowMount(TotalPagination, {
      props: propsData,
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('預期渲染是否正確', async () => {
    expect(wrapper.props('page')).toBe(propsData.page)
    expect(wrapper.props('pageSize')).toBe(propsData.pageSize)
    expect(wrapper.props('total')).toBe(propsData.total)
    expect(wrapper.props('filtered')).toBe(propsData.filtered)
    expect(wrapper.props('totalDataCount')).toBe(propsData.totalDataCount)

    expect(wrapper.text()).toContain('1 - 10 / 共 102 筆')
    expect(wrapper.text()).not.toContain('(由 102 筆中進行篩選)')

    await wrapper.setProps({
      page: 11
    })
    expect(wrapper.text()).toContain('101 - 102 / 共 102 筆')
    expect(wrapper.text()).not.toContain('(由 102 筆中進行篩選)')

    await wrapper.setProps({
      total: 0
    })
    expect(wrapper.vm.pageStart).toBe(0)
    expect(wrapper.vm.pageEnd).toBe(0)
  })
})
