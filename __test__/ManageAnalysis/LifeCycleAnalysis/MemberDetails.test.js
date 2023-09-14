import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberDetails from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/MemberDetails.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DialogMemberHistory from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberHistory.vue'
import DialogMemberDetail from '@/components/Dialog/DialogMemberDetail/DialogMemberDetail.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import ElementPlus from 'element-plus'
import router from '@/router'

describe('會員明細', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(MemberDetails, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})

  it('預設apiSuccess = false，預期渲染的元件', async () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CurrencySignText).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(DialogMemberHistory).exists()).toBe(true)
    expect(wrapper.findComponent(DialogMemberDetail).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
  })

  it('測試自定義排序，是否符合預期', async () => {
    // 測試排序
    let dataValue = {
      prop: 'deposit_amount',
      order: 'ascending'
    }
    wrapper.vm.upadteCurrentSort(dataValue)
    let order = dataValue['order'] == 'descending' ? 'DESC' : 'ASC'
    expect(wrapper.vm.querySortRule.sort).toBe('deposit_amount')
    expect(wrapper.vm.querySortRule.order).toBe(order)

    // mock 排序後打api
    wrapper.vm.custom_user_list = []
    wrapper.vm.detail_type = 0
    wrapper.vm.fuzzy_search = false
    wrapper.vm.hall_name = 'esb'
    wrapper.vm.length = 15
    wrapper.vm.life_cycle_analysis_detail_date = '2023-08-15 ~ 2023-09-12'
    wrapper.vm.life_cycle_analysis_step = 1
    wrapper.vm.order = 'DESC'
    wrapper.vm.query_date = '2023-09-12'
    wrapper.vm.search_name = ''
    wrapper.vm.sort = 'deposit_amount'
    wrapper.vm.start = 0
    wrapper.vm.platform = 'bbin'

    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 108,
          records_filtered: 108,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941721245,
              user_name: 'wuxu850223',
              activity_day: 26,
              bet_amount: '1218198',
              payoff: '-32299.69',
              deposit_amount: '245748',
              bet_amount_avg: '46853.76',
              payoff_avg: '-1242.3',
              deposit_amount_avg: '9451.85'
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //等待異步完成
    await flushPromises()
  })

  it('測試頁碼切換', async () => {
    let currentPage = 2
    wrapper.vm.updateCurrentPage(currentPage)
    let apiStart = wrapper.vm.apiDraw * wrapper.vm.apiLength - wrapper.vm.apiLength
    expect(wrapper.vm.apiStart).toBe(apiStart)

    // mock 切換頁後打api
    wrapper.vm.custom_user_list = []
    wrapper.vm.detail_type = 0
    wrapper.vm.fuzzy_search = false
    wrapper.vm.hall_name = 'esb'
    wrapper.vm.length = 15
    wrapper.vm.life_cycle_analysis_detail_date = '2023-08-15 ~ 2023-09-12'
    wrapper.vm.life_cycle_analysis_step = 1
    wrapper.vm.order = 'DESC'
    wrapper.vm.query_date = '2023-09-12'
    wrapper.vm.search_name = ''
    wrapper.vm.sort = 'deposit_amount'
    wrapper.vm.start = apiStart
    wrapper.vm.platform = 'bbin'

    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 108,
          records_filtered: 108,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941721245,
              user_name: 'wuxu850223',
              activity_day: 26,
              bet_amount: '1218198',
              payoff: '-32299.69',
              deposit_amount: '245748',
              bet_amount_avg: '46853.76',
              payoff_avg: '-1242.3',
              deposit_amount_avg: '9451.85'
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //等待異步完成
    await flushPromises()
  })

  it('表格頁碼切換到第一頁', () => {
    wrapper.vm.tableGoToFirstPage()
  })

  it('觸發watch filterTimestamp', () => {
    wrapper.vm.filterTimestamp = 123456
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('clickNumberAboveToShow')
  })

  it('觸發watch filterDateTimestamp', async () => {
    wrapper.vm.filterDateTimestamp = 223456
    // mock 排序後打api
    wrapper.vm.custom_user_list = []
    wrapper.vm.detail_type = 0
    wrapper.vm.fuzzy_search = false
    wrapper.vm.hall_name = 'esb'
    wrapper.vm.length = 15
    wrapper.vm.life_cycle_analysis_detail_date = '2023-08-15 ~ 2023-09-12'
    wrapper.vm.life_cycle_analysis_step = 1
    wrapper.vm.order = 'DESC'
    wrapper.vm.query_date = '2023-09-12'
    wrapper.vm.search_name = ''
    wrapper.vm.sort = 'deposit_amount'
    wrapper.vm.start = 0
    wrapper.vm.platform = 'bbin'

    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 108,
          records_filtered: 108,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941721245,
              user_name: 'wuxu850223',
              activity_day: 26,
              bet_amount: '1218198',
              payoff: '-32299.69',
              deposit_amount: '245748',
              bet_amount_avg: '46853.76',
              payoff_avg: '-1242.3',
              deposit_amount_avg: '9451.85'
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //等待異步完成
    await flushPromises()
  })

  it('觸發watch 與 mock api 是否如預期', async () => {
    // mock 排序後打api
    wrapper.vm.custom_user_list = []
    wrapper.vm.detail_type = 0
    wrapper.vm.fuzzy_search = false
    wrapper.vm.hall_name = 'esb'
    wrapper.vm.length = 15
    wrapper.vm.life_cycle_analysis_detail_date = '2023-08-15 ~ 2023-09-12'
    wrapper.vm.life_cycle_analysis_step = 1
    wrapper.vm.order = 'DESC'
    wrapper.vm.query_date = '2023-09-12'
    wrapper.vm.search_name = ''
    wrapper.vm.sort = 'deposit_amount'
    wrapper.vm.start = 0
    wrapper.vm.platform = 'bbin'

    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 108,
          records_filtered: 108,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941721245,
              user_name: 'wuxu850223',
              activity_day: 26,
              bet_amount: '1218198',
              payoff: '-32299.69',
              deposit_amount: '245748',
              bet_amount_avg: '46853.76',
              payoff_avg: '-1242.3',
              deposit_amount_avg: '9451.85'
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //觸發updateTimestamp
    wrapper.vm.filterDateTimestamp = 12345
    //等待異步完成
    await flushPromises()

    //mock api other
    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success'
        },
        result: []
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result2)
    wrapper.vm.filterDateTimestamp = 22345
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])

    //mock error api 403
    const error403 = new Error('Forbidden')
    error403.response = {
      status: 403
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error403)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323448
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.vm.messageKey).toBe('noPermission')

    //mock error api 401
    const error401 = new Error('error')
    error401.response = {
      status: 401
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error401)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323449
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])

    //mock error api other
    const errorOther = new Error('error')
    errorOther.response = {
      status: 999
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(errorOther)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323450
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.vm.messageKey).toBe('chartFailed')
  })
})
