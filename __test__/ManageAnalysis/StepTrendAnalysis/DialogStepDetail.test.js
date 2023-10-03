import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DialogStepDetail from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DialogStepDetail.vue'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from '@/router'

describe('DialogStepDetail.vue', () => {
    let wrapper = null
    let param
    beforeEach(() => {
        wrapper = mount(DialogStepDetail, {
            global: {
                plugins: [i18n, ElementPlus, router, createTestingPinia(
                    {
                        createSpy: vi.fn,
                    }
                )],
                components: {
                    FontAwesomeIcon
                }
            },
        })
        //activeHall給值
        wrapper.vm.activeHall.hall_name = 'esballbbos'
        wrapper.vm.activeHall.hall_code = 'esb'


        param = {
            date: '2000/09/03',
            step: 7
        }
    })
    afterEach(() => {
        wrapper.unmount()
    })

    //讓console.error不要洗版
    vi.spyOn(console, 'error').mockImplementation(() => { })

    it('預期表頭資料', () => {
        const tableColumnsValue = wrapper.vm.tableColumns
        expect(tableColumnsValue).toStrictEqual(
            [
                {
                    label: '貨量',
                    prop: 'bet_amount',
                    headerAlign: 'center',
                    align: 'center',
                    minWidth: '25%'
                },
                {
                    label: '貨量佔比',
                    prop: 'bet_amount_percent',
                    headerAlign: 'center',
                    align: 'center',
                    minWidth: '25%'
                },
                {
                    label: '損益',
                    prop: 'payoff',
                    headerAlign: 'center',
                    align: 'center',
                    minWidth: '25%'
                },
                {
                    label: '獲利率',
                    prop: 'gross_percent',
                    headerAlign: 'center',
                    align: 'center',
                    minWidth: '25%'
                }
            ])
    })

    it('開啟dialog', async () => {
        //mock api 0000
        const result = {
            data: {
                status: {
                    return_code: '0000',
                    message: 'success',
                },
                result: [
                    {
                        'bet_amount': '932946.45',
                        'payoff': '9371.4',
                        'gross_percent': '1',
                        'bet_amount_percent': '2.49'
                    }
                ]
            }
        }
        vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

        //預期一開始tableData為空陣列
        expect(wrapper.vm.tableData).toStrictEqual([])

        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        await flushPromises()
        //資料轉換是否如預期
        expect(wrapper.vm.tableData).toStrictEqual(
            [
                {
                    'bet_amount': '¥932,947',
                    'bet_amount_percent': '3 %',
                    'payoff': '<span class=\"text-danger\">¥-9,371</span>',
                    'gross_percent': '<span class=\"text-danger\">-1%</span>'
                }
            ])
        expect(wrapper.vm.dialogVisible).toBe(true)
        expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
        expect(wrapper.vm.currentTooltipEntity).toStrictEqual(param)
        expect(wrapper.vm.apiSuccess).toBe(true)
    })

    it('開啟dialog，no result', async () => {
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
        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        await flushPromises()
        expect(wrapper.vm.apiSuccess).toBe(false)
        expect(wrapper.vm.messageKey).toBe('noResult')
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    })

    it('開啟dialog，9999', async () => {
        //mock api 9999
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
        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        await flushPromises()
        expect(wrapper.vm.apiSuccess).toBe(false)
        expect(wrapper.vm.messageKey).toBe('chartFailed')
    })

    it('開啟dialog，error 403', async () => {
        //mock error api 403
        const error403 = new Error('Forbidden')
        error403.response = {
            status: 403,
        }
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error403)
        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        //等待異步完成
        await flushPromises()
        //預期轉換後的資料
        expect(wrapper.vm.apiSuccess).toBe(false)
        expect(wrapper.vm.messageKey).toBe('noPermission')
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    })

    it('開啟dialog，error 401', async () => {
        //mock error api 401
        const error401 = new Error('error')
        error401.response = {
            status: 401,
        }
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error401)
        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        //等待異步完成
        await flushPromises()
        //預期轉換後的資料
        expect(wrapper.vm.apiSuccess).toBe(false)
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    })

    it('開啟dialog，error other', async () => {
        //mock error api other
        const errorOther = new Error('error')
        errorOther.response = {
            status: 999,
        }
        vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(errorOther)
        //觸發handleOpenDialog
        wrapper.vm.handleOpenDialog(param)
        //等待異步完成
        await flushPromises()
        //預期轉換後的資料
        expect(wrapper.vm.apiSuccess).toBe(false)
        expect(wrapper.vm.messageKey).toBe('chartFailed')
        expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    })
})