import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import GALoginCount from '@/components/Dialog/DialogMemberDetail/Analysis/components/GALoginCount.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('GALoginCount.vue', () => {
  let wrapper = null
  let result

    afterEach(() => {
      wrapper.unmount()
    })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            data_date: '2023-07-26',
            login_count: '1',
            ga_count: '0'
          },
          {
            data_date: '2023-08-04',
            login_count: '1',
            ga_count: '0'
          },
          {
            data_date: '2023-08-07',
            login_count: '1',
            ga_count: '0'
          },
          {
            data_date: '2023-08-09',
            login_count: '1',
            ga_count: '0'
          },
          {
            data_date: '2023-08-11',
            login_count: '2',
            ga_count: '0'
          },
          {
            data_date: '2023-08-14',
            login_count: '1',
            ga_count: '0'
          },
          {
            data_date: '2023-08-15',
            login_count: '3',
            ga_count: '0'
          },
          {
            data_date: '2023-08-19',
            login_count: '4',
            ga_count: '554'
          }
        ]
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(GALoginCount, {
      global: {
        plugins: [
          HighchartsVue,
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    
    const categories = [
      '2023/07/26',
      '2023/08/04',
      '2023/08/07',
      '2023/08/09',
      '2023/08/11',
      '2023/08/14',
      '2023/08/15',
      '2023/08/19'
    ]
    const series = [
      {
        name: '登入次數',
        type: 'line',
        data: [
          1, 1, 1, 1,
          2, 1, 3, 4
        ],
        color: 'rgba(245,105,84,1)',
        lineWidth: 2,
        yAxis: 0
      },
      {
        name: 'GA瀏覽次數',
        type: 'line',
        data: [
          0, 0, 0, 0,
          0, 0, 0, 554
        ],
        color: 'rgba(60,141,188,1)',
        lineWidth: 2,
        yAxis: 1
      }
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
  })
})
