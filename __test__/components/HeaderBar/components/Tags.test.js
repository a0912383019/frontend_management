import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { i18n } from '@/global/i18n'
import Tags from '@/components/HeaderBar/components/Tags.vue'
import { createTestingPinia } from '@pinia/testing'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'
import router from '@/router'

describe('Tags', () => {
  let wrapper = null
  let system_config = null

  beforeEach(() => {
    system_config = {
      tags_config: {
        esb: {
          10000: {
            tag_type: 1,
            tag_name: '測試',
            tag_description: '測試敘述',
            tag_category: 1,
            sort_index: 1000000,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          10001: {
            tag_type: 1,
            tag_name: 'VIP客',
            tag_description: '人工定義為高價值會員',
            tag_category: 1,
            sort_index: 1000001,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          30001: {
            tag_type: 3,
            tag_name: '體育客',
            tag_description: '會員近15個實動日，在體育類遊戲總有效投註量最多',
            tag_category: 1,
            sort_index: 3000012,
            tag_enabled: true,
            mutual_tags_code: '30009,30010,30011,30013,30014'
          },
          60110: {
            tag_type: 6,
            tag_name: '百家樂視訊疑似對打客',
            tag_description: 'AI 判定有對打嫌疑玩百家樂視訊的會員',
            tag_category: 1,
            sort_index: 6011000,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          60210: {
            tag_type: 6,
            tag_name: '龍虎鬥視訊疑似對打客',
            tag_description: 'AI 判定有對打嫌疑玩龍虎鬥視訊的會員',
            tag_category: 1,
            sort_index: 6021000,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          60310: {
            tag_type: 6,
            tag_name: '骰寶視訊疑似對打客',
            tag_description: 'AI 判定有對打嫌疑玩骰寶視訊的會員',
            tag_category: 1,
            sort_index: 6031000,
            tag_enabled: true,
            mutual_tags_code: ''
          }
        },
        bmw: {
          40001: {
            tag_type: 4,
            tag_name: 'AG視訊對打客',
            tag_description: 'AI 判定有對打玩AG視訊的會員',
            tag_category: 1,
            sort_index: 4000030,
            tag_enabled: true,
            mutual_tags_code: '40006,40014'
          },
          50003: {
            tag_type: 5,
            tag_name: '代理傭金轉會員',
            tag_description: '人工定義為代理傭金轉會員',
            tag_category: 1,
            sort_index: 5000300,
            tag_enabled: true,
            mutual_tags_code: ''
          }
        }
      }
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))

    wrapper = mount(Tags, {
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
      },
      props: {
        times: 1022
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 預期渲染與開啟dialog後資料是否正確，函式是否正確呼叫
  it('Verify whether the data is correct after opening the dialog, test function', async () => {
    expect(wrapper.vm.dialogTableVisible).toBe(false)

    wrapper.vm.activeHall.hall_code = 'esb'

    wrapper.vm.systemConfigIsOk = 1234
    await wrapper.vm.$nextTick()
    //  wrapper.setProps({ times: 5002 })
    expect(wrapper.vm.tagsConfig).toStrictEqual(system_config.tags_config)

    //初始資料是否正確
    const tagConfigEsb = {
      all: [
        {
          mutual_tags_code: '',
          sort_index: 1000000,
          tag_category: 1,
          tag_description: '測試敘述',
          tag_enabled: true,
          tag_name: '測試',
          tag_type: 1
        },
        {
          mutual_tags_code: '',
          sort_index: 1000001,
          tag_category: 1,
          tag_description: '人工定義為高價值會員',
          tag_enabled: true,
          tag_name: 'VIP客',
          tag_type: 1
        },
        {
          mutual_tags_code: '30009,30010,30011,30013,30014',
          sort_index: 3000012,
          tag_category: 1,
          tag_description: '會員近15個實動日，在體育類遊戲總有效投註量最多',
          tag_enabled: true,
          tag_name: '體育客',
          tag_type: 3
        },
        {
          mutual_tags_code: '',
          sort_index: 6011000,
          tag_category: 1,
          tag_description: 'AI 判定有對打嫌疑玩百家樂視訊的會員',
          tag_enabled: true,
          tag_name: '百家樂視訊疑似對打客',
          tag_type: 6
        },
        {
          mutual_tags_code: '',
          sort_index: 6021000,
          tag_category: 1,
          tag_description: 'AI 判定有對打嫌疑玩龍虎鬥視訊的會員',
          tag_enabled: true,
          tag_name: '龍虎鬥視訊疑似對打客',
          tag_type: 6
        },
        {
          mutual_tags_code: '',
          sort_index: 6031000,
          tag_category: 1,
          tag_description: 'AI 判定有對打嫌疑玩骰寶視訊的會員',
          tag_enabled: true,
          tag_name: '骰寶視訊疑似對打客',
          tag_type: 6
        },
        {
          tag_description: '會員近15個實動日，遊玩『週一 至 週日』週次總下注最多者',
          tag_name: '週次'
        },
        {
          tag_description: '會員近15個實動日，遊玩『00:00 至 23:00』時段(每小時計算)總下注最多者',
          tag_name: '時段'
        },
        {
          tag_description: '最後存款日之當日平均單筆存款金額超過xx萬，範圍1萬至20萬',
          tag_name: '最後平均單筆存款'
        },
        {
          tag_description: '會員近15個實動日，單日單款遊戲投注最大金額大於xx萬，範圍1萬至100萬',
          tag_name: '最大投注金額'
        },
        {
          tag_description: '上週與本週有效投注降幅達xx萬，範圍100萬至5000萬',
          tag_name: '有效投注下降幅度'
        },
        {
          tag_description:
            '會員近15個實動日，在 某入款方法 總金額最高，包含公司入款、加密貨幣、人工存入、購寶錢包、CGPAY支付、線上存款、e點付、e點富、OSPAY支付等',
          tag_name: '常用入款方式'
        },
        {
          tag_description: '會員近15個實動日，登入次數最多的省份地區',
          tag_name: '常登入地區(省)'
        }
      ],
      type1: [
        {
          mutual_tags_code: '',
          sort_index: 1000000,
          tag_category: 1,
          tag_description: '測試敘述',
          tag_enabled: true,
          tag_name: '測試',
          tag_type: 1
        },
        {
          mutual_tags_code: '',
          sort_index: 1000001,
          tag_category: 1,
          tag_description: '人工定義為高價值會員',
          tag_enabled: true,
          tag_name: 'VIP客',
          tag_type: 1
        }
      ],
      type3: [
        {
          mutual_tags_code: '30009,30010,30011,30013,30014',
          sort_index: 3000012,
          tag_category: 1,
          tag_description: '會員近15個實動日，在體育類遊戲總有效投註量最多',
          tag_enabled: true,
          tag_name: '體育客',
          tag_type: 3
        },
        {
          tag_description: '會員近15個實動日，遊玩『週一 至 週日』週次總下注最多者',
          tag_name: '週次'
        },
        {
          tag_description: '會員近15個實動日，遊玩『00:00 至 23:00』時段(每小時計算)總下注最多者',
          tag_name: '時段'
        },
        {
          tag_description: '最後存款日之當日平均單筆存款金額超過xx萬，範圍1萬至20萬',
          tag_name: '最後平均單筆存款'
        },
        {
          tag_description: '會員近15個實動日，單日單款遊戲投注最大金額大於xx萬，範圍1萬至100萬',
          tag_name: '最大投注金額'
        },
        {
          tag_description: '上週與本週有效投注降幅達xx萬，範圍100萬至5000萬',
          tag_name: '有效投注下降幅度'
        },
        {
          tag_description:
            '會員近15個實動日，在 某入款方法 總金額最高，包含公司入款、加密貨幣、人工存入、購寶錢包、CGPAY支付、線上存款、e點付、e點富、OSPAY支付等',
          tag_name: '常用入款方式'
        },
        {
          tag_description: '會員近15個實動日，登入次數最多的省份地區',
          tag_name: '常登入地區(省)'
        }
      ],
      type4: [],
      type5: []
    }
    expect(wrapper.vm.tagsData).toStrictEqual(tagConfigEsb)
    expect(wrapper.vm.tableData).toStrictEqual(tagConfigEsb['all'])
    expect(wrapper.vm.tagsDataOriginal).toStrictEqual(tagConfigEsb)

    //開啟dialog
    await wrapper.find('.tag-btn').trigger('click')
    expect(wrapper.vm.dialogTableVisible).toBe(true)

    //搜尋後資料是否正確
    const searchTableData1 = [
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: ''
      }
    ]
    wrapper.vm.searchText = 'vip'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toStrictEqual(searchTableData1)

    //切換tab資料是否正確
    wrapper.vm.$refs.refTable.goToFirstPage = vi.fn()
    wrapper.vm.currentTabs = 'type3'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.searchText).toBe('')
    expect(wrapper.vm.tagsData['all']).toStrictEqual(tagConfigEsb['all'])
    expect(wrapper.vm.tableData).toStrictEqual(tagConfigEsb['type3'])

    //再次搜尋資料是否正確
    const searchTableData2 = [
      {
        tag_name: '週次',
        tag_description: '會員近15個實動日，遊玩『週一 至 週日』週次總下注最多者'
      }
    ]
    wrapper.vm.searchText = '週次'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toStrictEqual(searchTableData2)

    //關閉dialog
    wrapper.vm.handleCloseDialog()
    expect(wrapper.vm.searchText).toBe('')

    //切換聽別資料是否正確
    const tagConfigBmw = {
      all: [
        {
          tag_type: 4,
          tag_name: 'AG視訊對打客',
          tag_description: 'AI 判定有對打玩AG視訊的會員',
          tag_category: 1,
          sort_index: 4000030,
          tag_enabled: true,
          mutual_tags_code: '40006,40014'
        },
        {
          tag_type: 5,
          tag_name: '代理傭金轉會員',
          tag_description: '人工定義為代理傭金轉會員',
          tag_category: 1,
          sort_index: 5000300,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        {
          tag_name: '週次',
          tag_description: '會員近15個實動日，遊玩『週一 至 週日』週次總下注最多者'
        },
        {
          tag_name: '時段',
          tag_description: '會員近15個實動日，遊玩『00:00 至 23:00』時段(每小時計算)總下注最多者'
        },
        {
          tag_name: '最後平均單筆存款',
          tag_description: '最後存款日之當日平均單筆存款金額超過xx萬，範圍1萬至20萬'
        },
        {
          tag_name: '最大投注金額',
          tag_description: '會員近15個實動日，單日單款遊戲投注最大金額大於xx萬，範圍1萬至100萬'
        },
        {
          tag_name: '有效投注下降幅度',
          tag_description: '上週與本週有效投注降幅達xx萬，範圍100萬至5000萬'
        },
        {
          tag_name: '常用入款方式',
          tag_description:
            '會員近15個實動日，在 某入款方法 總金額最高，包含公司入款、加密貨幣、人工存入、購寶錢包、CGPAY支付、線上存款、e點付、e點富、OSPAY支付等'
        },
        { tag_name: '常登入地區(省)', tag_description: '會員近15個實動日，登入次數最多的省份地區' }
      ],
      type1: [],
      type3: [
        {
          tag_name: '週次',
          tag_description: '會員近15個實動日，遊玩『週一 至 週日』週次總下注最多者'
        },
        {
          tag_name: '時段',
          tag_description: '會員近15個實動日，遊玩『00:00 至 23:00』時段(每小時計算)總下注最多者'
        },
        {
          tag_name: '最後平均單筆存款',
          tag_description: '最後存款日之當日平均單筆存款金額超過xx萬，範圍1萬至20萬'
        },
        {
          tag_name: '最大投注金額',
          tag_description: '會員近15個實動日，單日單款遊戲投注最大金額大於xx萬，範圍1萬至100萬'
        },
        {
          tag_name: '有效投注下降幅度',
          tag_description: '上週與本週有效投注降幅達xx萬，範圍100萬至5000萬'
        },
        {
          tag_name: '常用入款方式',
          tag_description:
            '會員近15個實動日，在 某入款方法 總金額最高，包含公司入款、加密貨幣、人工存入、購寶錢包、CGPAY支付、線上存款、e點付、e點富、OSPAY支付等'
        },
        { tag_name: '常登入地區(省)', tag_description: '會員近15個實動日，登入次數最多的省份地區' }
      ],
      type4: [
        {
          tag_type: 4,
          tag_name: 'AG視訊對打客',
          tag_description: 'AI 判定有對打玩AG視訊的會員',
          tag_category: 1,
          sort_index: 4000030,
          tag_enabled: true,
          mutual_tags_code: '40006,40014'
        }
      ],
      type5: [
        {
          tag_type: 5,
          tag_name: '代理傭金轉會員',
          tag_description: '人工定義為代理傭金轉會員',
          tag_category: 1,
          sort_index: 5000300,
          tag_enabled: true,
          mutual_tags_code: ''
        }
      ]
    }
    wrapper.vm.activeHall.hall_code = 'bmw'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tagsData).toStrictEqual(tagConfigBmw)
    expect(wrapper.vm.tableData).toStrictEqual(tagConfigBmw['type3'])
    expect(wrapper.vm.tagsDataOriginal).toStrictEqual(tagConfigBmw)
  })
})
