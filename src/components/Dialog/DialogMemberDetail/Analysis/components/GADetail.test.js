import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import GADetail from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADetail.vue'
import router from '@/router'

describe('GADetail.vue', () => {
  let wrapper = null
  let result

  //只mock getHallCurrencySign，因爲無法初始化hall_code
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

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          page_views: 47,
          product_clicks: 0,
          promotion_clicks: 0,
          service_contact: 0,
          total_sessions: 2,
          total_bounces: 0,
          time_on_site: 289347,
          per_session_bet_amount: '13978057.5'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(GADetail, {
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
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    const tableData = [
      { name: '頁面瀏覽數', value: '47' },
      { name: '優惠點擊數', value: 0 },
      { name: '客服點擊數', value: 0 },
      { name: '停留時間', value: '3 天 8 小時 22 分 27 秒' },
      { name: '總跳出次數', value: 0 },
      { name: '工作階段總數', value: 2 },
      { name: '貨量 / 工作階段', value: '¥13,978,057.5' }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })
})
