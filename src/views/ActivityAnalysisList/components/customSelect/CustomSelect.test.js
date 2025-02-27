import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import CustomSelect from '@/views/ActivityAnalysisList/components/customSelect/CustomSelect.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import { apiQueryPromotionList } from '@/api'
import { createRouterMock } from 'vue-router-mock'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

vi.mock('@/api', () => ({
  apiQueryPromotionList: vi.fn()
}))

describe('CustomSelect', () => {
  let wrapper = null

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    apiQueryPromotionList.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: [
          {
            promotion_id: 7474,
            original_id: 7474,
            offer_id: 41,
            promotion_name: 'gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07',
            start_time: '2025-02-07T00:00:00-04:00',
            end_time: '2025-02-14T23:59:59-04:00'
          },
          {
            promotion_id: 7475,
            original_id: 7475,
            offer_id: 42,
            promotion_name: 'gusTest(每日紅包-修改暫存機制)_抽紅包優惠_每日紅包_2025-02-07',
            start_time: '2025-02-07T00:00:00-04:00',
            end_time: '2025-02-14T23:59:59-04:00'
          },
          {
            promotion_id: 7476,
            original_id: 7476,
            offer_id: 43,
            promotion_name: 'gusTest(營運紅包-修改暫存機制)_抽紅包優惠_營運紅包_2025-02-07',
            start_time: '2025-02-07T00:00:00-04:00',
            end_time: '2025-02-14T23:59:59-04:00'
          }
        ]
      }
    })

    wrapper = shallowMount(CustomSelect, {
      global: {
        plugins: [i18n, ElementPlus, router, createTestingPinia({ createSpy: vi.fn })],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        promotionData: {
          disabled: true,
          activity_date: '2024/01/01 ~ ⎻⎻⎻⎻/⎻⎻/⎻⎻',
          offer_id: 41,
          original_id: 7474
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(false)
    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(true)
  })

  it('api correctly', async () => {
    await flushPromises()
    expect(apiQueryPromotionList).toBeCalledTimes(1)
    expect(wrapper.vm.promotionList).toStrictEqual(
      '{"promotion_id":7474,"original_id":7474,"offer_id":41,"promotion_name":"gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
    )
    expect(wrapper.vm.promotionOptions).toStrictEqual([
      {
        label: 'gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07',
        value:
          '{"promotion_id":7474,"original_id":7474,"offer_id":41,"promotion_name":"gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
      },
      {
        label: 'gusTest(每日紅包-修改暫存機制)_抽紅包優惠_每日紅包_2025-02-07',
        value:
          '{"promotion_id":7475,"original_id":7475,"offer_id":42,"promotion_name":"gusTest(每日紅包-修改暫存機制)_抽紅包優惠_每日紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
      },
      {
        label: 'gusTest(營運紅包-修改暫存機制)_抽紅包優惠_營運紅包_2025-02-07',
        value:
          '{"promotion_id":7476,"original_id":7476,"offer_id":43,"promotion_name":"gusTest(營運紅包-修改暫存機制)_抽紅包優惠_營運紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
      }
    ])
  })

  it('getPromotionList', async () => {
    await flushPromises()
    expect(apiQueryPromotionList).toBeCalledTimes(1)

    wrapper.vm.showDatePicker = true
    expect(wrapper.vm.promotionReturnMsg).toStrictEqual('重新選擇活動開始日期')
    expect(wrapper.vm.showDatePicker).toBeTruthy()

    wrapper.vm.getPromotionList(['2024-01-01', '2024-01-31'])
    expect(wrapper.vm.promotionReturnMsg).toStrictEqual(
      '重新選擇活動開始日期 --- 2024/01/01 ~ 2024/01/31 ---'
    )
    expect(wrapper.vm.showDatePicker).toBeFalsy()
    expect(wrapper.vm.promotionOptions).toStrictEqual([])
    expect(apiQueryPromotionList).toBeCalledTimes(2)
  })

  it('handleReturn', async () => {
    await flushPromises()
    wrapper.vm.showDatePicker = true
    await wrapper.vm.$nextTick()
    let handleOpen = vi.fn()
    wrapper.vm.$refs.selectDateRef.handleOpen = handleOpen

    expect(wrapper.vm.promotionReturnMsg).toStrictEqual('重新選擇活動開始日期')
    expect(wrapper.vm.promotionList).toStrictEqual(
      '{"promotion_id":7474,"original_id":7474,"offer_id":41,"promotion_name":"gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
    )
    expect(wrapper.vm.duration).toStrictEqual('')
    expect(handleOpen).toBeCalledTimes(0)

    await wrapper.vm.handleReturn()
    expect(wrapper.vm.promotionReturnMsg).toStrictEqual('請選擇優惠活動')
    expect(wrapper.vm.promotionList).toStrictEqual('')
    expect(wrapper.vm.duration).toStrictEqual('')
    expect(wrapper.vm.showDatePicker).toBeTruthy()
    expect(wrapper.emitted('update:activityDate')).toBeTruthy()
    await wrapper.vm.$nextTick()
    expect(handleOpen).toBeCalledTimes(1)
  })

  it('handleChange', async () => {
    await flushPromises()
    wrapper.vm.handleChange()
    expect(wrapper.emitted('update:promotion')).toStrictEqual([
      [
        '{"promotion_id":7474,"original_id":7474,"offer_id":41,"promotion_name":"gusTest(限時紅包-修改暫存機制)_抽紅包優惠_限時紅包_2025-02-07","start_time":"2025-02-07T00:00:00-04:00","end_time":"2025-02-14T23:59:59-04:00"}'
      ]
    ])
  })
})
