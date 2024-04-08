import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import Decline from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/Decline.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CurrencySignText from '@/components/CurrencySignText.vue'
import RankerDetail from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/RankerDetail.vue'
import DetailChart from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/DetailChart.vue'
import Tab from '@/components/Tab.vue'
import { useDataRankAnalysisStore } from '@/stores'

describe('Decline.vue', () => {
  let wrapper = null
  let rankStore
  let spyGet
  let result1

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    rankStore = useDataRankAnalysisStore(pinia)
    rankStore.growthDecayFilter = {
      financialMonth: '01',
      financialWeek: 1,
      financialYear: '2024',
      searchDate: '2024-01',
      rank: 10,
      isFirst: false
    }
    rankStore.growthDecayAgainNum = 0

    result1 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          daily: [
            {
              users: [
                {
                  user_id: 455648693,
                  user_name: 'jimmyrmb01',
                  bet_amount: '11100.0000',
                  commissionable: '10500.0000'
                },
                {
                  user_id: 455673606,
                  user_name: 'guspig43',
                  bet_amount: '0',
                  commissionable: '0'
                }
              ],
              date: {
                fin_year: 2024,
                fin_month: 3,
                fin_week: 2
              }
            },
            {
              users: [
                {
                  user_id: 455648693,
                  user_name: 'jimmyrmb01',
                  bet_amount: '0',
                  commissionable: '0'
                },
                {
                  user_id: 455673606,
                  user_name: 'guspig43',
                  bet_amount: '20500.0000',
                  commissionable: '20491.8000'
                }
              ],
              date: {
                fin_year: 2024,
                fin_month: 3,
                fin_week: 3
              }
            }
          ],
          rank: [
            {
              ag_name: 'dgiambii',
              bet_amount_growth_percent: '100.0000',
              bet_amount_total: '20500.0000',
              bet_amount_total_compare: '0',
              commissionable_growth_percent: '100.0000',
              commissionable_total: '27659.4978',
              commissionable_total_compare: '0',
              user_id: 455673606,
              user_name: 'guspig43',
              level: '未分層',
              tags: [
                30010, 30412, 30358, 30406, 30407, 50001, 9459, 9289, 99079, 9283, 30414, 40003
              ]
            },
            {
              ag_name: 'djimmy',
              bet_amount_growth_percent: '100.0000',
              bet_amount_total: '17657.5900',
              bet_amount_total_compare: '0',
              commissionable_growth_percent: '100.0000',
              commissionable_total: '17650.5270',
              commissionable_total_compare: '0',
              user_id: 455648693,
              user_name: 'jimmyrmb01',
              level: 'QAJimmy(勿動)',
              tags: [30010, 30412, 30406, 30407, 9283, 9289, 99079, 9459, 30414, 40003]
            }
          ]
        }
      }
    }
    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'no result',
          error_code: '210400000'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Decline, {
      global: {
        plugins: [i18n],
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CurrencySignText).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
  })

  it('Expected current tab and tab name correctly', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('RankerDetail')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(RankerDetail)

    // 模擬更改tab
    wrapper.vm.currentTabs = 'DetailChart'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('DetailChart')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(DetailChart)

    const tabData = [
      {
        name: 'RankerDetail',
        label: '排名資料'
      },
      {
        name: 'DetailChart',
        label: '詳細圖表'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
  })

  it('expect mock api and watch growthDecayAgainNum', async () => {
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/bet_amount_growth_decline_rank', {
      params: expect.objectContaining({ order: 'ASC' })
    })
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('loading')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(true)
    expect(wrapper.vm.apiObject.result).toStrictEqual(result1.data.result)

    rankStore.growthDecayAgainNum = 123123123
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/bet_amount_growth_decline_rank', {
      params: expect.objectContaining({ order: 'ASC' })
    })
    expect(spyGet).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('noResult')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(false)
    expect(wrapper.vm.apiObject.result).toStrictEqual({})
  })
})
