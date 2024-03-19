import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useVipCommercialAnalysisStore, useGlobalStore } from '@/stores'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Overview from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Overview.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('Overview', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const vipStore = useVipCommercialAnalysisStore(pinia)
    vipStore.livelyAnalysisFilter = {
      searchDate: '2024/01/20',
      vipTag: '10001,10003'
    }

    const globalStore = useGlobalStore(pinia)
    globalStore.activityStep = [
      {
        title: '非常活躍'
      },
      {
        title: '很活躍'
      },
      {
        title: '一般'
      },
      {
        title: '活躍下滑'
      },
      {
        title: '即將流失'
      },
      {
        title: '已流失'
      }
    ]

    const result1 = {
      data: {
        result: [
          {
            lively_level: 0,
            total_num: 11,
            increase_num: 0,
            decrease_num: 0
          },
          {
            lively_level: 1,
            total_num: 0,
            increase_num: 0,
            decrease_num: 0
          },
          {
            lively_level: 2,
            total_num: 0,
            increase_num: 0,
            decrease_num: 0
          },
          {
            lively_level: 3,
            total_num: 0,
            increase_num: 0,
            decrease_num: 0
          },
          {
            lively_level: 4,
            total_num: 0,
            increase_num: 0,
            decrease_num: 0
          },
          {
            lively_level: 5,
            total_num: 0,
            increase_num: 0,
            decrease_num: 0
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
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

    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Overview, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 驗證組件是否存在
    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('Expected today is correctly', () => {
    expect(wrapper.vm.today).toBe('2024/01/20')
  })

  it('Expected tooltipDate is correctly', () => {
    const result = {
      lastWeekData: '2024/01/07 ~ 2024/01/13',
      thisWeekData: '2024/01/14 ~ 2024/01/20'
    }
    const tooltipDate = {
      lastWeekData: '',
      thisWeekData: ''
    }
    Object.entries(wrapper.vm.tooltipDate).map((item) => {
      tooltipDate[item[0]] = item[1].trim().replace(/\n\s*/g, ' ')
    })
    expect(tooltipDate).toStrictEqual(result)
  })

  it('Expected reverseActivityStep is correctly', () => {
    const result = [
      {
        title: '已流失'
      },
      {
        title: '即將流失'
      },
      {
        title: '活躍下滑'
      },
      {
        title: '一般'
      },
      {
        title: '很活躍'
      },
      {
        title: '非常活躍'
      }
    ]

    expect(wrapper.vm.reverseActivityStep).toStrictEqual(result)
  })

  it('handleCallDeatilApi', () => {
    const data = 'test data'
    wrapper.vm.handleCallDeatilApi(data)
    expect(wrapper.emitted('update:detail_api')).toStrictEqual([['test data']])
  })
})
