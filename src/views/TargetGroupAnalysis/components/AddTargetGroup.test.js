import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useTargetGroupStore } from '@/stores'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TargetData/TagGroupSetting.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import AddTargetGroup from '@/views/TargetGroupAnalysis/components/AddTargetGroup.vue'
import ElementPlus from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('AddTargetGroup.vue', () => {
  let wrapper = null
  let targetStore = null
  let spyPost = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })

    targetStore = useTargetGroupStore(pinia)
    targetStore.tagGroupList = [
      {
        custom_tag_str: '30024',
        custom_tags_id: 'e87bcd01-9a4e-4499-be29-c1c12a9fe4da',
        custom_tags_name: '1111',
        groupNameValid: true,
        originTags: '30024',
        sort: 1,
        tagGroupValid: true
      },
      {
        custom_tag_str: '60003',
        custom_tags_id: '9f750a3e-148b-468e-8d11-268c9d1baee1',
        custom_tags_name: '2222',
        groupNameValid: true,
        originTags: '60003',
        sort: 2,
        tagGroupValid: true
      },
      {
        custom_tag_str: '40001',
        custom_tags_id: 'b167c362-deea-43a6-90af-a4f1641e63a8',
        custom_tags_name: '3333',
        groupNameValid: true,
        originTags: '40001',
        sort: 3,
        tagGroupValid: true
      }
    ]

    let result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyPost = vi.spyOn(axiosGoInstance, 'post')
    spyPost.mockResolvedValueOnce(result)

    wrapper = shallowMount(AddTargetGroup, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        modelValue: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly & tableColumns', async () => {
    expect(wrapper.findComponent(TagGroupSetting).exists()).toBe(true)
    expect(wrapper.findComponent(SwitchWithTooltip).exists()).toBe(true)
    expect(wrapper.findComponent(CdpButton).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)
  })

  it('test close dialog', async () => {
    wrapper.vm.validateForm.newTargetName = 'new name'
    wrapper.vm.tagGroupList = ['not empty']
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('new name')
    expect(wrapper.vm.tagGroupList).toStrictEqual(['not empty'])
    expect(wrapper.emitted('closeDialog')).toBeFalsy()

    await wrapper.vm.handleDialogClosed()
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('')
    expect(wrapper.vm.tagGroupList).toStrictEqual([])
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('test tag group add', async () => {
    const validTable = vi.fn()
    let validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.tagGroups.validTable = validTable
    wrapper.vm.$refs.formRef.validate = validate

    // 模擬 vertifyPassed pass
    expect(wrapper.vm.tagsGroupsValid).toBe(false)
    await wrapper.vm.vertifyPassed(true)
    expect(wrapper.vm.tagsGroupsValid).toBe(true)

    // 模擬驗證通過，確認彈窗開啟
    expect(wrapper.vm.confirmSaveBox).toBe(false)
    await wrapper.vm.handleTagGroupAdd()
    expect(validTable).toHaveBeenCalled()
    expect(validate).toHaveBeenCalled()
    expect(wrapper.vm.confirmSaveBox).toBe(true)

    // 取消儲存
    await wrapper.vm.cancelSaved()
    expect(wrapper.vm.confirmSaveBox).toBe(false)

    await wrapper.vm.handleTagGroupAdd()
    expect(wrapper.vm.confirmSaveBox).toBe(true)

    // 儲存
    expect(wrapper.emitted('closeDialog')).toBeFalsy()
    expect(wrapper.emitted('addSuccess')).toBeFalsy()
    await wrapper.vm.confirmSaved()
    await flushPromises()
    let customTags = [
      {
        sort: 1,
        tags_name: '1111',
        tags_str: '30024'
      },
      {
        sort: 2,
        tags_name: '2222',
        tags_str: '60003'
      },
      {
        sort: 3,
        tags_name: '3333',
        tags_str: '40001'
      }
    ]
    expect(wrapper.vm.customTags).toStrictEqual(customTags)
    expect(spyPost).toHaveBeenCalledWith('/api/auth/target_groups', expect.any(Object))
    expect(wrapper.vm.confirmSaveBox).toBe(false)
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('')
    expect(wrapper.vm.tagGroupList).toStrictEqual([])
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
    expect(wrapper.emitted('addSuccess')).toBeTruthy()
  })
})
