import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import BetAmount from '@/views/DataRankAnalysis/BetAmount/BetAmount.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CurrencySignText from '@/components/CurrencySignText.vue'
import Filter from '@/views/DataRankAnalysis/BetAmount/components/Filter.vue'
import RankerDetail from '@/views/DataRankAnalysis/BetAmount/components/RankerDetail.vue'
import DetailChart from '@/views/DataRankAnalysis/BetAmount/components/DetailChart.vue'
import Tab from '@/components/Tab.vue'

describe('BetAmount.vue', () => {
  let wrapper = null
  let spyGet
  let result1

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })

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
              date: '2024-03-22'
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
              date: '2024-03-23'
            }
          ],
          rank: [
            {
              ag_name: 'dgiambii',
              bet_amount_total: '20500.0000',
              commissionable_total: '20491.8000',
              user_id: 455673606,
              user_name: 'guspig43',
              user_level: 'shu測試',
              tags: [10001]
            },
            {
              ag_name: 'djimmy',
              bet_amount_total: '11100.0000',
              commissionable_total: '10500.0000',
              user_id: 455648693,
              user_name: 'jimmyrmb01',
              user_level: 'QAJimmy(勿動)',
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
          message: 'success',
          error_code: '210400000'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(BetAmount, {
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
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
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

  it('expect mock api and handleCallApi', async () => {
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/bet_amount_rank', expect.any(Object))
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('loading')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(true)
    expect(wrapper.vm.apiObject.result).toStrictEqual(result1.data.result)

    await wrapper.vm.handleCallApi()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/rank/bet_amount_rank', expect.any(Object))
    expect(spyGet).toHaveBeenCalledTimes(2)
    await flushPromises()
    expect(wrapper.vm.apiObject.messageKey).toStrictEqual('noResult')
    expect(wrapper.vm.apiObject.apiSuccess).toBe(false)
    expect(wrapper.vm.apiObject.result).toStrictEqual({})
  })
})
