import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useTargetGroupStore } from '@/stores'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TargetData/TagGroupSetting.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import AddGroup from '@/components/Button/AddButton.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('TagGroupSetting.vue', () => {
  let wrapper = null
  let targetStore

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(552455))

    const pinia = createTestingPinia({ createSpy: vi.fn })

    targetStore = useTargetGroupStore(pinia)
    targetStore.tagGroupList = [
      {
        custom_tags_id: '0',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ]

    wrapper = shallowMount(TagGroupSetting, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly & tableColumns', async () => {
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableColumns).toStrictEqual([
      {
        align: 'center',
        headerAlign: 'center',
        label: '標籤群組名稱',
        minWidth: '20%',
        prop: 'tag_groups_name'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '包含標籤',
        minWidth: '74%',
        prop: 'include_tags'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '6%',
        prop: 'delete'
      }
    ])
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(AddGroup).exists()).toBe(true)
  })

  it('test add groups & delete groups', async () => {
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ])

    await wrapper.vm.addTagGroup()
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      },
      {
        custom_tags_id: '552455',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ])

    await wrapper.vm.deleteGroup(1)
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ])
  })

  it('test validTable', async () => {
    // 標籤族群名稱&包含標籤空白
    await wrapper.vm.validTable()
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '',
        custom_tags_name: '',
        groupNameValid: false,
        tagGroupValid: false,
        validType: 'onlySpace'
      }
    ])
    expect(wrapper.emitted('vertifyPassed')).toStrictEqual([[false]])

    // 標籤族群名稱超過10個字元
    targetStore.tagGroupList = [
      {
        custom_tags_id: '0',
        custom_tag_str: '10001',
        custom_tags_name: '01234567890',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ]
    await wrapper.vm.validTable()
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '10001',
        custom_tags_name: '01234567890',
        groupNameValid: false,
        tagGroupValid: true,
        validType: 'overTen'
      }
    ])
    expect(wrapper.emitted('vertifyPassed')).toStrictEqual([[false], [false]])

    // 驗證通過
    targetStore.tagGroupList = [
      {
        custom_tags_id: '0',
        custom_tag_str: '10001',
        custom_tags_name: '0123456789',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ]
    await wrapper.vm.validTable()
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tags_id: '0',
        custom_tag_str: '10001',
        custom_tags_name: '0123456789',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ])
    expect(wrapper.emitted('vertifyPassed')).toStrictEqual([[false], [false], [true]])
  })
})
