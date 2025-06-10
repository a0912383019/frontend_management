import { describe, expect, it, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import SearchDetailBox from '@/views/ExportReportList/components/SearchDetailBox.vue'
import { useExportListStore, useGlobalStore } from '@/stores'
import { createTestingPinia } from '@pinia/testing'
import FormTable from '@/components/CustomTable/FormTable.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'

describe('SearchDetailBox.vue', () => {
  let wrapper = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.tableConfig = {
      0: {
        step_name: '尚未註冊',
        step_description: '',
        step_color: [128, 128, 192],
        step_icon: '',
        step_dot: ''
      },
      1: {
        step_name: '活躍期',
        step_color: [232, 70, 94],
        step_vue_icon: 'fa-solid fa-person-running',
        step_vue_dot_color: 'cdp-bg-paradisepink',
        step_description: '有「持續下注」會員'
      }
    }

    const exportListStore = useExportListStore(pinia)
    exportListStore.levelList = ['未分層', '第1層']
    exportListStore.tag_description_dict = {
      hall: {
        10001: {
          tag_type: 1,
          tag_name: '3C人工標籤湯瑪士改',
          tag_description: '標籤說明(MdyByAnn)嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿',
          tag_category: 1,
          sort_index: 9000008,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        10003: {
          tag_type: 1,
          tag_name: '測試',
          tag_description: '測試敘述',
          tag_category: 1,
          sort_index: 1000000,
          tag_enabled: true,
          mutual_tags_code: ''
        }
      }
    }
  })

  it('test components exists and set prop value and tableColumns correctly', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 1,
          source: 'sidebar.bbin_manage_analysis',
          content: {
            query_date: '2024-04-15',
            detail_date_start: '2024-03-16',
            detail_date_end: '2024-04-15',
            life_cycle_analysis_step: 1,
            detail_type: 0,
            start: 0,
            length: 0,
            search_name: '',
            fuzzy_search: false,
            file_path: 'http://zzzz.com/123.csv',
            sort: 'deposit_amount',
            order: 'DESC',
            locale: 'zh-TW',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    expect(wrapper.findComponent(FormTable).exists()).toBeTruthy()
    expect(wrapper.vm.visibleBox).toBeTruthy()

    await wrapper.setProps({ detailBoxVisible: false })
    expect(wrapper.vm.visibleBox).toBeFalsy()

    wrapper.vm.visibleBox = true
    expect(wrapper.emitted('detailBoxClose')).toBeTruthy()

    expect(wrapper.vm.tableColumns).toStrictEqual([
      {
        align: 'right',
        minWidth: '30%',
        prop: 'contentKey'
      },
      {
        align: 'left',
        minWidth: '70%',
        prop: 'contentData'
      }
    ])
  })

  it('test tableDataType1', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 1,
          source: 'sidebar.bbin_manage_analysis',
          content: {
            query_date: '2024-04-15',
            detail_date_start: '2024-03-16',
            detail_date_end: '2024-04-15',
            life_cycle_analysis_step: 1,
            detail_type: 0,
            start: 0,
            length: 0,
            search_name: '',
            fuzzy_search: false,
            file_path: 'http://zzzz.com/123.csv',
            sort: 'deposit_amount',
            order: 'DESC',
            locale: 'zh-TW',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: '會員經營分析',
        contentKey: '來源頁面'
      },
      {
        contentData: '',
        contentKey: '會員名稱'
      },
      {
        contentData: 'http://zzzz.com/123.csv',
        slotKey: 'url',
        contentKey: '匯入名單'
      },
      {
        contentData: '2024/03/16 ~ 2024/04/15',
        contentKey: '日期'
      },
      {
        contentData: '活躍期',
        contentKey: '階段名稱'
      },
      {
        contentData: '本日人數',
        contentKey: '點選類型'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType2', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 2,
          source: 'sidebar.bbin_customer_tag_list',
          content: {
            search_name: '',
            fuzzy_search: false,
            start: 0,
            length: 0,
            file_path: 'http://zzzz.com/123.csv',
            ag_name: '',
            user_level_id: 3,
            search_tag: '',
            exclude_tag: '',
            records_total: 0,
            activated_date_start: '2024-03-16',
            activated_date_end: '2024-04-15',
            search_date_start_utc: '2024-01-16T04:00:00Z',
            search_date_end_utc: '2024-04-16T03:59:59Z',
            locale: 'zh-TW',
            search_date_start: '2024-01-16',
            search_date_end: '2024-04-15',
            current_date_start: '2024-03-16',
            current_date_end: '2024-04-15',
            average_date_start: '2024-03-16',
            average_date_end: '2024-04-15',
            month_average_date_start: '2024-03-16',
            month_average_date_end: '2024-04-15',
            average_type: 'week',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: '會員標籤查詢',
        contentKey: '來源頁面'
      },
      {
        contentData: '',
        contentKey: '代理帳號'
      },
      {
        contentData: undefined,
        contentKey: '會員層級'
      },
      {
        contentData: '2024/03/16 ~ 2024/04/15',
        contentKey: '實動日期'
      },
      {
        contentData: '2024/01/16 ~ 2024/04/15',
        contentKey: '註冊日期'
      },
      {
        contentData: '',
        contentKey: '會員名稱'
      },
      {
        contentData: undefined,
        contentKey: '包含標籤',
        slotKey: 'tags'
      },
      {
        contentData: undefined,
        contentKey: '排除標籤',
        slotKey: 'tags'
      },
      {
        contentData: 'http://zzzz.com/123.csv',
        slotKey: 'url',
        contentKey: '匯入名單'
      },
      {
        contentData: '2024/03/16 ~ 2024/04/15',
        contentKey: '現況區間'
      },
      {
        contentData: '2024/03/16 ~ 2024/04/15',
        contentKey: '平均區間'
      },
      {
        contentData: '2024/03/16 ~ 2024/04/15',
        contentKey: '月平均區間'
      },
      {
        contentData: '週平均',
        contentKey: '平均方式'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType3', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 3,
          source: 'sidebar.bbin_vip_commercial_analysis',
          content: {
            active_start_date: '2024-04-09',
            active_end_date: '2024-04-15',
            compare_start_date: '2024-04-02',
            compare_end_date: '2024-04-08',
            vip_tag: [10001, 10003],
            search_name: '',
            fuzzy_search: false,
            file_path: 'http://zzzz.com/123.csv',
            detail_type: 0,
            lively_level: 0,
            locale: 'zh-TW',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: 'VIP 營運分析 - 活躍度明細',
        contentKey: '來源頁面'
      },
      {
        contentData: '',
        contentKey: '會員名稱'
      },
      {
        contentData: '2024/04/09 ~ 2024/04/15',
        contentKey: '日期'
      },
      {
        contentData: 'http://zzzz.com/123.csv',
        slotKey: 'url',
        contentKey: '匯入名單'
      },
      {
        contentData: {
          icon: {
            color: 'cdp-text-light__slate__gray',
            icon: 'fa-dizzy'
          },
          iconStepName: '已流失'
        },
        contentKey: '活躍度',
        slotKey: 'steps'
      },
      {
        contentData: '本週人數',
        contentKey: '點選類型'
      },
      {
        contentData: '3C人工標籤湯瑪士改, 測試',
        contentKey: '包含標籤',
        slotKey: 'tags'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType4', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 4,
          source: 'sidebar.bbin_vip_commercial_analysis',
          content: {
            report_date: '2024-04-16',
            vip_tag: [10001, 10003],
            locale: 'zh-TW',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: 'VIP 營運分析 - 日報表',
        contentKey: '來源頁面'
      },
      {
        contentData: '2024/04/16',
        contentKey: '日期'
      },
      {
        contentData: '3C人工標籤湯瑪士改, 測試',
        contentKey: '包含標籤',
        slotKey: 'tags'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType5', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 5,
          source: 'sidebar.bbin_vip_commercial_analysis',
          content: {
            vip_tag: [10001, 10003],
            search_year: 2024,
            search_month: 4,
            search_week: 1,
            compare_year: 0,
            compare_month: 0,
            compare_week: 0,
            locale: 'zh-TW',
            user_id: 249
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: 'VIP 營運分析 - 週報表',
        contentKey: '來源頁面'
      },
      {
        contentData: 2024,
        contentKey: '年份'
      },
      {
        contentData: 4,
        contentKey: '月份'
      },
      {
        contentData: 1,
        contentKey: '週次'
      },
      {
        contentData: '3C人工標籤湯瑪士改, 測試',
        contentKey: '包含標籤',
        slotKey: 'tags'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType8', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 8,
          source: 'sidebar.activity_analysis_list',
          content: {
            is_reward: true,
            search_name: ''
          },
          info: {
            activity: 'abc',
            activity_detail: 'abc_child'
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: '活動成效分析 - 詳細名單',
        contentKey: '來源頁面'
      },
      {
        contentData: 'abc',
        contentKey: '活動名稱'
      },
      {
        contentData: 'abc_child',
        contentKey: '子活動名稱'
      },
      {
        contentData: '是',
        contentKey: '已領獎'
      },
      {
        contentData: '',
        contentKey: '會員名稱'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test tableDataType9', async () => {
    wrapper = shallowMount(SearchDetailBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        reportDetail: {
          type: 9,
          source: 'sidebar.activity_analysis_list',
          content: {
            is_reward: true,
            interval_type: 'week',
            start_date: '2021-01-01',
            end_date: '2023-10-11'
          },
          info: {
            activity_names: ['cdk', 'nnj', '吃飯飯']
          }
        },
        detailBoxVisible: true
      },
      components: {
        FontAwesomeIcon
      }
    })

    const tableData = [
      {
        contentData: '活動成效分析-成長率、成長差額、總和圖表',
        contentKey: '來源頁面'
      },
      {
        contentData: '週',
        contentKey: '分析週期'
      },
      {
        contentData: '2021/01/01 ~ 2023/10/11',
        contentKey: '分析區間'
      },
      {
        contentData: '領獎',
        contentKey: '達檻狀態'
      },
      {
        contentData: 'cdk、nnj、吃飯飯',
        contentKey: '活動名稱'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test generateTags', () => {
    const tagString = '10001,10003;10001,10003'
    const result = '3C人工標籤湯瑪士改, ( 測試 or 3C人工標籤湯瑪士改),  測試'
    expect(wrapper.vm.generateTags(tagString)).toStrictEqual(result)
  })

  it('test memberDayStepName', () => {
    expect(wrapper.vm.memberDayStepName(0)).toStrictEqual('manage_analysis.today_num')
    expect(wrapper.vm.memberDayStepName(1)).toStrictEqual('manage_analysis.diff_pre_day')
    expect(wrapper.vm.memberDayStepName(2)).toStrictEqual('manage_analysis.today_add')
  })

  it('test memberWeekStepName', () => {
    expect(wrapper.vm.memberWeekStepName(0)).toStrictEqual(
      'vip_commercial_analysis.this_week_people_num'
    )
    expect(wrapper.vm.memberWeekStepName(1)).toStrictEqual(
      'vip_commercial_analysis.this_week_increase_people_num'
    )
    expect(wrapper.vm.memberWeekStepName(2)).toStrictEqual(
      'vip_commercial_analysis.this_week_decrease_people_num'
    )
  })

  it('test handleCloseDialog', async () => {
    await wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('detailBoxClose')).toBeTruthy()
  })

  it('test showTags', async () => {
    const tagString1 = '3C人工標籤湯瑪士改, ( 測試 or 3C人工標籤湯瑪士改),  測試'
    expect(wrapper.vm.showTags(tagString1)).toStrictEqual(tagString1.split(' '))

    const tagString2 = ''
    expect(wrapper.vm.showTags(tagString2)).toStrictEqual([])
  })
})
