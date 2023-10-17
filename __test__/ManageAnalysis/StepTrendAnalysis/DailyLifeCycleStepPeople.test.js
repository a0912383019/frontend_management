import { it, describe, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DailyLifeCycleStepPeople from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DailyLifeCycleStepPeople.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import DialogStepDetail from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DialogStepDetail.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import router from '@/router'

describe('DailyLifeCycleStepPeople.vue', () => {
  const wrapper = shallowMount(DailyLifeCycleStepPeople, {
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

  //模擬canvas
  HTMLCanvasElement.prototype.getContext = vi.fn()
  //讓console.error不要洗版
  vi.spyOn(console, 'error').mockImplementation(() => {})

  it('預期渲染的元件', async () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(DialogStepDetail).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)
  })

  it('觸發watch，mock api', async () => {
    //mock api 0000
    const result = {
      data: {
        result: [
          {
            1: 3464,
            2: 374,
            3: 3,
            4: 60,
            5: 103,
            6: 3344,
            7: 15303,
            data_date: '2023-04-28'
          },
          {
            1: 3808,
            2: 340,
            3: 13,
            4: 107,
            5: 354,
            6: 2963,
            7: 14225,
            data_date: '2023-04-29'
          },
          {
            1: 3832,
            2: 345,
            3: 9,
            4: 98,
            5: 359,
            6: 2947,
            7: 14238,
            data_date: '2023-04-30'
          }
        ],
        status: {
          message: 'success',
          return_code: '0000'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

    wrapper.vm.filterDateStepTrendTimestamp = 22122
    await flushPromises()

    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(true)

    const xLabels = ['2023/04/28', '2023/04/29', '2023/04/30']
    const datasets = [
      {
        label: '活躍期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(232,70,94,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(232,70,94,1)',
        backgroundColor: 'rgb(232,70,94,1)',
        pointBackgroundColor: 'rgb(232,70,94,1)',
        hoverBorderColor: 'rgb(232,70,94,1)',
        hoverBorderWidth: 7,
        data: [3464, 3808, 3832]
      },
      {
        label: '新客成長期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(19,91,134,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(19,91,134,1)',
        backgroundColor: 'rgb(19,91,134,1)',
        pointBackgroundColor: 'rgb(19,91,134,1)',
        hoverBorderColor: 'rgb(19,91,134,1)',
        hoverBorderWidth: 7,
        data: [374, 340, 345]
      },
      {
        label: '最有價值成長期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(249,180,12,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(249,180,12,1)',
        backgroundColor: 'rgb(249,180,12,1)',
        pointBackgroundColor: 'rgb(249,180,12,1)',
        hoverBorderColor: 'rgb(249,180,12,1)',
        hoverBorderWidth: 7,
        data: [3, 13, 9]
      },
      {
        label: '即將流失回頭期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(243,109,48,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(243,109,48,1)',
        backgroundColor: 'rgb(243,109,48,1)',
        pointBackgroundColor: 'rgb(243,109,48,1)',
        hoverBorderColor: 'rgb(243,109,48,1)',
        hoverBorderWidth: 7,
        data: [60, 107, 98]
      },
      {
        label: '流失挽回期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(146,41,67,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(146,41,67,1)',
        backgroundColor: 'rgb(146,41,67,1)',
        pointBackgroundColor: 'rgb(146,41,67,1)',
        hoverBorderColor: 'rgb(146,41,67,1)',
        hoverBorderWidth: 7,
        data: [103, 354, 359]
      },
      {
        label: '活躍衰退期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(62,150,169,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(62,150,169,1)',
        backgroundColor: 'rgb(62,150,169,1)',
        pointBackgroundColor: 'rgb(62,150,169,1)',
        hoverBorderColor: 'rgb(62,150,169,1)',
        hoverBorderWidth: 7,
        data: [3344, 2963, 2947]
      },
      {
        label: '流失期',
        fill: false,
        hidden: false,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgb(148,195,199,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgb(148,195,199,1)',
        backgroundColor: 'rgb(148,195,199,1)',
        pointBackgroundColor: 'rgb(148,195,199,1)',
        hoverBorderColor: 'rgb(148,195,199,1)',
        hoverBorderWidth: 7,
        data: [15303, 14225, 14238]
      }
    ]
    expect(wrapper.vm.chartSetting.data.xLabels).toStrictEqual(xLabels)
    expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(datasets)

    //mock api 0001
    const result1 = {
      data: {
        status: {
          message: 'no result to display',
          return_code: '0001'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result1)

    wrapper.vm.filterDateStepTrendTimestamp = 22123
    await flushPromises()

    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)
    expect(wrapper.vm.messageKey).toBe('noResult')

    //mock api 0001
    const result2 = {
      data: {
        status: {
          error_code: '210400005',
          errors: 'Validation failed.(json: cannot unmarshal object)',
          message: 'error bad request',
          return_code: '9999'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result2)

    wrapper.vm.filterDateStepTrendTimestamp = 22124
    await flushPromises()

    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)
    expect(wrapper.vm.messageKey).toBe('chartFailed')

    //mock error api 403
    const error403 = new Error('Forbidden')
    error403.response = {
      status: 403
    }
    vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error403)

    wrapper.vm.filterDateStepTrendTimestamp = 22125
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('noPermission')
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)

    //mock error api 401
    const error401 = new Error('error')
    error401.response = {
      status: 401
    }
    vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error401)

    wrapper.vm.filterDateStepTrendTimestamp = 22126
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)

    //mock error api other
    const errorOther = new Error('error')
    errorOther.response = {
      status: 999
    }
    vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(errorOther)

    wrapper.vm.filterDateStepTrendTimestamp = 22127
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('chartFailed')
    expect(wrapper.find('.cdp-dialog__chart').exists()).toBe(false)
  })
})
