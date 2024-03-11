import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import ElementPlus from 'element-plus'
import Filter from '@/views/VipCommercialAnalysis/DayReport/components/Filter.vue'
import * as module from '@/utils/commonUtils.js'

describe('Filter', () => {
  let wrapper = null
  const hide = vi.fn()
  let spy

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

  it('handleClick', async () => {
    let searchDate = '2024-01-10'
    let vipTag = '10001,10003'
    wrapper.vm.filterData.searchDate = searchDate
    wrapper.vm.filterData.vipTag = vipTag
    await wrapper.vm.handleClick()
    expect(wrapper.vm.dayReportFilter.searchDate).toBe(searchDate)
    expect(wrapper.vm.dayReportFilter.vipTag).toBe(vipTag)

    const defaultVipTagData = wrapper.vm.defaultVipTag
    wrapper.vm.filterData.vipTag = ''
    await wrapper.vm.handleClick()
    expect(wrapper.vm.filterData.vipTag).toBe(defaultVipTagData)
  })

  it('watch systemConfigIsOk change', async () => {
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
