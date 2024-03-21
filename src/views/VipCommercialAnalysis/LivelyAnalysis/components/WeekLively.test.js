import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import WeekLively from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/WeekLively.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('WeekLively', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const result1 = {
      data: {
        result: [
          {
            analysis_date: '2024-03-10 ~ 2024-03-16',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-03-03 ~ 2024-03-09',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-02-25 ~ 2024-03-02',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-02-18 ~ 2024-02-24',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-02-11 ~ 2024-02-17',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-02-04 ~ 2024-02-10',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-01-28 ~ 2024-02-03',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-01-21 ~ 2024-01-27',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-01-14 ~ 2024-01-20',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2024-01-07 ~ 2024-01-13',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2023-12-31 ~ 2024-01-06',
            analysis_level: 0,
            avg_action_score: '0'
          },
          {
            analysis_date: '2023-12-24 ~ 2023-12-30',
            analysis_level: 0,
            avg_action_score: '0'
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

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(WeekLively, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        data: {
          user_name: 'win888e',
          user_id: 6,
          startDate: '2023-12-19',
          endDate: '2024-03-17'
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

  it('Expected API data in the transform function is correct', () => {
    const data = [
      [
        {
          duration: '2024/03/10 ~ 2024/03/16',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/03/03 ~ 2024/03/09',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/02/25 ~ 2024/03/02',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/02/18 ~ 2024/02/24',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        }
      ],
      [
        {
          duration: '2024/02/11 ~ 2024/02/17',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/02/04 ~ 2024/02/10',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/01/28 ~ 2024/02/03',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/01/21 ~ 2024/01/27',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        }
      ],
      [
        {
          duration: '2024/01/14 ~ 2024/01/20',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2024/01/07 ~ 2024/01/13',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2023/12/31 ~ 2024/01/06',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        },
        {
          duration: '2023/12/24 ~ 2023/12/30',
          avgLevel: 0,
          score: '0',
          icon: {
            icon: 'fa-dizzy',
            color: 'cdp-text-light__slate__gray'
          },
          iconStepName: '已流失'
        }
      ]
    ]
    expect(wrapper.vm.tableData).toStrictEqual(data)
  })

  it('Expected formatI18nDate is correctly', async () => {
    const result = await wrapper.vm.formatI18nDate('2024-01-10~2024-01-20')
    expect(result).toBe('2024/01/10 ~ 2024/01/20')
  })

  it('Expected tableColumns is correctly', async () => {
    const result = [
      {
        label: '日期區間',
        prop: 'duration',
        align: 'center',
        minWidth: '67%'
      },
      {
        label: '平均活躍度',
        prop: 'icon',
        align: 'center',
        minWidth: '33%'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(result)
  })
})
