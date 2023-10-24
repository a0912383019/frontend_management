import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, shallowMount } from '@vue/test-utils'
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

  beforeEach(() => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            page_views: 47,
            product_clicks: 0,
            promotion_clicks: 0,
            service_contact: 0,
            total_sessions: 2,
            total_bounces: 0,
            time_on_site: 2742,
            per_session_bet_amount: '13978057.5'
          }
        ]
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
  })

  //   afterEach(() => {
  //     wrapper.unmount()
  //   })

  //讓console.error不要洗版
  vi.spyOn(console, 'error').mockImplementation(() => {})

  // 預期表頭資料
  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
  })

  // 開啟dialog
  //   it('Open dialog', async () => {
  //     //mock api 0000
  //     const result = {
  //       data: {
  //         status: {
  //           return_code: '0000',
  //           message: 'success'
  //         },
  //         result: [
  //           {
  //             bet_amount: '932946.45',
  //             payoff: '9371.4',
  //             gross_percent: '1',
  //             bet_amount_percent: '2.49'
  //           }
  //         ]
  //       }
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

  //     //預期一開始tableData為空陣列
  //     expect(wrapper.vm.tableData).toStrictEqual([])

  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     await flushPromises()
  //     //資料轉換是否如預期
  //     expect(wrapper.vm.tableData).toStrictEqual([
  //       {
  //         bet_amount: '¥932,947',
  //         bet_amount_percent: '3 %',
  //         payoff: '<span class="text-danger">¥-9,371</span>',
  //         gross_percent: '<span class="text-danger">-1%</span>'
  //       }
  //     ])
  //     expect(wrapper.vm.dialogVisible).toBe(true)
  //     expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
  //     expect(wrapper.vm.currentTooltipEntity).toStrictEqual(param)
  //     expect(wrapper.vm.apiSuccess).toBe(true)
  //   })

  //   // 開啟dialog，no result
  //   it('Open dialog, no result', async () => {
  //     //mock api 0001
  //     const result1 = {
  //       data: {
  //         status: {
  //           message: 'no result to display',
  //           return_code: '0001'
  //         }
  //       }
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result1)
  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     await flushPromises()
  //     expect(wrapper.vm.apiSuccess).toBe(false)
  //     expect(wrapper.vm.messageKey).toBe('noResult')
  //     expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  //   })

  //   // 開啟dialog，9999
  //   it('Open dialog, 9999', async () => {
  //     //mock api 9999
  //     const result2 = {
  //       data: {
  //         status: {
  //           error_code: '210400005',
  //           errors: 'Validation failed.(json: cannot unmarshal object)',
  //           message: 'error bad request',
  //           return_code: '9999'
  //         }
  //       }
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result2)
  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     await flushPromises()
  //     expect(wrapper.vm.apiSuccess).toBe(false)
  //     expect(wrapper.vm.messageKey).toBe('chartFailed')
  //   })

  //   // 開啟dialog，error 403
  //   it('Open dialog, error 403', async () => {
  //     //mock error api 403
  //     const error403 = new Error('Forbidden')
  //     error403.response = {
  //       status: 403
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error403)
  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     //等待異步完成
  //     await flushPromises()
  //     //預期轉換後的資料
  //     expect(wrapper.vm.apiSuccess).toBe(false)
  //     expect(wrapper.vm.messageKey).toBe('noPermission')
  //     expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  //   })

  //   // 開啟dialog，error 401
  //   it('Open dialog, error 401', async () => {
  //     //mock error api 401
  //     const error401 = new Error('error')
  //     error401.response = {
  //       status: 401
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error401)
  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     //等待異步完成
  //     await flushPromises()
  //     //預期轉換後的資料
  //     expect(wrapper.vm.apiSuccess).toBe(false)
  //     expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  //   })

  //   // 開啟dialog，error other
  //   it('Open dialog, error other', async () => {
  //     //mock error api other
  //     const errorOther = new Error('error')
  //     errorOther.response = {
  //       status: 999
  //     }
  //     vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(errorOther)
  //     //觸發handleOpenDialog
  //     wrapper.vm.handleOpenDialog(param)
  //     //等待異步完成
  //     await flushPromises()
  //     //預期轉換後的資料
  //     expect(wrapper.vm.apiSuccess).toBe(false)
  //     expect(wrapper.vm.messageKey).toBe('chartFailed')
  //     expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  //   })
})
