import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useTargetGroupStore } from '@/stores'
import TargetData from '@/views/TargetGroupAnalysis/components/TargetData/TargetData.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TargetData/TagGroupSetting.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('TargetData.vue', () => {
  let wrapper = null
  let targetStore = null
  let spyGet = null
  let spyPut = null
  let tagGroupList = []

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    targetStore = useTargetGroupStore(pinia)
    targetStore.tagGroupList = []

    let result1 = {
      data: {
        result: {
          can_operate: true,
          created_time: '2024-05-27 02:33:51',
          is_open: true,
          member_name: 'BI-CDP-Yu_Lan',
          target_group_id: '8e393c07-835c-4a48-81b6-fb3edaa19dd5',
          target_group_name: 'yuuyuuuyyuyuyuuyuyu',
          updated_time: '2024-05-27 03:47:52',
          updater_id: 249,
          updater_name: 'BI-CDP-Yu_Lan',
          uploader_id: 249,
          custom_tags_data: [
            {
              custom_tags_id: 'e87bcd01-9a4e-4499-be29-c1c12a9fe4da',
              custom_tags_name: '1111',
              custom_tag_str: '30024',
              sort: 1
            },
            {
              custom_tags_id: '9f750a3e-148b-468e-8d11-268c9d1baee1',
              custom_tags_name: '2222',
              custom_tag_str: '60003',
              sort: 2
            },
            {
              custom_tags_id: 'b167c362-deea-43a6-90af-a4f1641e63a8',
              custom_tags_name: '3333',
              custom_tag_str: '40001',
              sort: 3
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    let result2 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)

    spyPut = vi.spyOn(axiosGoInstance, 'put')
    spyPut.mockResolvedValueOnce(result2)

    tagGroupList = [
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

    wrapper = shallowMount(TargetData, {
      global: {
        plugins: [i18n, ElementPlus],
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
      },
      props: {
        targetId: 'tt-131'
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

  it('test api called correctly', async () => {
    await flushPromises()
    expect(spyGet).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.vm.targetId}`,
      expect.any(Object)
    )
    const apiTargetData = {
      createdTime: '2024/05/27 02:33:51',
      memberName: 'BI-CDP-Yu_Lan',
      targetName: 'yuuyuuuyyuyuyuuyuyu',
      updatedTime: '2024/05/27 03:47:52',
      updaterName: 'BI-CDP-Yu_Lan'
    }
    expect(wrapper.vm.apiTargetData).toStrictEqual(apiTargetData)
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('yuuyuuuyyuyuyuuyuyu')
    expect(targetStore.tagGroupList).toStrictEqual(tagGroupList)
  })

  it('test edit variables', async () => {
    // 點擊編輯
    expect(wrapper.vm.edit).toBe(false)
    await wrapper.vm.handleTagIsEdit()
    expect(wrapper.vm.forTargetNameClass).toBe(false)
    expect(wrapper.vm.edit).toBe(true)

    // 取消編輯->彈出彈框
    await wrapper.vm.handleEditCancel()
    expect(wrapper.vm.cancelEditBox).toBe(true)
    // 取消
    await wrapper.vm.cancelExecute()
    expect(wrapper.vm.cancelEditBox).toBe(false)

    // 取消編輯->彈出彈框
    await wrapper.vm.handleEditCancel()
    expect(wrapper.vm.cancelEditBox).toBe(true)

    // 確認
    wrapper.vm.validateForm.newTargetName = 'newTarget'
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('newTarget')
    await wrapper.vm.confirmExecute()
    expect(wrapper.vm.edit).toBe(false)
    expect(wrapper.vm.cancelEditBox).toBe(false)
    expect(wrapper.vm.validateForm.newTargetName).toStrictEqual('yuuyuuuyyuyuyuuyuyu')
    expect(wrapper.vm.isOpen).toBe(true)
    expect(targetStore.tagGroupList).toStrictEqual(tagGroupList)
  })

  it('test form vaild & update api', async () => {
    // 點擊編輯
    expect(wrapper.vm.edit).toBe(false)
    await wrapper.vm.handleTagIsEdit()
    expect(wrapper.vm.forTargetNameClass).toBe(false)
    expect(wrapper.vm.edit).toBe(true)

    const validTable = vi.fn()
    let validate = vi.fn((callback) => callback(false))
    wrapper.vm.$refs.tagGroups.validTable = validTable
    wrapper.vm.$refs.formRef.validate = validate

    // 模擬 valid = false && validateForm.newTargetName.trim() !== ''
    await wrapper.vm.handleEditConfirm()
    expect(validTable).toHaveBeenCalled()
    expect(validate).toHaveBeenCalled()
    expect(wrapper.vm.forTargetNameClass).toBe(true)

    // 模擬標籤群組 valid
    expect(wrapper.vm.tagsGroupsValid).toBe(false)
    await wrapper.vm.vertifyPassed(true)
    expect(wrapper.vm.tagsGroupsValid).toBe(true)

    validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.formRef.validate = validate

    // 模擬 valid && tagsGroupsValid.value pass
    expect(wrapper.vm.confirmEditBox).toBe(false)
    await wrapper.vm.handleEditConfirm()
    expect(wrapper.vm.confirmEditBox).toBe(true)

    // 取消儲存
    await wrapper.vm.cancelSaved()
    expect(wrapper.vm.confirmEditBox).toBe(false)

    // 模擬 valid && tagsGroupsValid.value pass
    await wrapper.vm.handleEditConfirm()
    expect(wrapper.vm.confirmEditBox).toBe(true)

    await wrapper.vm.confirmSaved()
    expect(spyPut).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.vm.targetId}`,
      expect.any(Object)
    )
    expect(wrapper.vm.confirmEditBox).toBe(false)
  })
})
