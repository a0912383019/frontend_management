import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import TopCard from '@/views/Home/components/TopCard.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { useGlobalStore } from '@/stores/global.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dayjs } from 'element-plus'

describe('TopCard.vue', () => {
  let wrapper = null
  vi.mock('@/stores/global.js', () => ({
    useGlobalStore: vi.fn()
  }))
  vi.mock('@/stores/dateConfig.js', () => ({
    useDateStore: vi.fn()
  }))
  const mockLastDate = {
    LAST_DATE: dayjs(1513823919228)
  }
  useDateStore.mockReturnValue(mockLastDate)

  //mock getHallCurrencySign
  vi.mock('@/utils/commonUtils.js', async () => {
    const actual = await vi.importActual('@/utils/commonUtils.js')
    const getHallCurrencySign = vi.fn()
    getHallCurrencySign.mockReturnValue('¥')

    return {
      ...actual, //包括原始模組中的其他方法
      getHallCurrencySign //覆蓋 getHallCurrencySign 函數
    }
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    const mockActiveHall = {
      activeHall: {
        hall_name: '',
        hall_code: ''
      }
    }
    useGlobalStore.mockReturnValue(mockActiveHall)
    wrapper = shallowMount(TopCard, {
      global: {
        plugins: [i18n],
        components: {
          FontAwesomeIcon
        },
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
    //預期轉換後的資料
    const topCardData = [
      {
        icon: 'fas fa-money-bill-wave',
        colorClass: 'cdp-bg-maximum__blue',
        monthAvg: '-',
        weekAvg: '-',
        growth: '-'
      },
      {
        icon: 'fas fa-chart-area',
        colorClass: 'cdp-bg-forest__green__crayola',
        monthAvg: '-',
        weekAvg: '-',
        growth: '-'
      },
      {
        icon: 'fas fa-gift',
        colorClass: 'cdp-bg-indian__yellow',
        monthAvg: '-',
        weekAvg: '-',
        growth: '-'
      },
      {
        icon: 'fas fa-users',
        colorClass: 'cdp-bg-candy__pink',
        monthAvg: '-',
        weekAvg: '-',
        growth: '-'
      }
    ]
    expect(wrapper.vm.topCardData).toStrictEqual(topCardData)
    expect(wrapper.vm.weekDuration).toStrictEqual('2017/12/15~2017/12/21')
    expect(wrapper.vm.monthDuration).toStrictEqual('2017/11/22~2017/12/21')
  })

  it('Is triggering watch and mock api as expected?', async () => {
    const result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          active_people: {
            growth: '9.3852',
            month_avg: '1889.5000',
            week_avg: '2066.8333'
          },
          bet_amount: {
            growth: '-6.9025',
            month_avg: '50419817.4244',
            week_avg: '46939568.1285'
          },
          payoff: {
            growth: '-400.0000',
            month_avg: '-1097599.2820',
            week_avg: '-5487996.4098'
          },
          premium_amount: {
            growth: '-2.0397',
            month_avg: '595521.7994',
            week_avg: '583374.7288'
          }
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    const mockActiveHall = {
      activeHall: {
        hall_name: 'esb',
        hall_code: 'esb'
      }
    }
    useGlobalStore.mockReturnValue(mockActiveHall)
    wrapper = shallowMount(TopCard, {
      global: {
        plugins: [i18n],
        components: {
          FontAwesomeIcon
        },
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
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    const topCardData = [
      {
        icon: 'fas fa-money-bill-wave',
        colorClass: 'cdp-bg-maximum__blue',
        monthAvg: '¥50,419,817.42',
        weekAvg: '¥46,939,568.13',
        growth: '-6.9'
      },
      {
        icon: 'fas fa-chart-area',
        colorClass: 'cdp-bg-forest__green__crayola',
        monthAvg: '<span class="text-danger font-black">¥-1,097,599.28</span>',
        weekAvg: '<span class="text-danger font-black">¥-5,487,996.41</span>',
        growth: '-400'
      },
      {
        icon: 'fas fa-gift',
        colorClass: 'cdp-bg-indian__yellow',
        monthAvg: '¥595,521.8',
        weekAvg: '¥583,374.73',
        growth: '-2.04'
      },
      {
        icon: 'fas fa-users',
        colorClass: 'cdp-bg-candy__pink',
        monthAvg: '1,889.5',
        weekAvg: '2,066.83',
        growth: '9.39'
      }
    ]
    expect(wrapper.vm.topCardData).toStrictEqual(topCardData)
  })
})
