import { it, describe, expect, vi } from 'vitest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { i18n } from '@/global/i18n';
import LifeCycleStepProfitOverview from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/LifeCycleStepProfitOverview.vue'
import { createTestingPinia } from '@pinia/testing'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import FilterDate from '@/components/Filter/FilterDate.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import StepConfig from '@/components/StepConfig.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('LifeCycleStepProfitOverview.vue', () => {
    const wrapper = shallowMount(LifeCycleStepProfitOverview, {
        global: {
            plugins: [i18n, createTestingPinia(
                {
                    createSpy: vi.fn
                }
            )]
        },
    });

    it('預設apiSuccess = false，預期渲染的元件', async () => {
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false);
        expect(wrapper.findComponent(CdpMessage).exists()).toBe(true);
        expect(wrapper.findComponent(FilterDate).exists()).toBe(true);
        expect(wrapper.findComponent(SectionTitle).exists()).toBe(true);
        expect(wrapper.findComponent(CurrencySignText).exists()).toBe(true);
        expect(wrapper.findComponent(StepConfig).exists()).toBe(false);
    });

    it('語系轉換', () => {
        //更換語系
        wrapper.vm.i18nLocale = 'en'
        const tableColumnsValue = wrapper.vm.tableColumns
        //computed有無如預期改變
        expect(tableColumnsValue).toStrictEqual(
            [
                { "label": "Phase", "prop": "step_name", "headerAlign": "center", "align": "left", "minWidth": "20%" },
                { "label": "Bet Amount", "prop": "bet_amount", "headerAlign": "center", "align": "right", "minWidth": "16%" },
                { "label": "% Total", "prop": "bet_amount_percent", "headerAlign": "center", "align": "center", "minWidth": "16%" },
                { "label": "House P&L", "prop": "payoff", "headerAlign": "center", "align": "right", "minWidth": "16%" },
                { "label": "Profit Margin", "prop": "gross_percent", "headerAlign": "center", "align": "center", "minWidth": "16%" }
            ])
    })

    it('觸發watch 與 mock api 是否如預期', async () => {
        //mock api 0000
        const result0 = {
            data: {
                status: {
                    return_code: '0000',
                    message: 'success',
                },
                result: [
                    {
                        "step": 1,
                        "bet_amount": "1276758348.4494",
                        "payoff": "-33092910.9473",
                        "gross_percent": "-2.59",
                        "bet_amount_percent": "97.95"
                    },
                    {
                        "step": 2,
                        "bet_amount": "8438998.0212",
                        "payoff": "148480.6627",
                        "gross_percent": "1.76",
                        "bet_amount_percent": "0.65"
                    },
                    {
                        "step": 3,
                        "bet_amount": "4155873.2999",
                        "payoff": "-72226.6685",
                        "gross_percent": "-1.74",
                        "bet_amount_percent": "0.32"
                    },
                    {
                        "step": 4,
                        "bet_amount": "9408279.7431",
                        "payoff": "-174855.7035",
                        "gross_percent": "-1.86",
                        "bet_amount_percent": "0.72"
                    },
                    {
                        "step": 5,
                        "bet_amount": "4666938.6318",
                        "payoff": "-71863.3473",
                        "gross_percent": "-1.54",
                        "bet_amount_percent": "0.36"
                    },
                    {
                        "step": 6,
                        "bet_amount": "0.0000",
                        "payoff": "0.0000",
                        "gross_percent": "NaN",
                        "bet_amount_percent": "0.00"
                    },
                    {
                        "step": 7,
                        "bet_amount": "0.0000",
                        "payoff": "0.0000",
                        "gross_percent": "NaN",
                        "bet_amount_percent": "0.00"
                    }
                ]
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result0)
        //觸發updateTimestamp
        wrapper.vm.updateTimestamp({
            timestamp: 29930,
            rangeDate: '2000-01-01'
        })
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual(
            [
                { "step_index": 1, "bet_amount": "1,276,758,348", "bet_amount_percent": "98%", "payoff": "33,092,911", "gross_percent": "3%" },
                { "step_index": 2, "bet_amount": "8,438,998", "bet_amount_percent": "1%", "payoff": "<span class=\"cdp-text-candypink\">-148,481</span>", "gross_percent": "<span class=\"cdp-text-candypink\">-2%</span>" },
                { "step_index": 3, "bet_amount": "4,155,873", "bet_amount_percent": "0%", "payoff": "72,227", "gross_percent": "2%" },
                { "step_index": 4, "bet_amount": "9,408,280", "bet_amount_percent": "1%", "payoff": "174,856", "gross_percent": "2%" },
                { "step_index": 5, "bet_amount": "4,666,939", "bet_amount_percent": "0%", "payoff": "71,863", "gross_percent": "2%" },
                { "step_index": 6, "bet_amount": "0.00", "bet_amount_percent": "0%", "payoff": "0", "gross_percent": "NaN%" },
                { "step_index": 7, "bet_amount": "0.00", "bet_amount_percent": "0%", "payoff": "0", "gross_percent": "NaN%" }
            ])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(true)

        //mock api 0001
        const result1 = {
            data: {
                status: {
                    return_code: '0001',
                    message: 'success',
                },
                result: []
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result1)
        //觸發watch的fn
        wrapper.vm.filterDateStepTrendTimestamp = 2323446
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
        expect(wrapper.vm.messageKey).toBe('noResult')

        //mock api other
        const result2 = {
            data: {
                status: {
                    return_code: '9999',
                    message: 'fail',
                },
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result2)
        //觸發watch的fn
        wrapper.vm.filterDateStepTrendTimestamp = 2323447
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
        expect(wrapper.vm.messageKey).toBe('chartFailed')

        //mock error api 403
        const error403 = new Error('Forbidden');
        error403.response = {
            status: 403,
        };
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error403);
        //觸發watch的fn
        wrapper.vm.filterDateStepTrendTimestamp = 2323448
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
        expect(wrapper.vm.messageKey).toBe('noPermission')

        //mock error api 401
        const error401 = new Error('error');
        error401.response = {
            status: 401,
        };
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error401);
        //觸發watch的fn
        wrapper.vm.filterDateStepTrendTimestamp = 2323449
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)

        //mock error api other
        const errorOther = new Error('error');
        errorOther.response = {
            status: 999,
        };
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(errorOther);
        //觸發watch的fn
        wrapper.vm.filterDateStepTrendTimestamp = 2323450
        //等待異步完成
        await flushPromises();
        //預期轉換後的資料
        expect(wrapper.vm.tableData).toStrictEqual([])
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
        expect(wrapper.vm.messageKey).toBe('chartFailed')
    })
})