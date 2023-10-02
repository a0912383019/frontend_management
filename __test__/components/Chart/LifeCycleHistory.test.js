import { it, describe, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-dayjs-3'

describe('LifeCycleHistory.vue', () => {
    let wrapper = null
    beforeEach(() => {
        const result = {
            data: {
                status: {
                    return_code: '0000',
                    message: 'success',
                },
                result: [
                    {
                        this_day_step: 1,
                        data_date: '2023-09-03'
                    }
                ]
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

        wrapper = shallowMount(LifeCycleHistory, {
            global: {
                plugins: [i18n, createTestingPinia(
                    {
                        createSpy: vi.fn
                    }
                )],
                components: {
                    CdpMessage
                }
            },
            props: {
                userName: 'jason',
                detailDate: '2020/12/12 ~ 2021/1/31'
            }
        })
    })

    it('ManageAnalysis', () => {
        //元件渲染是否正確
        expect(wrapper.vm.chartTitle).toBe('jason')
        const chartXLabels = [
            '2023-09-03',
            '2021-02-01'
        ]
        expect(wrapper.vm.chartSetting.data.xLabels).toStrictEqual(chartXLabels)
        const chartDatasets = [
            '2023-09-03',
            '2021-02-01'
        ]
        expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(chartDatasets)
        // expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(true)
        // expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(false)
    })

    // it('dict', () => {
    //     //字典檔是否正確
    //     const tabData = [
    //         { name: 'LifeCycleAnalysis', label: '會員生命週期分析' },
    //         { name: 'StepTrendAnalysis', label: '趨勢分析' }
    //     ]
    //     expect(wrapper.vm.tabData).toStrictEqual(tabData)
    // })

    // it('change tab', async () => {
    //     //切換tab，currentTabs是否有改變
    //     const tabs = wrapper.findAll('.tabs-manage-analysis.tabs li')
    //     await tabs[1].trigger('click')
    //     expect(wrapper.vm.currentTabs).toStrictEqual('StepTrendAnalysis')
    //     expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(false)
    //     expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(true)
    // })
})