import { it, describe, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
// import Chart from 'chart.js/auto'
// import 'chartjs-adapter-dayjs-3'

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
                        data_date: '2023-09-04'
                    },
                    {
                        this_day_step: 6,
                        data_date: '2023-09-19'
                    },
                    {
                        this_day_step: 1,
                        data_date: '2023-10-01'
                    }
                ]
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

        wrapper = shallowMount(LifeCycleHistory, {
            global: {
                plugins: [i18n, router, createTestingPinia(
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
                detailDate: '2023-09-04 ~ 2023-10-01'
            }
        })
    })

    it('ManageAnalysis', () => {
        //元件渲染是否正確
        expect(wrapper.vm.chartTitle).toBe('jason')
        const chartXLabels = [
            '2023-09-04',
            '2023-09-19',
            '2023-10-01',
            '2023-10-02'
        ]
        const chartDatasetsData = [
            [[
                new Date('2023-09-04'),
                new Date('2023-09-19')
            ]],
            [[
                new Date('2023-09-19'),
                new Date('2023-10-01')
            ]],
            [[
                new Date('2023-10-01'),
                '2023-10-02'
            ]]
        ]
        expect(wrapper.vm.chartSetting.data.xLabels).toStrictEqual(chartXLabels)
        expect(wrapper.vm.chartSetting.data.datasets[0].data).toStrictEqual(chartDatasetsData[0])
        expect(wrapper.vm.chartSetting.data.datasets[1].data).toStrictEqual(chartDatasetsData[1])
        expect(wrapper.vm.chartSetting.data.datasets[2].data).toStrictEqual(chartDatasetsData[2])
    })
})