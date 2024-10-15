import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import CustomerTagList from '@/views/CustomerTagList/CustomerTagList.vue'
import { useGlobalStore } from '@/stores/global.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import router from '@/router'
import * as module from '@/utils/commonUtils.js'
import 'vitest-canvas-mock'

describe('CustomerTagList', () => {
  let wrapper = null
  let spy

  beforeEach(() => {
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    //模擬呼叫getSessionStorageEntity
    module.getSessionStorageEntity.mockReturnValueOnce({
      tags_config: {
        10001: {
          tag_type: 1,
          tag_name: 'VIP客',
          tag_description: '人工定義為高價值會員'
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

    let result = {
      result: {
        records_total: 717,
        data: [
          {
            hall_id: 3820698,
            domain_id: 0,
            ag_name: 'dcash888',
            user_level_id: 20230,
            tag_str: '10001',
            tag_name_str:
              '贏了會衝,電子客,體育客,再存客,已流失客,週五客,22:00客,疑似刷水客,電腦端,初期會員,省級地區標_廣東,常用入款_CGPAY支付,AI-即將流失客',
            register_date: '2023-08-21 16:34:54',
            user_id: 953351378,
            user_name: 'xjf326958',
            user_level: '第1層'
          }
        ]
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result)

    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'post').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/member/list_member_tags':
          return Promise.resolve({ data: result })
        default:
          return error
      }
    })

    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }
    globalStore.systemConfigIsOk = 0

    wrapper = shallowMount(CustomerTagList, {
      global: {
        plugins: [i18n, ElementPlus, router]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 測試api資料
  it('expect mock api', () => {
    expect(wrapper.vm.apiRecordsTotal).toBe(717)
  })

  // 頁碼切換執行的內容
  it('updateCurrentPage', async () => {
    wrapper.vm.updateCurrentPage(2)

    await wrapper.vm.$nextTick()

    wrapper.vm.apiDraw = 2
    wrapper.vm.apiLength = 10

    expect(wrapper.vm.apiDraw).toBe(2)
    expect(wrapper.vm.apiStart).toBe(10)
    expect(wrapper.vm.$refs.refCustomTable.showTableLoading).toBe(true)
  })

  it('handleFilterSubmit', async () => {
    let data = {
      activatedDate: '2023-10-19 ~ 2023-11-18',
      custom_user_list: [],
      excludeTag: '30004',
      fuzzySearch: false,
      isActivedDateCheck: true,
      member: '',
      registerDate: '2023-08-19 ~ 2023-11-18',
      searchTag: '10001',
      selectAcount: 'aapprmb',
      selectLevel: 15614
    }

    wrapper.vm.handleFilterSubmit(data)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.apiRecordsTotal).toBe(0)
    expect(wrapper.vm.formData['activatedDate']).toBe('2023-10-19 ~ 2023-11-18')
    expect(wrapper.vm.formData['customUserList']).toStrictEqual([])
    expect(wrapper.vm.formData['excludeTag']).toBe('30004')
    expect(wrapper.vm.formData['fuzzySearch']).toBe(false)
    expect(wrapper.vm.formData['member']).toBe('')
    expect(wrapper.vm.formData['registerDate']).toBe('2023-08-19 ~ 2023-11-18')
    expect(wrapper.vm.formData['searchTag']).toBe('10001')
    expect(wrapper.vm.formData['selectAcount']).toBe('aapprmb')
    expect(wrapper.vm.formData['selectLevel']).toBe(15614)
  })

  it('handleTagButtonClick', async () => {
    let item = {
      hall_id: 3820698,
      domain_id: 0,
      ag_name: 'dcash888',
      user_level_id: 20215,
      tag_str: '30006,30012,30015,30020,30024,30040,30054,30056,30094,30165,30205,40003',
      tag_name_str: [
        '30006',
        '30012',
        '30015',
        '30020',
        '30024',
        '30040',
        '30054',
        '30056',
        '30094',
        '30165',
        '30205',
        '40003'
      ],
      register_date: '2023/09/11 21:53:45',
      user_id: 954853398,
      user_name: 'wsfc421',
      user_level: '未分層',
      index: 0,
      tag_transfrom_obj: [
        {
          code: '30006',
          name: '輸了會衝',
          width: 73,
          hide: false
        },
        {
          code: '30012',
          name: '體育客',
          width: 60,
          hide: false
        },
        {
          code: '30015',
          name: '好客',
          width: 47,
          hide: false
        },
        {
          code: '30020',
          name: '最近常輸客',
          width: 86,
          hide: false
        },
        {
          code: '30024',
          name: '週二客',
          width: 60,
          hide: false
        },
        {
          code: '30040',
          name: '10:00客',
          width: 66,
          hide: false
        },
        {
          code: '30054',
          name: '疑似刷水客',
          width: 86,
          hide: false
        },
        {
          code: '30056',
          name: '電腦端',
          width: 60,
          hide: false
        },
        {
          code: '30094',
          name: '初期會員',
          width: 73,
          hide: false
        },
        {
          code: '30165',
          name: '省級地區標_江西',
          width: 119,
          hide: true
        },
        {
          code: '30205',
          name: '常用入款_線上存款',
          width: 132,
          hide: true
        },
        {
          code: '40003',
          name: '即將流失客',
          width: 86,
          hide: true
        }
      ],
      tag_show: true,
      tag_button_show: true
    }
    wrapper.vm.handleTagButtonClick(item)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData[item.index]['tag_show']).toBe(true)
  })
})
