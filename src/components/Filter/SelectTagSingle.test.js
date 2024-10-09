import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'

describe('SelectTagSingle', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(SelectTagSingle, {
      global: {
        plugins: [
          ElementPlus,
          i18n,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      props: {
        lists: [
          { value: 'all', label: '全部', disabled: false },
          { value: 10001, label: 'VIP客', disabled: true },
          { value: 10003, label: '深耕客', disabled: true }
        ]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('handleInputFocus', async () => {
    await wrapper.vm.handleInputFocus()
    expect(wrapper.vm.isDropShow).toBeTruthy()
  })

  it('clearTagInputValue', async () => {
    wrapper.vm.tagInputText = '123'
    await wrapper.vm.clearTagInputValue()
    expect(wrapper.vm.tagInputText).toBe('')
  })

  it('checkAddText', () => {
    expect(wrapper.vm.checkAddText({ value: 'all' })).toBe(0)
    expect(wrapper.vm.checkAddText({ value: 'asfa' })).toBeFalsy()
  })

  it('handleTagDelete', () => {
    wrapper.vm.handleTagDelete({ index: 0 })
    expect(wrapper.vm.currentTagAry).toStrictEqual([])
    expect(wrapper.vm.selectTypeLists[0].disabled).toBeFalsy()
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

  it('handleTagAddText', async () => {
    await wrapper.vm.handleTagAddText({ value: 'all2', label: '全部', disabled: false })
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      { value: 'all', label: '全部', disabled: false, active: false },
      { value: 'all2', label: '全部', disabled: false }
    ])

    await wrapper.vm.handleTagAddText({ value: 'all2', label: '全部', disabled: false })
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      { value: 'all', label: '全部', disabled: false, active: false }
    ])

    wrapper.vm.currentTagAry = []
    await wrapper.vm.handleTagAddText({ value: 'all', label: '全部', disabled: false })
    expect(wrapper.vm.currentTagAry).toStrictEqual([
      { value: 'all', label: '全部', disabled: false }
    ])
  })

  it('props.defaultAll', () => {
    wrapper = shallowMount(SelectTagSingle, {
      global: {
        plugins: [
          ElementPlus,
          i18n,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      props: {
        lists: [
          { value: 'all', label: '全部', disabled: false },
          { value: 10001, label: 'VIP客', disabled: true },
          { value: 10003, label: '深耕客', disabled: true }
        ],
        defaultAll: '10001'
      }
    })
    expect(wrapper.vm.defaultAll).toBe('10001')
  })

  it('handleSearch', () => {
    const selector = {
      value: [
        {
          value: 'all',
          label: '全部',
          disabled: false
        },
        {
          value: 10001,
          label: 'VIP客',
          disabled: true
        },
        {
          value: 10003,
          label: '深耕客',
          disabled: true
        }
      ]
    }
    const original = {
      value: [
        {
          value: 'all',
          label: '全部',
          disabled: false
        },
        {
          value: 10001,
          label: 'VIP客',
          disabled: true
        },
        {
          value: 10003,
          label: '深耕客',
          disabled: true
        }
      ]
    }
    const searchResult = [{ value: 10003, label: '深耕客', disabled: true }]
    wrapper.vm.tagInputText = '深'
    wrapper.vm.handleSearch(selector, original)
    expect(selector.value).toStrictEqual(searchResult)

    wrapper.vm.tagInputText = ''
    wrapper.vm.handleSearch(selector, original)
    expect(selector.value).toStrictEqual(wrapper.vm.originalSelectTypeLists)
  })
})
