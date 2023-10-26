import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import MemberDetails from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/MemberDetails.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DialogMemberHistory from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberHistory.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import ElementPlus from 'element-plus'
import router from '@/router'

describe('MemberDetails', () => {
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
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})

  // 預設apiSuccess = false，預期渲染的元件
  it('Default apiSuccess = false, expected rendering components', async () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CurrencySignText).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(DialogMemberHistory).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
  })

  // 測試自定義排序，是否符合預期
  it('Test custom sorting to see if it meets expectations', async () => {
    // 測試排序
    let dataValue = {
      prop: 'deposit_amount',
      order: 'ascending'
    }

    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 215,
          records_filtered: 215,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720372,
              user_name: '0123',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720433,
              user_name: '162360',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd15ck013',
              user_id: 941720273,
              user_name: '213wsas',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720288,
              user_name: '2175',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720409,
              user_name: '2875339hyy',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720430,
              user_name: '402517',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720418,
              user_name: '777abcdefg',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd24ck032',
              user_id: 941720293,
              user_name: '8888qw',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dbt888',
              user_id: 941720431,
              user_name: '942132432',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720314,
              user_name: '9527',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd22ck063',
              user_id: 941720386,
              user_name: '996500568',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd30ck035',
              user_id: 941720337,
              user_name: 'a19192808',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720427,
              user_name: 'a598158606',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd24ck018',
              user_id: 941720367,
              user_name: 'aeiou14579',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720397,
              user_name: 'afd168',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
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

    wrapper.vm.upadteCurrentSort(dataValue)

    let order = dataValue['order'] == 'descending' ? 'DESC' : 'ASC'
    expect(wrapper.vm.querySortRule.sort).toBe('deposit_amount')
    expect(wrapper.vm.querySortRule.order).toBe(order)
    //等待異步完成
    await flushPromises()
  })

  // 測試頁碼切換
  it('Test page number switching', async () => {
    // 切換頁後打api mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 215,
          records_filtered: 215,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720392,
              user_name: 'ahua185529',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720365,
              user_name: 'allen168',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940056316,
              user_name: 'amo999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd24ck018',
              user_id: 941720436,
              user_name: 'andy790203',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720383,
              user_name: 'aning',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720339,
              user_name: 'aska0880',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940056816,
              user_name: 'aurora999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720338,
              user_name: 'baggio418',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720301,
              user_name: 'baxuansan',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720285,
              user_name: 'bonnie',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940049772,
              user_name: 'brian999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940051826,
              user_name: 'candy999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940055736,
              user_name: 'cash999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720269,
              user_name: 'cctvt937',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'desbtest',
              user_id: 940050394,
              user_name: 'charles999',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
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

    let currentPage = 2
    wrapper.vm.updateCurrentPage(currentPage)
    let apiStart = wrapper.vm.apiDraw * wrapper.vm.apiLength - wrapper.vm.apiLength
    expect(wrapper.vm.apiStart).toBe(apiStart)
    //等待異步完成
    await flushPromises()
  })

  // 表格頁碼切換到第一頁
  it('Table page number switches to the first page', () => {
    wrapper.vm.tableGoToFirstPage()
  })

  // 觸發watch filterTimestamp
  it('Trigger watch filterTimestamp', () => {
    wrapper.vm.filterTimestamp = 123456
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('clickNumberAboveToShow')
  })

  // 觸發watch filterDateTimestamp
  it('Trigger watch filterDateTimestamp', async () => {
    //mock api 0000
    const result0 = {
      data: {
        result: {
          records_total: 215,
          records_filtered: 215,
          data: [
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720372,
              user_name: '0123',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720433,
              user_name: '162360',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd15ck013',
              user_id: 941720273,
              user_name: '213wsas',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720288,
              user_name: '2175',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720409,
              user_name: '2875339hyy',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720430,
              user_name: '402517',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720418,
              user_name: '777abcdefg',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd24ck032',
              user_id: 941720293,
              user_name: '8888qw',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dbt888',
              user_id: 941720431,
              user_name: '942132432',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720314,
              user_name: '9527',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd22ck063',
              user_id: 941720386,
              user_name: '996500568',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd30ck035',
              user_id: 941720337,
              user_name: 'a19192808',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720427,
              user_name: 'a598158606',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'd24ck018',
              user_id: 941720367,
              user_name: 'aeiou14579',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
            },
            {
              hall_id: 3820698,
              domain_id: 0,
              ag_name: 'dcash888',
              user_id: 941720397,
              user_name: 'afd168',
              activity_day: 0,
              bet_amount: '0',
              payoff: '0',
              deposit_amount: '0',
              bet_amount_avg: '0',
              payoff_avg: '0',
              deposit_amount_avg: '0'
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

    wrapper.vm.filterDateTimestamp = 223456

    //等待異步完成
    await flushPromises()
  })

  // 觸發watch 與 mock api 是否如預期
  it('Is triggering watch and mock api as expected?', async () => {
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
