import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import NegativeProfitRank from '@/views/DataRankAnalysis/ProfitRank/NegativeProfitRank.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CurrencySignText from '@/components/CurrencySignText.vue'
import RankerDetail from '@/views/DataRankAnalysis/ProfitRank/components/RankerDetail.vue'
import DetailChart from '@/views/DataRankAnalysis/ProfitRank/components/DetailChart.vue'
import Tab from '@/components/Tab.vue'
import { useDataRankAnalysisStore } from '@/stores'

describe('NegativeProfitRank.vue', () => {
  let wrapper = null
  let rankStore
  let spyGet
  let result1

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    rankStore = useDataRankAnalysisStore(pinia)
    rankStore.profitFilter = {
      searchDate: '2024-01-01 ~ 2024-01-22',
      rank: 10
    }
    rankStore.profitIsSearchedAgainNum = 0

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
                  accumulate_profit_loss: '9430.0000',
                  profit_loss: '9430.0000'
                },
                {
                  user_id: 455673606,
                  user_name: 'guspig43',
                  accumulate_profit_loss: '0',
                  profit_loss: '0'
                }
              ],
              date: '2024-04-01'
            },
            {
              users: [
                {
                  user_id: 455648693,
                  user_name: 'jimmyrmb01',
                  accumulate_profit_loss: '9329.2500',
                  profit_loss: '100.7500'
                },
                {
                  user_id: 455673606,
                  user_name: 'guspig43',
                  accumulate_profit_loss: '8526.5069',
                  profit_loss: '8526.5069'
                }
              ],
              date: '2024-04-02'
            }
          ],
          rank: [
            {
              ag_name: 'dcash888',
              level: '未分層',
              profit_loss: '9298.2500',
              user_id: 455673606,
              user_name: 'guspig43',
              tags: [10001]
            },
            {
              ag_name: 'dqamicotwda',
              level: '未分層',
              profit_loss: '8526.5069',
              user_id: 455648693,
              user_name: 'jimmyrmb01',
              tags: [10001, 10002, 10003, 10004]
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

    wrapper = shallowMount(NegativeProfitRank, {
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

  it('expect mock api and watch profitIsSearchedAgainNum', async () => {
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/positive_negative_profit_rank', {
      params: expect.objectContaining({ order: 'ASC' })
    })
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('loading')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(true)
    expect(wrapper.vm.apiObject.result).toStrictEqual(result1.data.result)

    rankStore.profitIsSearchedAgainNum = 123123123
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/positive_negative_profit_rank', {
      params: expect.objectContaining({ order: 'ASC' })
    })
    expect(spyGet).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('noResult')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(false)
    expect(wrapper.vm.apiObject.result).toStrictEqual({})
  })
})
