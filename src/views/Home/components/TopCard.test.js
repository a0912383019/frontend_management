import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
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

  beforeEach(() => {
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
    const mockGlobalValue = {
      activeHall: {
        hall_name: '',
        hall_code: ''
      },
      currency_sign: '¥'
    }
    useGlobalStore.mockReturnValue(mockGlobalValue)

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
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Is mock api as expected', async () => {
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    const topCardData = [
      {
        icon: 'fas fa-money-bill-wave',
        colorClass: 'cdp-bg-maximum__blue',
        monthAvg: '¥50,419,817',
        weekAvg: '¥46,939,568',
        growth: '-7'
      },
      {
        icon: 'fas fa-chart-area',
        colorClass: 'cdp-bg-forest__green__crayola',
        monthAvg: '<span class="text-danger font-black">¥-1,097,599</span>',
        weekAvg: '<span class="text-danger font-black">¥-5,487,996</span>',
        growth: '-400'
      },
      {
        icon: 'fas fa-gift',
        colorClass: 'cdp-bg-indian__yellow',
        monthAvg: '¥595,522',
        weekAvg: '¥583,375',
        growth: '-2'
      },
      {
        icon: 'fas fa-users',
        colorClass: 'cdp-bg-candy__pink',
        monthAvg: '1,890',
        weekAvg: '2,067',
        growth: '9'
      }
    ]
    expect(wrapper.vm.topCardData).toStrictEqual(topCardData)
  })
})
