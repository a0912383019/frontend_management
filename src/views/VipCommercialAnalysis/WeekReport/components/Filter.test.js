import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ElementPlus from 'element-plus'
import Filter from '@/views/VipCommercialAnalysis/WeekReport/components/Filter.vue'
import * as module from '@/utils/commonUtils.js'

describe('Filter', () => {
  let wrapper = null
  const hide = vi.fn()
  let spy
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'esx'
    }

    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())

    //模擬第一次與第二次呼叫getSessionStorageEntity
    module.getSessionStorageEntity
      .mockReturnValueOnce({
        tags_config: {
          esx: {
            10001: {
              tag_type: 1,
              tag_name: 'VIP客',
              tag_description: '人工定義為高價值會員'
            },
            10003: {
              tag_type: 3,
              tag_name: '深耕客',
              tag_description: '近15個實動日，當日贏後下次會賭更大會員'
            }
          }
        }
      })
      .mockReturnValueOnce({
        tags_config: {
          esx: {
            10001: {
              tag_type: 1,
              tag_name: 'VIP客',
              tag_description: '人工定義為高價值會員'
            },
            10003: {
              tag_type: 3,
              tag_name: '深耕客',
              tag_description: '近15個實動日，當日贏後下次會賭更大會員'
            }
          }
        }
      })

    const result1 = {
      data: {
        result: [
          {
            month: 1,
            weeks: [
              {
                fin_week: 1,
                week_duration: '2024-01-01 ~ 2024-01-07'
              },
              {
                fin_week: 2,
                week_duration: '2024-01-08 ~ 2024-01-14'
              },
              {
                fin_week: 3,
                week_duration: '2024-01-15 ~ 2024-01-21'
              },
              {
                fin_week: 4,
                week_duration: '2024-01-22 ~ 2024-01-28'
              },
              {
                fin_week: 5,
                week_duration: '2024-01-29 ~ 2024-02-04'
              }
            ]
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })

    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試 closePopover
  it('closePopover', () => {
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalled()
  })

  it('handleDateChange', async () => {
    const result = [
      {
        label: '1(2024/01/01 ~ 2024/01/07)',
        value: '1(2024/01/01 ~ 2024/01/07)'
      },
      {
        label: '2(2024/01/08 ~ 2024/01/14)',
        value: '2(2024/01/08 ~ 2024/01/14)'
      },
      {
        label: '3(2024/01/15 ~ 2024/01/21)',
        value: '3(2024/01/15 ~ 2024/01/21)'
      },
      {
        label: '4(2024/01/22 ~ 2024/01/28)',
        value: '4(2024/01/22 ~ 2024/01/28)'
      },
      {
        label: '5(2024/01/29 ~ 2024/02/04)',
        value: '5(2024/01/29 ~ 2024/02/04)'
      }
    ]
    await wrapper.vm.handleDateChange()
    expect(wrapper.vm.selectWeeks).toStrictEqual(result)
    expect(hide).toHaveBeenCalled()
    expect(wrapper.vm.filterData.displayweek).toBe('1(2024/01/01 ~ 2024/01/07)')
    expect(wrapper.vm.filterData.apiWeek).toBe(1)
  })

  it('handleWeekChange', async () => {
    const value = '2(2024/01/08 ~ 2024/01/14)'
    const result = 2
    await wrapper.vm.handleWeekChange(value)
    expect(wrapper.vm.filterData.apiWeek).toBe(result)
  })

  it('handleClick', async () => {
    const defaultVipTagData = wrapper.vm.defaultVipTag
    wrapper.vm.filterData.vipTag = ''
    wrapper.vm.filterData.searchDate = '2024-02-10'
    await wrapper.vm.handleClick()
    expect(wrapper.vm.filterData.vipTag).toBe(defaultVipTagData)
    expect(wrapper.vm.weekReportFilter.financialMonth).toBe('02')
    expect(wrapper.vm.weekReportFilter.financialWeek).toBe(1)
    expect(wrapper.vm.weekReportFilter.financialYear).toBe('2024')
    expect(wrapper.vm.weekReportFilter.date).toBe('2024-02')
    expect(wrapper.vm.weekReportFilter.vipTag).toBe(defaultVipTagData)
  })

  it('watch', () => {
    wrapper.vm.isFirst = false
    wrapper.vm.systemConfigIsOk = 1239749012709
    expect(wrapper.vm.tagsConfig).toStrictEqual({
      10001: {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員'
      },
      10003: {
        tag_type: 3,
        tag_name: '深耕客',
        tag_description: '近15個實動日，當日贏後下次會賭更大會員'
      }
    })
  })
})
