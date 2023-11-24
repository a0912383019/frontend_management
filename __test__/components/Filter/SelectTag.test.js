import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { useGlobalStore } from '@/stores/global.js'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SelectTag from '@/components/Filter/SelectTag.vue'
import * as module from '@/utils/commonUtils.js'

describe('SelectTag', () => {
  let wrapper = null
  let spy
  let addEventListenerSpy = null
  let removeEventListenerSpy = null

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    //模擬呼叫getSessionStorageEntity
    module.getSessionStorageEntity.mockReturnValue({
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

    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    wrapper = shallowMount(SelectTag, {
      global: {
        plugins: [i18n, ElementPlus, router],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)
  })

  it('test function', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)
  })

  it('handleTagDelete', async () => {
    wrapper.vm.currentTagAry = [
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      }
    ]
    wrapper.vm.handleTagDelete({ index: 0 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      }
    ])

    // 測試第一筆為ＯＲ的狀況
    wrapper.vm.currentTagAry = [
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        value: 'OR',
        label: 'OR',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '贏了會衝',
        tag_description: '近15個實動日，當日贏後下次會賭更大會員',
        tag_category: 1,
        sort_index: 3000004,
        tag_enabled: true,
        mutual_tags_code: '30005,30006,30007',
        value: '30004',
        label: '贏了會衝',
        active: false
      }
    ]

    wrapper.vm.handleTagDelete({ index: 0 })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.currentTagAry).toStrictEqual([
      {
        tag_type: 3,
        tag_name: '贏了會衝',
        tag_description: '近15個實動日，當日贏後下次會賭更大會員',
        tag_category: 1,
        sort_index: 3000004,
        tag_enabled: true,
        mutual_tags_code: '30005,30006,30007',
        value: '30004',
        label: '贏了會衝',
        active: false
      }
    ])
  })

  it('handleTagAddText', async () => {
    wrapper.vm.handleTagAddText({ value: 'OR' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTagAry).toStrictEqual([{ value: 'OR', label: 'OR', active: false }])

    wrapper.vm.handleTagAddText({
      value: 1,
      label: '人工',
      active: false
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tagTextAry).toStrictEqual([
      {
        value: 1,
        label: '人工',
        active: false
      }
    ])
    expect(wrapper.vm.tagInputText).toBe('')
  })

  it('handleInputKeyup', async () => {
    wrapper.vm.tagTextAry = [
      {
        value: 1,
        label: '人工',
        active: false
      },
      {
        value: 1,
        label: '一般',
        active: true
      }
    ]
    wrapper.vm.tagInputTextOld = ''
    wrapper.vm.handleInputKeyup({ keyCode: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tagTextAry).toStrictEqual([
      {
        value: 1,
        label: '人工',
        active: false
      }
    ])

    wrapper.vm.handleInputKeyup({ keyCode: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tagTextAry).toStrictEqual([
      {
        value: 1,
        label: '人工',
        active: true
      }
    ])

    wrapper.vm.currentTagAry = [
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '週二客',
        tag_description: '會員近15個實動日，遊玩『週二』總下注最多者',
        tag_category: 2,
        sort_index: 3000024,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30024',
        label: '週二客',
        active: false
      },
      {
        tag_type: 4,
        tag_name: '潛在價值客',
        tag_description: '潛在VIP (市場說不是，但模型說是VIP者)',
        tag_category: 1,
        sort_index: 4000010,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '40002',
        label: '潛在價值客',
        active: true
      }
    ]
    wrapper.vm.tagTextAry = []
    wrapper.vm.tagInputTextOld = ''
    wrapper.vm.handleInputKeyup({ keyCode: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '週二客',
        tag_description: '會員近15個實動日，遊玩『週二』總下注最多者',
        tag_category: 2,
        sort_index: 3000024,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30024',
        label: '週二客',
        active: false
      }
    ])

    wrapper.vm.handleInputKeyup({ keyCode: 8 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '週二客',
        tag_description: '會員近15個實動日，遊玩『週二』總下注最多者',
        tag_category: 2,
        sort_index: 3000024,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30024',
        label: '週二客',
        active: true
      }
    ])
  })

  it('handleInputFocus', async () => {
    wrapper.vm.handleInputFocus()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isDropShow).toBe(true)
  })

  it('clearTagInputValue', async () => {
    wrapper.vm.clearTagInputValue()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tagInputText).toBe('')
  })

  it('changeGenerateCategoryLists', async () => {
    wrapper.vm.selectTypeValue = 1
    wrapper.vm.changeGenerateCategoryLists()
    await wrapper.vm.$nextTick()
    const result = [
      {
        label: '一般',
        value: 1
      }
    ]
    expect(wrapper.vm.selectCategoryValue).toBe('')
    expect(wrapper.vm.selectCategoryLists).toStrictEqual(result)
    expect(wrapper.vm.originalSelectCategoryLists).toStrictEqual(result)

    wrapper.vm.selectTypeValue = 3
    wrapper.vm.changeGenerateCategoryLists()
    await wrapper.vm.$nextTick()
    const result2 = [
      { value: 1, label: '一般' },
      { value: 2, label: '週次' },
      { value: 3, label: '時段' },
      { value: 4, label: '最後平均單筆存款' },
      { value: 5, label: '最大投注金額' },
      { value: 6, label: '有效投注下降幅度' },
      { value: 7, label: '常用入款方式' },
      { value: 9, label: '常登入地區(省)' }
    ]
    expect(wrapper.vm.selectCategoryLists).toStrictEqual(result2)
    expect(wrapper.vm.originalSelectCategoryLists).toStrictEqual(result2)
  })

  it('handleDocumentClick', async () => {
    wrapper.vm.dropClass = 'testClass'
    await wrapper.vm.$nextTick()
    const etarget = {
      target: document.createElement('div')
    }
    etarget.target.className = 'dropClass'
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.isDropShow).toBe(false)

    etarget.target.className = 'testClass'
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.isDropShow).toBe(true)
  })

  it('watch tagTextAry', async () => {
    wrapper.vm.tagTextAry = [
      {
        value: 1,
        label: '人工',
        active: false
      },
      {
        value: 1,
        label: '一般',
        active: false
      },
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      }
    ]
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.currentTagAry).toStrictEqual([
      {
        tag_type: 1,
        tag_name: 'VIP客',
        tag_description: '人工定義為高價值會員',
        tag_category: 1,
        sort_index: 1000001,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10001',
        label: 'VIP客',
        active: false
      }
    ])
  })

  it('watch currentTagAry', async () => {
    wrapper.vm.currentTagAry = [
      {
        tag_type: 1,
        tag_name: '測試',
        tag_description: '測試敘述',
        tag_category: 1,
        sort_index: 1000000,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '10000',
        label: '測試',
        active: false
      },
      {
        value: 'OR',
        label: 'OR',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '贏了會衝',
        tag_description: '近15個實動日，當日贏後下次會賭更大會員',
        tag_category: 1,
        sort_index: 3000004,
        tag_enabled: true,
        mutual_tags_code: '30005,30006,30007',
        value: '30004',
        label: '贏了會衝',
        active: false
      },
      {
        tag_type: 3,
        tag_name: '週一客',
        tag_description: '會員近15個實動日，遊玩『週一』總下注最多者',
        tag_category: 2,
        sort_index: 3000023,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30023',
        label: '週一客',
        active: false
      }
    ]

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['10000;30004,30023']])
  })

  it('watch selectCategoryValue', async () => {
    wrapper.vm.transformTagsConfig()
    wrapper.vm.selectTypeValue = 1
    await wrapper.vm.$nextTick()
    wrapper.vm.selectCategoryValue = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectTagLists).toStrictEqual([
      {
        label: '測試',
        mutual_tags_code: '',
        sort_index: 1000000,
        tag_category: 1,
        tag_description: '測試敘述',
        tag_enabled: true,
        tag_name: '測試',
        tag_type: 1,
        value: '10000'
      },
      {
        label: 'VIP客',
        mutual_tags_code: '',
        sort_index: 1000001,
        tag_category: 1,
        tag_description: '人工定義為高價值會員',
        tag_enabled: true,
        tag_name: 'VIP客',
        tag_type: 1,
        value: '10001'
      },
      {
        label: '測試',
        mutual_tags_code: '',
        sort_index: 1000000,
        tag_category: 1,
        tag_description: '測試敘述',
        tag_enabled: true,
        tag_name: '測試',
        tag_type: 1,
        value: '10000'
      },
      {
        label: 'VIP客',
        mutual_tags_code: '',
        sort_index: 1000001,
        tag_category: 1,
        tag_description: '人工定義為高價值會員',
        tag_enabled: true,
        tag_name: 'VIP客',
        tag_type: 1,
        value: '10001'
      }
    ])
  })

  it('watch tagInputText', async () => {
    // 標籤類型
    const data1 = [
      { value: 1, label: '人工' },
      { value: 3, label: '規則' },
      { value: 4, label: '機器' },
      { value: 5, label: '自訂' }
    ]
    const result1 = [{ value: 1, label: '人工' }]

    wrapper.vm.tagInputText = '人'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectTypeLists).toStrictEqual(result1)

    wrapper.vm.tagInputText = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectTypeLists).toStrictEqual(data1)

    // 標籤種類
    const data2 = [
      {
        value: 1,
        label: '一般'
      },
      {
        value: 2,
        label: '週次'
      },
      {
        value: 3,
        label: '時段'
      },
      {
        value: 4,
        label: '最後平均單筆存款'
      },
      {
        value: 5,
        label: '最大投注金額'
      },
      {
        value: 6,
        label: '有效投注下降幅度'
      },
      {
        value: 7,
        label: '常用入款方式'
      },
      {
        value: 9,
        label: '常登入地區(省)'
      }
    ]
    const result2 = [
      {
        value: 2,
        label: '週次'
      }
    ]
    wrapper.vm.tagTextAry = ['A']

    await wrapper.vm.$nextTick()
    wrapper.vm.tagInputText = '週'
    wrapper.vm.selectCategoryLists = data2
    wrapper.vm.originalSelectCategoryLists = data2
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectCategoryLists).toStrictEqual(result2)

    // 選擇標籤
    const data3 = [
      {
        tag_type: 3,
        tag_name: '週一客',
        tag_description: '會員近15個實動日，遊玩『週一』總下注最多者',
        tag_category: 2,
        sort_index: 3000023,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30023',
        label: '週一客'
      },
      {
        tag_type: 3,
        tag_name: '週二客',
        tag_description: '會員近15個實動日，遊玩『週二』總下注最多者',
        tag_category: 2,
        sort_index: 3000024,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30024',
        label: '週二客'
      },
      {
        tag_type: 3,
        tag_name: '週三客',
        tag_description: '會員近15個實動日，遊玩『週三』總下注最多者',
        tag_category: 2,
        sort_index: 3000025,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30025',
        label: '週三客'
      },
      {
        tag_type: 3,
        tag_name: '週四客',
        tag_description: '會員近15個實動日，遊玩『週四』總下注最多者',
        tag_category: 2,
        sort_index: 3000026,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30026',
        label: '週四客'
      },
      {
        tag_type: 3,
        tag_name: '週五客',
        tag_description: '會員近15個實動日，遊玩『週五』總下注最多者',
        tag_category: 2,
        sort_index: 3000027,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30027',
        label: '週五客'
      },
      {
        tag_type: 3,
        tag_name: '週六客',
        tag_description: '會員近15個實動日，遊玩『週六』總下注最多者',
        tag_category: 2,
        sort_index: 3000028,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30028',
        label: '週六客'
      },
      {
        tag_type: 3,
        tag_name: '週日客',
        tag_description: '會員近15個實動日，遊玩『週日』總下注最多者',
        tag_category: 2,
        sort_index: 3000029,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30029',
        label: '週日客'
      }
    ]
    const result3 = [
      {
        tag_type: 3,
        tag_name: '週二客',
        tag_description: '會員近15個實動日，遊玩『週二』總下注最多者',
        tag_category: 2,
        sort_index: 3000024,
        tag_enabled: true,
        mutual_tags_code: '',
        value: '30024',
        label: '週二客'
      }
    ]

    wrapper.vm.tagTextAry = ['A', 'B']
    await wrapper.vm.$nextTick()

    wrapper.vm.tagInputText = '二'
    wrapper.vm.selectTagLists = data3
    wrapper.vm.originalSelectTagLists = data3
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectTagLists).toStrictEqual(result3)
  })
})
