import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import MemberHealth from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberHealth.vue'
import router from '@/router'
import 'vitest-canvas-mock'

describe('MemberHealth.vue', () => {
  let wrapper = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          action_score: '65',
          recommend_code: 50002,
          update_time: '2023-11-08 19:03:36'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberHealth, {
      global: {
        plugins: [
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })

    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(false)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(wrapper.vm.memberHealthValue).toStrictEqual('65')

    const chartSettingDatasets = [
      {
        data: [35, '65'],
        backgroundColor: ['rgb(255,255,255,0)', 'rgb(245,105,84,0.7)'],
        borderWidth: 1,
        hoverBorderWidth: 2,
        borderColor: ['rgb(255,255,255,0)', 'rgb(245,105,84,1)']
      }
    ]
    expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(chartSettingDatasets)
  })
})
