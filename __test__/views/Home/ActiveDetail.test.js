import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import ActiveDetail from '@/views/Home/components/ActiveDetail.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ElementPlus, { dayjs } from 'element-plus'
import { useGlobalStore } from '@/stores/global.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import HighchartsVue from 'highcharts-vue'

describe('ActiveDetail.vue', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    const result1 = {
      status: {
        return_code: '0000',
        message: 'success'
      },
      result: [
        {
          analysis_date: '2023-11-14 ~ 2023-11-20',
          analysis_level: 3,
          avg_action_score: '0.5720'
        },
        {
          analysis_date: '2023-11-07 ~ 2023-11-13',
          analysis_level: 1,
          avg_action_score: '0.2488'
        }
      ]
    }
    const result2 = {
      status: {
        return_code: '0000',
        message: 'success'
      },
      result: [
        {
          action_score: '0.2312',
          data_date: '2023-11-07'
        },
        {
          action_score: '0.2159',
          data_date: '2023-11-08'
        },
        {
          action_score: '0.1918',
          data_date: '2023-11-09'
        },
        {
          action_score: '0.1918',
          data_date: '2023-11-10'
        },
        {
          action_score: '0.1917',
          data_date: '2023-11-11'
        },
        {
          action_score: '0.2366',
          data_date: '2023-11-12'
        },
        {
          action_score: '0.4825',
          data_date: '2023-11-13'
        },
        {
          action_score: '0.6954',
          data_date: '2023-11-14'
        },
        {
          action_score: '0.7831',
          data_date: '2023-11-15'
        },
        {
          action_score: '0.7203',
          data_date: '2023-11-16'
        },
        {
          action_score: '0.5597',
          data_date: '2023-11-17'
        },
        {
          action_score: '0.4870',
          data_date: '2023-11-18'
        },
        {
          action_score: '0.4455',
          data_date: '2023-11-19'
        },
        {
          action_score: '0.3127',
          data_date: '2023-11-20'
        }
      ]
    }
    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/home/member_recent_week_lively':
          return Promise.resolve({ data: result1 })
        case '/api/auth/home/member_recent_lively':
          return Promise.resolve({ data: result2 })
        default:
          return error
      }
    })

    wrapper = shallowMount(ActiveDetail, {
      global: {
        plugins: [i18n, ElementPlus, HighchartsVue],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        lastDate: dayjs(1513823919228)
      }
    })
    //等待異步完成
    await flushPromises()

    const activeStepTableColumns = [
      { label: '日期區間', prop: 'duration', align: 'center' },
      { label: '平均活躍度', prop: 'avgLevel', align: 'center', width: 300 },
      { label: '活躍度', prop: 'icon', align: 'center', width: 100 }
    ]
    expect(wrapper.vm.activeStepTableColumns).toStrictEqual(activeStepTableColumns)
    expect(wrapper.vm.thisWeekDuration).toStrictEqual('2017/12/15~2017/12/21')
    expect(wrapper.vm.lastWeekDuration).toStrictEqual('2017/12/08~2017/12/14')
    expect(wrapper.vm.activeStepTableData).toStrictEqual([])

    const user = {
      user_name: 'zhangling168',
      user_id: 941754030
    }
    wrapper.vm.handleOpenDialog(user)
    await flushPromises()

    const activeStepTableData = [
      {
        duration: '2017/12/15~2017/12/21',
        avgLevel: '0.57',
        icon: { icon: 'fa-smile', color: 'cdp-text-forest__green__crayola' },
        iconStepName: '一般'
      },
      {
        duration: '2017/12/08~2017/12/14',
        avgLevel: '0.25',
        icon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        iconStepName: '即將流失'
      }
    ]
    expect(wrapper.vm.activeStepTableData).toStrictEqual(activeStepTableData)

    const series = [
      {
        name: '活躍度',
        lineWidth: 2,
        data: [
          0.231, 0.216, 0.192,
          0.192, 0.192, 0.237,
          0.483, 0.695, 0.783,
           0.72,  0.56, 0.487,
          0.446, 0.313
        ]
      }
    ]
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)

    const xAxis = [
      '2023/11/07', '2023/11/08',
      '2023/11/09', '2023/11/10',
      '2023/11/11', '2023/11/12',
      '2023/11/13', '2023/11/14',
      '2023/11/15', '2023/11/16',
      '2023/11/17', '2023/11/18',
      '2023/11/19', '2023/11/20'
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(xAxis)
  })
})
