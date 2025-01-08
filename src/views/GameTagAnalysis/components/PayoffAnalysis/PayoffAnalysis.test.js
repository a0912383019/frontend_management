import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import PayoffAnalysis from '@/views/GameTagAnalysis/components/PayoffAnalysis/PayoffAnalysis.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { useGlobalStore } from '@/stores/global.js'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import HighchartsVue from 'highcharts-vue'

describe('PayoffAnalysis', () => {
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
            payoff: '2086853.7500',
            lobby_name: 'BB棋牌',
            game_name: '區塊鏈百家樂'
          },
          {
            payoff: '658910.9800',
            lobby_name: 'PG電子',
            game_name: '尋寶黃金城'
          },
          {
            payoff: '537578.6000',
            lobby_name: 'BG視訊',
            game_name: '百家樂'
          },
          {
            payoff: '218505.6000',
            lobby_name: 'AG電子',
            game_name: '復古花園'
          },
          {
            payoff: '186109.0000',
            lobby_name: 'BB電子',
            game_name: '中獎彩金'
          },
          {
            payoff: '165655.1700',
            lobby_name: 'BB彩票',
            game_name: '六合彩'
          },
          {
            payoff: '162599.0400',
            lobby_name: 'BB彩票',
            game_name: 'BB 五星宏輝'
          },
          {
            payoff: '97759.7000',
            lobby_name: 'New BB體育',
            game_name: '反恐菁英:全球攻勢'
          },
          {
            payoff: '97545.6500',
            lobby_name: 'BG視訊',
            game_name: '多彩百家樂'
          },
          {
            payoff: '82491.0000',
            lobby_name: 'AG電子',
            game_name: '肉蒲團'
          },
          {
            payoff: '78294.4000',
            lobby_name: 'CQ9電子',
            game_name: '一炮捕魚'
          },
          {
            payoff: '57515.2400',
            lobby_name: 'New BB體育',
            game_name: '拳擊'
          },
          {
            payoff: '56389.0000',
            lobby_name: 'AG視訊',
            game_name: '龍虎'
          },
          {
            payoff: '55576.0600',
            lobby_name: 'CC彩票',
            game_name: '香港六合彩'
          },
          {
            payoff: '51792.5300',
            lobby_name: 'New BB體育',
            game_name: '英雄聯盟'
          },
          {
            payoff: '46742.2800',
            lobby_name: 'PG電子',
            game_name: '恐龍帝國'
          },
          {
            payoff: '45490.0000',
            lobby_name: 'Platipus電子',
            game_name: '吉普賽小姐'
          },
          {
            payoff: '38190.9200',
            lobby_name: 'AG視訊',
            game_name: '炸金花'
          },
          {
            payoff: '37800.5700',
            lobby_name: 'CC彩票',
            game_name: 'CC極速六合彩'
          },
          {
            payoff: '35500.0000',
            lobby_name: 'AG電子',
            game_name: 'YP刮刮卡'
          }
        ]
      }
    }
    const result2 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            payoff: '-3978691.1500',
            lobby_name: 'AG視訊',
            game_name: '百家樂'
          },
          {
            payoff: '-2991161.3100',
            lobby_name: 'BB視訊',
            game_name: '百家樂'
          },
          {
            payoff: '-1766293.9115',
            lobby_name: '波音體育',
            game_name: '足球'
          },
          {
            payoff: '-1763512.3000',
            lobby_name: 'TP彩票',
            game_name: '六合彩'
          },
          {
            payoff: '-1588598.9100',
            lobby_name: 'New BB體育',
            game_name: '籃球'
          },
          {
            payoff: '-1407948.9100',
            lobby_name: 'BB棋牌',
            game_name: '極速百家樂'
          },
          {
            payoff: '-1362202.0000',
            lobby_name: 'BB視訊',
            game_name: '區塊鏈色碟'
          },
          {
            payoff: '-1344428.9700',
            lobby_name: '沙巴體育',
            game_name: '足球'
          },
          {
            payoff: '-1117070.2200',
            lobby_name: 'New BB體育',
            game_name: '複式過關'
          },
          {
            payoff: '-1002646.8400',
            lobby_name: 'BB視訊',
            game_name: '色碟'
          },
          {
            payoff: '-882855.3500',
            lobby_name: 'New BB體育',
            game_name: '足球'
          },
          {
            payoff: '-797309.2400',
            lobby_name: 'BB彩票',
            game_name: 'BB 幸運熊貓'
          },
          {
            payoff: '-794460.0000',
            lobby_name: 'BB電子',
            game_name: '秘境冒險'
          },
          {
            payoff: '-630517.7900',
            lobby_name: '皇冠體育',
            game_name: '足球'
          },
          {
            payoff: '-606276.0545',
            lobby_name: '波音體育',
            game_name: '籃球'
          },
          {
            payoff: '-509877.0000',
            lobby_name: 'BB視訊',
            game_name: '輪盤'
          },
          {
            payoff: '-441527.7400',
            lobby_name: 'FC電子',
            game_name: '大過年'
          },
          {
            payoff: '-415095.8000',
            lobby_name: 'New BB體育',
            game_name: '排球'
          },
          {
            payoff: '-402692.3000',
            lobby_name: 'BB電子',
            game_name: '糖果派對'
          },
          {
            payoff: '-394818.9800',
            lobby_name: 'New BB體育',
            game_name: '網球'
          }
        ]
      }
    }

    const result3 = {
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
    spyGet.mockResolvedValue(result3)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試api資料
  it('expect mock api', async () => {
    wrapper = shallowMount(PayoffAnalysis, {
      global: {
        plugins: [HighchartsVue, i18n]
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/game/tags_game_payoff_rank', expect.any(Object))
    //有分正負損益所以會打兩次api
    expect(spyGet).toHaveBeenCalledTimes(2)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.vm.chartOptions.chart.height).toBe(300)
    expect(wrapper.vm.chartOptions.chart.marginLeft).toBe(100)

    await wrapper.vm.$nextTick()
    const pCategories = [
      'BB棋牌-區塊鏈百家樂',
      'PG電子-尋寶黃金城',
      'BG視訊-百家樂',
      'AG電子-復古花園',
      'BB電子-中獎彩金',
      'BB彩票-六合彩',
      'BB彩票-BB 五星宏輝',
      'New BB體育-反恐菁英:全球攻勢',
      'BG視訊-多彩百家樂',
      'AG電子-肉蒲團',
      'CQ9電子-一炮捕魚',
      'New BB體育-拳擊',
      'AG視訊-龍虎',
      'CC彩票-香港六合彩',
      'New BB體育-英雄聯盟',
      'PG電子-恐龍帝國',
      'Platipus電子-吉普賽小姐',
      'AG視訊-炸金花',
      'CC彩票-CC極速六合彩',
      'AG電子-YP刮刮卡'
    ]
    expect(wrapper.vm.pChartOptions.xAxis.categories).toStrictEqual(pCategories)
    const nCategories = [
      'AG視訊-百家樂',
      'BB視訊-百家樂',
      '波音體育-足球',
      'TP彩票-六合彩',
      'New BB體育-籃球',
      'BB棋牌-極速百家樂',
      'BB視訊-區塊鏈色碟',
      '沙巴體育-足球',
      'New BB體育-複式過關',
      'BB視訊-色碟',
      'New BB體育-足球',
      'BB彩票-BB 幸運熊貓',
      'BB電子-秘境冒險',
      '皇冠體育-足球',
      '波音體育-籃球',
      'BB視訊-輪盤',
      'FC電子-大過年',
      'New BB體育-排球',
      'BB電子-糖果派對',
      'New BB體育-網球'
    ]
    expect(wrapper.vm.nChartOptions.xAxis.categories).toStrictEqual(nCategories)

    const pSeriesData = [
      { y: 2086853.75, color: 'rgb(245,105,84,0.7)', pointWidth: 55 },
      { y: 658910.98, color: 'rgb(0,166,90,0.7)', pointWidth: 55 },
      { y: 537578.6, color: 'rgb(243,156,18,0.7)', pointWidth: 55 },
      { y: 218505.6, color: 'rgb(0,192,239,0.7)', pointWidth: 55 },
      { y: 186109, color: 'rgb(232,208,152,0.7)', pointWidth: 55 },
      { y: 165655.17, color: 'rgb(60,141,188,0.7)', pointWidth: 55 },
      { y: 162599.04, color: 'rgb(210,214,222,0.7)', pointWidth: 55 },
      { y: 97759.7, color: 'rgb(128,128,192,0.7)', pointWidth: 55 },
      { y: 97545.65, color: 'rgb(102,204,204,0.7)', pointWidth: 55 },
      { y: 82491, color: 'rgb(194,176,97,0.7)', pointWidth: 55 },
      { y: 78294.4, color: 'rgb(200,100,80,0.7)', pointWidth: 55 },
      { y: 57515.24, color: 'rgb(51,51,102,0.7)', pointWidth: 55 },
      { y: 56389, color: 'rgb(30,222,88,0.7)', pointWidth: 55 },
      { y: 55576.06, color: 'rgb(102,102,102,0.7)', pointWidth: 55 },
      { y: 51792.53, color: 'rgb(111,22,222,0.7)', pointWidth: 55 },
      { y: 46742.28, color: 'rgb(255,153,204,0.7)', pointWidth: 55 },
      { y: 45490, color: 'rgb(123,99,82,0.7)', pointWidth: 55 },
      { y: 38190.92, color: 'rgb(255,0,204,0.7)', pointWidth: 55 },
      { y: 37800.57, color: 'rgb(88,140,140,0.7)', pointWidth: 55 },
      { y: 35500, color: 'rgb(51,102,51,0.7)', pointWidth: 55 }
    ]
    expect(wrapper.vm.pChartOptions.series[0].data).toStrictEqual(pSeriesData)
    const nSeriesData = [
      { y: -3978691.15, color: 'rgb(245,105,84,0.7)', pointWidth: 55 },
      { y: -2991161.31, color: 'rgb(0,166,90,0.7)', pointWidth: 55 },
      { y: -1766293.9115, color: 'rgb(243,156,18,0.7)', pointWidth: 55 },
      { y: -1763512.3, color: 'rgb(0,192,239,0.7)', pointWidth: 55 },
      { y: -1588598.91, color: 'rgb(232,208,152,0.7)', pointWidth: 55 },
      { y: -1407948.91, color: 'rgb(60,141,188,0.7)', pointWidth: 55 },
      { y: -1362202, color: 'rgb(210,214,222,0.7)', pointWidth: 55 },
      { y: -1344428.97, color: 'rgb(128,128,192,0.7)', pointWidth: 55 },
      { y: -1117070.22, color: 'rgb(102,204,204,0.7)', pointWidth: 55 },
      { y: -1002646.84, color: 'rgb(194,176,97,0.7)', pointWidth: 55 },
      { y: -882855.35, color: 'rgb(200,100,80,0.7)', pointWidth: 55 },
      { y: -797309.24, color: 'rgb(51,51,102,0.7)', pointWidth: 55 },
      { y: -794460, color: 'rgb(30,222,88,0.7)', pointWidth: 55 },
      { y: -630517.79, color: 'rgb(102,102,102,0.7)', pointWidth: 55 },
      { y: -606276.0545, color: 'rgb(111,22,222,0.7)', pointWidth: 55 },
      { y: -509877, color: 'rgb(255,153,204,0.7)', pointWidth: 55 },
      { y: -441527.74, color: 'rgb(123,99,82,0.7)', pointWidth: 55 },
      { y: -415095.8, color: 'rgb(255,0,204,0.7)', pointWidth: 55 },
      { y: -402692.3, color: 'rgb(88,140,140,0.7)', pointWidth: 55 },
      { y: -394818.98, color: 'rgb(51,102,51,0.7)', pointWidth: 55 }
    ]
    expect(wrapper.vm.nChartOptions.series[0].data).toStrictEqual(nSeriesData)

    //觸發watch
    wrapper.vm.i18nLocale = 'en'
    await flushPromises()
    expect(spyGet).toHaveBeenCalledTimes(4)
    expect(wrapper.vm.chartOptions.chart.height).toBe(500)
    expect(wrapper.vm.chartOptions.chart.marginLeft).toBe(140)
    expect(wrapper.vm.pMessageKey).toStrictEqual('noResult')
    expect(wrapper.vm.nMessageKey).toStrictEqual('noResult')
  })
})
