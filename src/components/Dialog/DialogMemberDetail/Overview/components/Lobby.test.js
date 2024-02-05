import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Lobby from '@/components/Dialog/DialogMemberDetail/Overview/components/Lobby.vue'
import router from '@/router'
import 'vitest-canvas-mock'

describe('Lobby.vue', () => {
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
        result: [
          {
            lobby_name: 'BB棋牌',
            total_bet_amount: '81172381'
          },
          {
            lobby_name: 'BB電子',
            total_bet_amount: '45449322'
          },
          {
            lobby_name: 'PG電子',
            total_bet_amount: '36621489'
          },
          {
            lobby_name: 'AG視訊',
            total_bet_amount: '6710040'
          },
          {
            lobby_name: 'AG電子',
            total_bet_amount: '1827300'
          },
          {
            lobby_name: 'SW電子',
            total_bet_amount: '470370'
          },
          {
            lobby_name: 'CQ9電子',
            total_bet_amount: '322450'
          },
          {
            lobby_name: 'MG電子',
            total_bet_amount: '322410'
          },
          {
            lobby_name: 'JDB電子',
            total_bet_amount: '74000'
          },
          {
            lobby_name: 'FC電子',
            total_bet_amount: '45900'
          },
          {
            lobby_name: 'NS電子',
            total_bet_amount: '55'
          }
        ]
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(Lobby, {
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

    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(false)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.find('canvas').exists()).toBe(true)

    const label = [
      'BB棋牌',
      'BB電子',
      'PG電子',
      'AG視訊',
      'AG電子',
      'SW電子',
      'CQ9電子',
      'MG電子',
      'JDB電子',
      'FC電子'
    ]
    expect(wrapper.vm.chartSetting.data.labels).toStrictEqual(label)

    const chartSettingDatasets = [
      {
        data: [
          81172381, 45449322, 36621489, 6710040, 1827300, 470370, 322450, 322410, 74000, 45900
        ],
        backgroundColor: [
          'rgb(245,105,84,0.7)',
          'rgb(0,166,90,0.7)',
          'rgb(243,156,18,0.7)',
          'rgb(0,192,239,0.7)',
          'rgb(232,208,152,0.7)',
          'rgb(60,141,188,0.7)',
          'rgb(210,214,222,0.7)',
          'rgb(128,128,192,0.7)',
          'rgb(102,204,204,0.7)',
          'rgb(194,176,97,0.7)'
        ],
        borderWidth: 1,
        hoverBorderWidth: 3,
        borderColor: [
          'rgb(245,105,84,1)',
          'rgb(0,166,90,1)',
          'rgb(243,156,18,1)',
          'rgb(0,192,239,1)',
          'rgb(232,208,152,1)',
          'rgb(60,141,188,1)',
          'rgb(210,214,222,1)',
          'rgb(128,128,192,1)',
          'rgb(102,204,204,1)',
          'rgb(194,176,97,1)'
        ]
      }
    ]
    expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(chartSettingDatasets)
  })
})
