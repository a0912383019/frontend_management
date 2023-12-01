import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import RegisteredNoDepositAnalysis from '@/views/RegisteredNoDepositAnalysis/RegisteredNoDepositAnalysis.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Overview from '@/views/RegisteredNoDepositAnalysis/components/Overview.vue'
import Detail from '@/views/RegisteredNoDepositAnalysis/components/Detail.vue'
import Filter from '@/views/RegisteredNoDepositAnalysis/components/Filter.vue'

describe('RegisteredNoDepositAnalysis', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(RegisteredNoDepositAnalysis, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('component exists', () => {
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Overview).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
  })

  it('handleSubmit', async () => {
    // mock function
    wrapper.vm.$refs.refDetail.queryActionScoreDetail = vi.fn()

    // 模擬new Date().getTime()
    const mockDateTime = 123456
    vi.spyOn(Date.prototype, 'getTime').mockReturnValue(mockDateTime)

    // 執行 handleSubmit
    wrapper.vm.handleSubmit()
    await wrapper.vm.$nextTick()

    // 驗證 keyOverview
    expect(wrapper.vm.keyOverview).toBe(mockDateTime)

    // 驗證 queryActionScoreDetail 是否執行
    expect(wrapper.vm.$refs.refDetail.queryActionScoreDetail).toHaveBeenCalled()

    // 執行 handleGetDetail
    wrapper.vm.handleGetDetail()
    await wrapper.vm.$nextTick()

    // 驗證 queryActionScoreDetail 是否執行
    expect(wrapper.vm.$refs.refDetail.queryActionScoreDetail).toHaveBeenCalled()
  })
})
