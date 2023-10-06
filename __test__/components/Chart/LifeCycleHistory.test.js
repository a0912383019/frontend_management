import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('LifeCycleHistory.vue', () => {
    let wrapper = null

    afterEach(() => {
        wrapper.unmount()
    })

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
        //模擬canvas
        HTMLCanvasElement.prototype.getContext = vi.fn()
        vi.spyOn(console, 'error').mockImplementation(() => { })
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
            {
                backgroundColor: 'rgb(232,70,94,0.7)',
                borderColor: 'rgb(232,70,94,1)',
                borderWidth: 1,
                data: [
                    [
                        '2023-09-04',
                        '2023-09-19',
                    ],
                ],
                hoverBorderWidth: 3,
                label: '活躍期',
            },
            {
                backgroundColor: 'rgb(62,150,169,0.7)',
                borderColor: 'rgb(62,150,169,1)',
                borderWidth: 1,
                data: [
                    [
                        '2023-09-19',
                        '2023-10-01',
                    ],
                ],
                hoverBorderWidth: 3,
                label: '活躍衰退期',
            },
            {
                backgroundColor: 'rgb(232,70,94,0.7)',
                borderColor: 'rgb(232,70,94,1)',
                borderWidth: 1,
                data: [
                    [
                        '2023-10-01',
                        '2023-10-02',
                    ],
                ],
                hoverBorderWidth: 3,
                label: '活躍期',
            }
        ]
        expect(wrapper.vm.chartSetting.data.xLabels).toStrictEqual(chartXLabels)
        expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(chartDatasetsData)
    })
})