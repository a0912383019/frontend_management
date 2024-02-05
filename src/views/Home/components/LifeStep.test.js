import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import LifeStep from '@/views/Home/components/LifeStep.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { useGlobalStore } from '@/stores/global.js'
import { dayjs } from 'element-plus'
import HighchartsVue from 'highcharts-vue'

describe('LifeStep.vue', () => {
  let wrapper = null
  vi.mock('@/stores/dateConfig.js', () => ({
    useDateStore: vi.fn()
  }))
  const LAST_DATE = 1513823919228
  const mockLastDate = {
    LAST_DATE,
    date_range_picker_config_1: {
      startDate: dayjs(LAST_DATE).add(1, 'day').subtract(1, 'month'), //預設起始時間
      endDate: dayjs(LAST_DATE) //預設結束時間
    }
  }
  useDateStore.mockReturnValue(mockLastDate)

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, and is triggering watch correctlly', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.tableConfig = {
      0: {
        step_name: '尚未註冊',
        step_description: '',
        step_color: [128, 128, 192],
        step_icon: '',
        step_dot: ''
      },
      1: {
        step_name: 'Active',
        step_description: 'Been actively betting.',
        step_color: [232, 70, 94],
        step_icon: '<i class="fas fa-running mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-paradisepink ml__6"></span>',
        step_vue_icon: 'fa-solid fa-person-running',
        step_vue_dot_color: 'cdp-bg-paradisepink'
      },
      2: {
        step_name: 'NewBorn',
        step_description: 'Bet or Deposited after a login or registration.',
        step_color: [19, 91, 134],
        step_icon: '<i class="fas fa-baby mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-lapislazuli ml__6"></span>',
        step_vue_icon: 'fa-solid fa-baby',
        step_vue_dot_color: 'cdp-bg-lapislazuli'
      },
      3: {
        step_name: 'Growing',
        step_description: 'Made deposits 3 times or more, after a bet or deposit.',
        step_color: [249, 180, 12],
        step_icon: '<i class="fas fa-skating mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-selectiveyellow ml__6"></span>',
        step_vue_icon: 'fa-solid fa-person-skating',
        step_vue_dot_color: 'cdp-bg-selectiveyellow'
      },
      4: {
        step_name: 'Churning-Return',
        step_description: 'Bet or Deposit again after a short break.',
        step_color: [243, 109, 48],
        step_icon: '<i class="fas fa-hiking mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-orangered ml__6"></span>',
        step_vue_icon: 'fa-solid fa-person-hiking',
        step_vue_dot_color: 'cdp-bg-orangered'
      },
      5: {
        step_name: 'Churned-Return',
        step_description: 'Bet or Deposit again after a long break.',
        step_color: [146, 41, 67],
        step_icon: '<i class="fas fa-wheelchair mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-redviolet ml__6"></span>',
        step_vue_icon: 'fa-solid fa-wheelchair',
        step_vue_dot_color: 'cdp-bg-redviolet'
      },
      6: {
        step_name: 'Churning',
        step_description: 'Been quiet for some time, as a bettor/depositor.',
        step_color: [62, 150, 169],
        step_icon: '<i class="fas fa-procedures mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-bluemunsell ml__6"></span>',
        step_vue_icon: 'fa-solid fa-bed-pulse',
        step_vue_dot_color: 'cdp-bg-bluemunsell'
      },
      7: {
        step_name: 'Churned',
        step_description: 'Been quiet for a long time, as a bettor/depositor.',
        step_color: [148, 195, 199],
        step_icon: '<i class="fas fa-skull-crossbones mr__6"></i>',
        step_dot: '<span class="cdp-sm-dots cdp-bg-opal ml__6"></span>',
        step_vue_icon: 'fa-solid fa-skull-crossbones',
        step_vue_dot_color: 'cdp-bg-opal'
      },
      null: {
        step_name: 'Unclassified',
        step_description: 'Unclassified',
        step_color: [128, 128, 192],
        step_icon: '',
        step_dot: ''
      }
    }
    globalStore.activeHall = {
      hall_name: '',
      hall_code: ''
    }
    wrapper = shallowMount(LifeStep, {
      global: {
        plugins: [HighchartsVue, i18n]
      }
    })
    //等待異步完成
    await flushPromises()
    expect(wrapper.vm.stepDataDuration).toStrictEqual('2017/11/22~2017/12/21')
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    const result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            this_day_step: 4,
            total_num: 85
          },
          {
            this_day_step: 5,
            total_num: 59
          },
          {
            this_day_step: 1,
            total_num: 3576
          },
          {
            this_day_step: 2,
            total_num: 181
          },
          {
            this_day_step: 3,
            total_num: 9
          },
          {
            this_day_step: 6,
            total_num: 1128
          }
        ]
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    //觸發watch
    wrapper.vm.activeHall.hall_code = 'esb'
    wrapper.vm.i18nLocale = 'en'
    //等待異步完成
    await flushPromises()
    const data = [
      {
        name: 'Churning-Return',
        y: 85,
        color: 'rgb(243,109,48,1)',
        borderColor: 'rgb(243,109,48,1)'
      },
      {
        name: 'Churned-Return',
        y: 59,
        color: 'rgb(146,41,67,1)',
        borderColor: 'rgb(146,41,67,1)'
      },
      {
        name: 'Active',
        y: 3576,
        color: 'rgb(232,70,94,1)',
        borderColor: 'rgb(232,70,94,1)'
      },
      {
        name: 'NewBorn',
        y: 181,
        color: 'rgb(19,91,134,1)',
        borderColor: 'rgb(19,91,134,1)'
      },
      {
        name: 'Growing',
        y: 9,
        color: 'rgb(249,180,12,1)',
        borderColor: 'rgb(249,180,12,1)'
      },
      {
        name: 'Churning',
        y: 1128,
        color: 'rgb(62,150,169,1)',
        borderColor: 'rgb(62,150,169,1)'
      }
    ]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(data)
  })
})
