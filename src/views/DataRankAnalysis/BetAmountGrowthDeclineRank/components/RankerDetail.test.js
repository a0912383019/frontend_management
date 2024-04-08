import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import RankerDetail from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/RankerDetail.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ElementPlus from 'element-plus'
import CdpIcon from '@/components/CdpIcon.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import 'vitest-canvas-mock'

describe('RankerDetail.vue', () => {
  let wrapper = null
  const apiResult = {
    daily: [
      {
        users: [
          {
            user_id: 455648693,
            user_name: 'jimmyrmb01',
            bet_amount: '11100.0000',
            commissionable: '10500.0000'
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            bet_amount: '0',
            commissionable: '0'
          }
        ],
        date: {
          fin_year: 2024,
          fin_month: 3,
          fin_week: 2
        }
      },
      {
        users: [
          {
            user_id: 455648693,
            user_name: 'jimmyrmb01',
            bet_amount: '0',
            commissionable: '0'
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            bet_amount: '20500.0000',
            commissionable: '20491.8000'
          }
        ],
        date: {
          fin_year: 2024,
          fin_month: 3,
          fin_week: 3
        }
      }
    ],
    rank: [
      {
        ag_name: 'dgiambii',
        bet_amount_growth_percent: '100.0000',
        bet_amount_total: '20500.0000',
        bet_amount_total_compare: '0',
        commissionable_growth_percent: '100.0000',
        commissionable_total: '27659.4978',
        commissionable_total_compare: '0',
        user_id: 455673606,
        user_name: 'guspig43',
        level: '未分層',
        tags: [10001]
      },
      {
        ag_name: 'djimmy',
        bet_amount_growth_percent: '100.0000',
        bet_amount_total: '17657.5900',
        bet_amount_total_compare: '0',
        commissionable_growth_percent: '100.0000',
        commissionable_total: '17650.5270',
        commissionable_total_compare: '0',
        user_id: 455648693,
        user_name: 'jimmyrmb01',
        level: 'QAJimmy(勿動)',
        tags: [10001, 10002, 10003, 10004]
      }
    ]
  }
  const expectResult = [
    {
      ag_name: 'dgiambii',
      bet_amount_growth_percent: '100.0000',
      bet_amount_total: '20500.0000',
      bet_amount_total_compare: '0',
      commissionable: '27,659',
      commissionable_growth_percent: '100',
      commissionable_total: '27659.4978',
      commissionable_total_compare: '0',
      index: 0,
      level: '未分層',
      rank: 0,
      tag_button_show: false,
      tag_name_str: [10001],
      tag_show: false,
      tag_transfrom_obj: [
        {
          code: '10001',
          hide: false,
          name: 'VIP客',
          width: 25
        }
      ],
      tags: [10001],
      user_id: 455673606,
      user_name: 'guspig43'
    },
    {
      ag_name: 'djimmy',
      bet_amount_growth_percent: '100.0000',
      bet_amount_total: '17657.5900',
      bet_amount_total_compare: '0',
      commissionable: '17,651',
      commissionable_growth_percent: '100',
      commissionable_total: '17650.5270',
      commissionable_total_compare: '0',
      index: 1,
      level: 'QAJimmy(勿動)',
      rank: 1,
      tag_button_show: true,
      tag_name_str: [10001, 10002, 10003, 10004],
      tag_show: false,
      tag_transfrom_obj: [
        {
          code: '10001',
          hide: false,
          name: 'VIP客',
          width: 25
        },
        {
          code: '10002',
          hide: false,
          name: 'VIP客超級無敵大麥克兩份無糖',
          width: 36
        },
        {
          code: '10003',
          hide: true,
          name: 'VIP彡去',
          width: 26
        },
        {
          code: '10004',
          hide: true,
          name: 'VIP客吃吃抓抓貓抓板',
          width: 32
        }
      ],
      tags: [10001, 10002, 10003, 10004],
      user_id: 455648693,
      user_name: 'jimmyrmb01'
    }
  ]

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')

      const getSessionStorageEntity = vi.fn()
      getSessionStorageEntity.mockReturnValue({
        tags_config: {
          esb: {
            10001: {
              tag_type: 1,
              tag_name: 'VIP客',
              tag_description: '人工定義為高價值會員'
            },
            10002: {
              tag_type: 1,
              tag_name: 'VIP客超級無敵大麥克兩份無糖',
              tag_description: '超級無敵大麥克兩份無糖'
            },
            10003: {
              tag_type: 1,
              tag_name: 'VIP彡去',
              tag_description: '彡彡去'
            },
            10004: {
              tag_type: 1,
              tag_name: 'VIP客吃吃抓抓貓抓板',
              tag_description: '吃吃抓貓抓板'
            }
          }
        }
      })
      //模擬檢查標籤是否禁用
      const checkTagUsage = vi.fn()
      checkTagUsage.mockReturnValue(true)

      return {
        ...actual, //包括原始模組中的其他方法
        getSessionStorageEntity,
        checkTagUsage
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    wrapper = shallowMount(RankerDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          CdpIcon
        }
      },
      props: {
        apiObject: {
          apiSuccess: false,
          messageKey: 'loading',
          result: {}
        },
        clientWidth: 100
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  })

  it('Expected api result transform correctly', async () => {
    wrapper = shallowMount(RankerDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          CdpIcon
        }
      },
      props: {
        apiObject: {
          apiSuccess: true,
          messageKey: 'loading',
          result: apiResult
        },
        clientWidth: 100
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.vm.tableData).toStrictEqual(expectResult)
  })

  it('handleTagButtonClick', async () => {
    wrapper = shallowMount(RankerDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          CdpIcon
        }
      },
      props: {
        apiObject: {
          apiSuccess: true,
          messageKey: 'loading',
          result: apiResult
        },
        clientWidth: 100
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    await wrapper.vm.handleTagButtonClick(expectResult[1])
    let newTableData = [...expectResult]
    newTableData[1].tag_button_show = true
    newTableData[1].tag_show = true
    expect(wrapper.vm.tableData).toStrictEqual(newTableData)
  })

  it('tableColumns data', () => {
    const tableColumns = [
      {
        label: '名次',
        prop: 'rank',
        headerAlign: 'center',
        align: 'center',
        minWidth: '7%'
      },
      {
        label: '會員名稱',
        prop: 'user_name',
        headerAlign: 'center',
        align: 'center',
        minWidth: '12%'
      },
      {
        label: '代理帳號',
        prop: 'ag_name',
        headerAlign: 'center',
        align: 'center',
        minWidth: '12%'
      },
      {
        label: '會員層級',
        prop: 'level',
        headerAlign: 'center',
        align: 'center',
        minWidth: '12%'
      },
      {
        label: '有效投注變化',
        prop: 'commissionable',
        headerAlign: 'center',
        align: 'center',
        minWidth: '10%'
      },
      {
        label: '標籤',
        prop: 'tag_name_str',
        headerAlign: 'center',
        align: 'left',
        minWidth: '47%'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('watch props change', async () => {
    wrapper = shallowMount(RankerDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          CdpIcon
        }
      },
      props: {
        apiObject: {
          apiSuccess: false,
          messageKey: 'loading',
          result: {
            rank: [],
            daily: []
          }
        },
        clientWidth: 100
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('loading')
    expect(wrapper.vm.tableData).toStrictEqual([])

    await wrapper.setProps({
      apiObject: {
        apiSuccess: true,
        messageKey: 'shortloading',
        result: {
          rank: [],
          daily: []
        }
      }
    })
    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(wrapper.vm.messageKey).toBe('shortloading')
    expect(wrapper.vm.tableData).toStrictEqual([])
  })
})
