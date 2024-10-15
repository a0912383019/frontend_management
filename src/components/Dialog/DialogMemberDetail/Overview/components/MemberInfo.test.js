import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberInfo from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberInfo.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import router from '@/router'
import ElementPlus from 'element-plus'

describe('MemberInfo.vue', () => {
  let wrapper = null

  beforeEach(() => {
    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')

      //模擬檢查標籤是否禁用
      const checkTagUsage = vi.fn()
      checkTagUsage.mockReturnValue(true)

      //模擬產生標籤
      const generateTagBySortIndex = vi.fn()
      generateTagBySortIndex.mockReturnValue({
        10000: {
          tag_type: 1,
          tag_name: '測試',
          tag_description: '測試敘述',
          tag_category: 1,
          sort_index: 1000000,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10000'
        },
        10001: {
          tag_type: 1,
          tag_name: 'VIP客',
          tag_description: '人工定義為高價值會員',
          tag_category: 1,
          sort_index: 1000001,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10001'
        },
        10002: {
          tag_type: 1,
          tag_name: '退場VIP',
          tag_description: '人工定義為「曾經」是高價值會員',
          tag_category: 1,
          sort_index: 1000002,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10002'
        },
        10003: {
          tag_type: 1,
          tag_name: '深耕客',
          tag_description: '人工定義為「有潛力開發」為高價值的會員',
          tag_category: 1,
          sort_index: 1000004,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10003'
        },
        10004: {
          tag_type: 1,
          tag_name: '退場深耕客',
          tag_description: '人工定義為「曾經有潛力開發」為高價值的會員',
          tag_category: 1,
          sort_index: 1000005,
          tag_enabled: true,
          mutual_tags_code: '10000',
          tag_key: '10004'
        },
        10005: {
          tag_type: 1,
          tag_name: '套利客',
          tag_description: '人工定義為套利客',
          tag_category: 1,
          sort_index: 1000006,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10005'
        },
        10007: {
          tag_type: 1,
          tag_name: '疑似套利客',
          tag_description: '人工定義為疑似套利客',
          tag_category: 1,
          sort_index: 1000007,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10007'
        }
      })
      return {
        ...actual, //包括原始模組中的其他方法
        checkTagUsage,
        generateTagBySortIndex
      }
    })

    const user_info = {
      user_type: 9
    }
    sessionStorage.setItem('user_info', JSON.stringify(user_info))
    const system_config = {
      tags_config: {
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
        10002: {
          tag_type: 1,
          tag_name: '退場VIP',
          tag_description: '人工定義為「曾經」是高價值會員',
          tag_category: 1,
          sort_index: 1000002,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10002'
        },
        10003: {
          tag_type: 1,
          tag_name: '深耕客',
          tag_description: '人工定義為「有潛力開發」為高價值的會員',
          tag_category: 1,
          sort_index: 1000004,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10003'
        },
        10004: {
          tag_type: 1,
          tag_name: '退場深耕客',
          tag_description: '人工定義為「曾經有潛力開發」為高價值的會員',
          tag_category: 1,
          sort_index: 1000005,
          tag_enabled: true,
          mutual_tags_code: '10000',
          tag_key: '10004'
        },
        10005: {
          tag_type: 1,
          tag_name: '套利客',
          tag_description: '人工定義為套利客',
          tag_category: 1,
          sort_index: 1000006,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10005'
        },
        10007: {
          tag_type: 1,
          tag_name: '疑似套利客',
          tag_description: '人工定義為疑似套利客',
          tag_category: 1,
          sort_index: 1000007,
          tag_enabled: true,
          mutual_tags_code: '',
          tag_key: '10007'
        },
        30004: {
          tag_type: 3,
          tag_name: '贏了會衝',
          tag_description: '近15個實動日，當日贏後下次會賭更大會員',
          tag_category: 1,
          sort_index: 3000004,
          tag_enabled: true,
          mutual_tags_code: '30005,30006,30007'
        }
      }
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))

    const result1 = {
      status: {
        return_code: '0000',
        message: 'success'
      },
      result: {
        hall_id: 3820698,
        domain_id: 0,
        ag_name: 'dsball',
        user_name: 'kleinsh82',
        user_phone: '15250014111',
        register_date: '2010-05-19 23:40:36',
        user_mail: 'kleinsh@icloud.com',
        tag_str: '10001,10003,10005,10007',
        user_level_id: 20254,
        user_level: '超級VIP'
      }
    }
    const result2 = {
      result: {
        this_day_step: 4,
        data_date: '2023-11-12'
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }
    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/member/member_info':
          return Promise.resolve({ data: result1 })
        case '/api/auth/manage/member_step_detail_by_date':
          return Promise.resolve({ data: result2 })
        default:
          return error
      }
    })
    const result3 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'put').mockResolvedValue(result3)
    wrapper = shallowMount(MemberInfo, {
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
        },
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    //等待異步完成
    await flushPromises()

    expect(wrapper.findComponent(GenerateTagsBadge).exists()).toBe(true)
    //mock api回傳的tag_str有4個
    expect(wrapper.findAllComponents(GenerateTagsBadge)).toHaveLength(4)
    const apiMemberData = {
      user_name: 'kleinsh82',
      ag_name: 'dsball',
      user_level: '超級VIP',
      register_date: '2010/05/19 23:40:36',
      user_phone: '15250014111',
      user_mail: 'kleinsh@icloud.com',
      life_cycle: '即將流失回頭期'
    }
    expect(wrapper.vm.apiMemberData).toStrictEqual(apiMemberData)
  })
})
