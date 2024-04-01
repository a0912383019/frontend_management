import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import RankerDetail from '@/views/DataRankAnalysis/BetAmount/components/RankerDetail.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ElementPlus from 'element-plus'
import CdpIcon from '@/components/CdpIcon.vue'
import { createTestingPinia } from '@pinia/testing'
import * as module from '@/utils/commonUtils.js'
import { useGlobalStore } from '@/stores'
import 'vitest-canvas-mock'

describe('RankerDetail.vue', () => {
  let wrapper = null
  let spy
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
        date: '2024-03-22'
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
        date: '2024-03-23'
      }
    ],
    rank: [
      {
        ag_name: 'dgiambii',
        bet_amount_total: '20500.0000',
        commissionable_total: '20491.8000',
        user_id: 455673606,
        user_name: 'guspig43',
        user_level: 'shu測試',
        tags: [10001]
      },
      {
        ag_name: 'djimmy',
        bet_amount_total: '11100.0000',
        commissionable_total: '10500.0000',
        user_id: 455648693,
        user_name: 'jimmyrmb01',
        user_level: 'QAJimmy(勿動)',
        tags: [10001, 10002, 10003, 10004]
      }
    ]
  }
  const expectResult = [
    {
      ag_name: 'dgiambii',
      bet_amount_total: '20500.0000',
      commissionable: '20,492',
      commissionable_total: '20491.8000',
      index: 0,
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
      user_level: 'shu測試',
      user_name: 'guspig43'
    },
    {
      ag_name: 'djimmy',
      bet_amount_total: '11100.0000',
      commissionable: '10,500',
      commissionable_total: '10500.0000',
      index: 1,
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
      user_level: 'QAJimmy(勿動)',
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
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    //模擬呼叫getSessionStorageEntity
    module.getSessionStorageEntity.mockReturnValueOnce({
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

    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')

      //模擬檢查標籤是否禁用
      const checkTagUsage = vi.fn()
      checkTagUsage.mockReturnValue(true)

      return {
        ...actual, //包括原始模組中的其他方法
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
          result: apiResult,
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
          result: apiResult,
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
        prop: 'user_level',
        headerAlign: 'center',
        align: 'center',
        minWidth: '12%'
      },
      {
        label: '有效投注',
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
