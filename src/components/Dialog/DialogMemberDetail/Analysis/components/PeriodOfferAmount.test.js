import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import PeriodOfferAmount from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodOfferAmount.vue'
import router from '@/router'
import 'vitest-canvas-mock'

describe('PeriodOfferAmount.vue', () => {
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
        result: {
          1053: {
            opcode_name: '活動優惠',
            total_premium_amount: '50794'
          },
          1240: {
            opcode_name: '一般彩票返點',
            total_premium_amount: '277993.63'
          },
          1982: {
            opcode_name: '存款/取款/打碼/損益',
            total_premium_amount: '11494'
          },
          2651: {
            opcode_name: ' TP六合彩返點',
            total_premium_amount: '6412.92'
          },
          2843: {
            opcode_name: 'BB體育返點',
            total_premium_amount: '5316.88'
          }
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(PeriodOfferAmount, {
      global: {
        plugins: [
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
    expect(wrapper.find('canvas').exists()).toBe(false)
    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.find('canvas').exists()).toBe(true)

    const chartSettingData = {
      labels: ['活動優惠', '一般彩票返點', '存款/取款/打碼/損益', ' TP六合彩返點', 'BB體育返點'],
      datasets: [
        {
          data: [50794, 277993.63, 11494, 6412.92, 5316.88],
          backgroundColor: [
            'rgb(245,105,84,0.7)',
            'rgb(0,166,90,0.7)',
            'rgb(243,156,18,0.7)',
            'rgb(0,192,239,0.7)',
            'rgb(232,208,152,0.7)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 3,
          borderColor: [
            'rgb(245,105,84,1)',
            'rgb(0,166,90,1)',
            'rgb(243,156,18,1)',
            'rgb(0,192,239,1)',
            'rgb(232,208,152,1)'
          ]
        }
      ]
    }
    expect(wrapper.vm.chartSetting.data).toStrictEqual(chartSettingData)
  })
})
