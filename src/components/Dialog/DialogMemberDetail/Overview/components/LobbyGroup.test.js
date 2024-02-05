import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import LobbyGroup from '@/components/Dialog/DialogMemberDetail/Overview/components/LobbyGroup.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('LobbyGroup.vue', () => {
  let wrapper = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        result: [
          {
            lobby_group_name: 'card',
            total_bet_amount: '8117238'
          },
          {
            lobby_group_name: 'live',
            total_bet_amount: '7025350'
          },
          {
            lobby_group_name: 'prob',
            total_bet_amount: '14269600'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(LobbyGroup, {
      global: {
        plugins: [
          HighchartsVue,
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)

    const data = [
      { name: '棋牌', y: 8117238, color: 'rgb(245,105,84,0.7)' },
      { name: '視訊', y: 7025350, color: 'rgb(0,166,90,0.7)' },
      { name: '電子', y: 14269600, color: 'rgb(243,156,18,0.7)' }
    ]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(data)
  })
})
