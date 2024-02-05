import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import AmountAnalysis from '@/views/GameTagAnalysis/components/AmountAnalysis/AmountAnalysis.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { useGlobalStore } from '@/stores/global.js'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import HighchartsVue from 'highcharts-vue'

describe('AmountAnalysis', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'esb'
    }
    const gameTagAnalysisStore = useGameTagAnalysis(pinia)
    gameTagAnalysisStore.filterTimestamp = 123999
    gameTagAnalysisStore.filterFormData.value = {
      date: '2023-11-04 ~ 2023-12-03',
      excludeTag: '40030',
      searchTag: '10001;40001'
    }
    const result1 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            bet_amount: '68528800.0000',
            lobby_name: 'BB棋牌',
            game_name: '極速百家樂'
          },
          {
            bet_amount: '57307500.0000',
            lobby_name: 'BB棋牌',
            game_name: '區塊鏈百家樂'
          },
          {
            bet_amount: '52374942.8000',
            lobby_name: 'PG電子',
            game_name: '麻將胡了'
          },
          {
            bet_amount: '32484867.6000',
            lobby_name: 'FC電子',
            game_name: '大過年'
          },
          {
            bet_amount: '25344900.0000',
            lobby_name: 'BB電子',
            game_name: '秘境冒險'
          },
          {
            bet_amount: '19930655.0000',
            lobby_name: 'BB視訊',
            game_name: '百家樂'
          },
          {
            bet_amount: '13597821.0000',
            lobby_name: 'AG視訊',
            game_name: '百家樂'
          },
          {
            bet_amount: '12356007.6300',
            lobby_name: '波音體育',
            game_name: '足球'
          },
          {
            bet_amount: '11895248.0000',
            lobby_name: 'BB彩票',
            game_name: 'BB 幸運熊貓'
          },
          {
            bet_amount: '10168902.0000',
            lobby_name: 'New BB體育',
            game_name: '足球'
          },
          {
            bet_amount: '9916255.0000',
            lobby_name: 'New BB體育',
            game_name: '籃球'
          },
          {
            bet_amount: '9262899.0000',
            lobby_name: 'EVO視訊',
            game_name: '超級骰寶'
          },
          {
            bet_amount: '5275735.0000',
            lobby_name: 'BB視訊',
            game_name: '輪盤'
          },
          {
            bet_amount: '5103250.0000',
            lobby_name: '沙巴體育',
            game_name: '足球'
          },
          {
            bet_amount: '4767557.0000',
            lobby_name: '沙巴體育',
            game_name: '籃球'
          },
          {
            bet_amount: '3609194.0000',
            lobby_name: 'AG視訊',
            game_name: '牛牛'
          },
          {
            bet_amount: '3448441.0000',
            lobby_name: 'BB捕魚達人',
            game_name: '魔鬼剋星'
          },
          {
            bet_amount: '2919420.0000',
            lobby_name: 'PG電子',
            game_name: '尋龍探寶'
          },
          {
            bet_amount: '2671560.0000',
            lobby_name: 'AG電子',
            game_name: '復古花園'
          },
          {
            bet_amount: '2449492.0000',
            lobby_name: 'New BB體育',
            game_name: '羽毛球'
          }
        ]
      }
    }
    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success',
          error_code: '210400000'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試api資料
  it('expect mock api', async () => {
    wrapper = shallowMount(AmountAnalysis, {
      global: {
        plugins: [HighchartsVue, i18n]
      }
    })

    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/game/tags_game_rank', expect.any(Object))
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)

    const categories = [
      'BB棋牌-極速百家樂',
      'BB棋牌-區塊鏈百家樂',
      'PG電子-麻將胡了',
      'FC電子-大過年',
      'BB電子-秘境冒險',
      'BB視訊-百家樂',
      'AG視訊-百家樂',
      '波音體育-足球',
      'BB彩票-BB 幸運熊貓',
      'New BB體育-足球',
      'New BB體育-籃球',
      'EVO視訊-超級骰寶',
      'BB視訊-輪盤',
      '沙巴體育-足球',
      '沙巴體育-籃球',
      'AG視訊-牛牛',
      'BB捕魚達人-魔鬼剋星',
      'PG電子-尋龍探寶',
      'AG電子-復古花園',
      'New BB體育-羽毛球'
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)

    const seriesData = [
      {
        y: 68528800,
        color: 'rgb(245,105,84,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(245,105,84,1)'
      },
      {
        y: 57307500,
        color: 'rgb(0,166,90,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(0,166,90,1)'
      },
      {
        y: 52374942.8,
        color: 'rgb(243,156,18,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(243,156,18,1)'
      },
      {
        y: 32484867.6,
        color: 'rgb(0,192,239,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(0,192,239,1)'
      },
      {
        y: 25344900,
        color: 'rgb(232,208,152,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(232,208,152,1)'
      },
      {
        y: 19930655,
        color: 'rgb(60,141,188,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(60,141,188,1)'
      },
      {
        y: 13597821,
        color: 'rgb(210,214,222,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(210,214,222,1)'
      },
      {
        y: 12356007.63,
        color: 'rgb(128,128,192,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(128,128,192,1)'
      },
      {
        y: 11895248,
        color: 'rgb(102,204,204,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(102,204,204,1)'
      },
      {
        y: 10168902,
        color: 'rgb(194,176,97,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(194,176,97,1)'
      },
      {
        y: 9916255,
        color: 'rgb(200,100,80,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(200,100,80,1)'
      },
      {
        y: 9262899,
        color: 'rgb(51,51,102,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(51,51,102,1)'
      },
      {
        y: 5275735,
        color: 'rgb(30,222,88,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(30,222,88,1)'
      },
      {
        y: 5103250,
        color: 'rgb(102,102,102,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(102,102,102,1)'
      },
      {
        y: 4767557,
        color: 'rgb(111,22,222,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(111,22,222,1)'
      },
      {
        y: 3609194,
        color: 'rgb(255,153,204,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(255,153,204,1)'
      },
      {
        y: 3448441,
        color: 'rgb(123,99,82,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(123,99,82,1)'
      },
      {
        y: 2919420,
        color: 'rgb(255,0,204,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(255,0,204,1)'
      },
      {
        y: 2671560,
        color: 'rgb(88,140,140,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(88,140,140,1)'
      },
      {
        y: 2449492,
        color: 'rgb(51,102,51,0.7)',
        pointWidth: 55,
        borderColor: 'rgb(51,102,51,1)'
      }
    ]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(seriesData)

    //觸發watch
    wrapper.vm.filterTimestamp = 88776655
    await flushPromises()
    expect(spyGet).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.messageKey).toStrictEqual('noResult')
  })
})
