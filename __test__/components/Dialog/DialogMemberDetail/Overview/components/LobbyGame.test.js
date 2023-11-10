import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import LobbyGame from '@/components/Dialog/DialogMemberDetail/Overview/components/LobbyGame.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('LobbyGame.vue', () => {
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
            lobby_name: 'BB棋牌',
            game_name: '極速百家樂',
            total_bet_amount: '81123330'
          },
          {
            lobby_name: 'BB電子',
            game_name: '秘境冒險',
            total_bet_amount: '45326145'
          },
          {
            lobby_name: 'PG電子',
            game_name: '麻將胡了',
            total_bet_amount: '30203449'
          },
          {
            lobby_name: 'AG視訊',
            game_name: '百家樂',
            total_bet_amount: '6623040'
          },
          {
            lobby_name: 'PG電子',
            game_name: '尋龍探寶',
            total_bet_amount: '2497250'
          },
          {
            lobby_name: 'AG電子',
            game_name: '復古花園',
            total_bet_amount: '1403400'
          },
          {
            lobby_name: 'PG電子',
            game_name: '雙囍臨門',
            total_bet_amount: '1026540'
          },
          {
            lobby_name: 'PG電子',
            game_name: '麻將胡了2',
            total_bet_amount: '878300'
          },
          {
            lobby_name: 'PG電子',
            game_name: '虎虎生財',
            total_bet_amount: '779000'
          },
          {
            lobby_name: 'PG電子',
            game_name: '十倍金牛',
            total_bet_amount: '563500'
          },
          {
            lobby_name: 'AG電子',
            game_name: '太空漫遊',
            total_bet_amount: '423900'
          },
          {
            lobby_name: 'CQ9電子',
            game_name: '跳高高',
            total_bet_amount: '322450'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(LobbyGame, {
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
      { name: 'BB棋牌-極速百家樂', y: 81123330, color: 'rgb(245,105,84,0.7)' },
      { name: 'BB電子-秘境冒險', y: 45326145, color: 'rgb(0,166,90,0.7)' },
      { name: 'PG電子-麻將胡了', y: 30203449, color: 'rgb(243,156,18,0.7)' },
      { name: 'AG視訊-百家樂', y: 6623040, color: 'rgb(0,192,239,0.7)' },
      { name: 'PG電子-尋龍探寶', y: 2497250, color: 'rgb(232,208,152,0.7)' },
      { name: 'AG電子-復古花園', y: 1403400, color: 'rgb(60,141,188,0.7)' },
      { name: 'PG電子-雙囍臨門', y: 1026540, color: 'rgb(210,214,222,0.7)' },
      { name: 'PG電子-麻將胡了2', y: 878300, color: 'rgb(128,128,192,0.7)' },
      { name: 'PG電子-虎虎生財', y: 779000, color: 'rgb(102,204,204,0.7)' },
      { name: 'PG電子-十倍金牛', y: 563500, color: 'rgb(194,176,97,0.7)' }
    ]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(data)
  })
})
