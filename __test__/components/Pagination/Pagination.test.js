import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import Pagination from '@/components/Pagination/Pagination.vue'

describe('Pagination', () => {
  let wrapper = null
  const propsData = {
    background: true,
    disabled: false,
    layout: 'total, sizes, prev, pager, next',
    page: 1,
    pageSize: 10,
    pagerCount: 7,
    small: true,
    total: 100
  }

  beforeEach(() => {
    wrapper = shallowMount(Pagination, {
      props: propsData,
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('預期渲染是否正確', async () => {
    expect(wrapper.props('background')).toBe(propsData.background)
    expect(wrapper.props('disabled')).toBe(propsData.disabled)
    expect(wrapper.props('layout')).toBe(propsData.layout)
    expect(wrapper.props('page')).toBe(propsData.page)
    expect(wrapper.props('pageSize')).toBe(propsData.pageSize)
    expect(wrapper.props('pagerCount')).toBe(propsData.pagerCount)
    expect(wrapper.props('small')).toBe(propsData.small)
    expect(wrapper.props('total')).toBe(propsData.total)

    expect(wrapper.findComponent({ name: 'ElPagination' }).exists()).toBe(true)

    wrapper.vm.currentPage = 5
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    expect(wrapper.emitted('update:currentPage')[0]).toEqual([5])
  })
})
