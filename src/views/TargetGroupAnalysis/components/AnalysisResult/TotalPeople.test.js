import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import TotalPeople from '@/views/TargetGroupAnalysis/components/AnalysisResult/TotalPeople.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import HighchartsVue from 'highcharts-vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'

describe('TotalPeople.vue', () => {
  let wrapper = null
  let targetStore
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    targetStore = useTargetGroupStore(pinia)
    targetStore.filtered = new Date(12342323).getTime()

    let result1 = new Error('err')
    result1.response = { status: 500 }

    let result2 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            custom_tags_id: '226b8f7e-8588-473e-a876-acb325d3be14',
            custom_tags_name: 'Edited-裝置',
            total_people: 1699
          },
          {
            custom_tags_id: 'ae3d4e13-96ba-47e1-9cf2-f559a02a3328',
            custom_tags_name: 'Edited-機器標',
            total_people: 37
          },
          {
            custom_tags_id: 'c2733268-4a07-473b-a082-a19f00625e12',
            custom_tags_name: 'Edited-規則標',
            total_people: 102
          }
        ]
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockRejectedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = shallowMount(TotalPeople, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        targetId: 'ttui-uuid-9999'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toStrictEqual('chartFailed')
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('test api & watch correctly', async () => {
    expect(targetStore.filtered).toStrictEqual(12342323)
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.apiSuccess).toBe(false)

    // 模擬搜尋，觸發watch
    targetStore.filtered = new Date(22342323).getTime()

    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.props('targetId')}/total_people`,
      expect.any(Object)
    )
    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual([
      {
        borderColor: 'rgb(245,105,84,1)',
        color: 'rgb(245,105,84,1)',
        name: 'Edited-裝置',
        y: 1699
      },
      {
        borderColor: 'rgb(0,166,90,1)',
        color: 'rgb(0,166,90,1)',
        name: 'Edited-機器標',
        y: 37
      },
      {
        borderColor: 'rgb(243,156,18,1)',
        color: 'rgb(243,156,18,1)',
        name: 'Edited-規則標',
        y: 102
      }
    ])
  })

  it('clearChart', async () => {
    wrapper.vm.chartOptions.series[0].data = ['series']
    await wrapper.vm.clearChart()
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual([])
  })
})
