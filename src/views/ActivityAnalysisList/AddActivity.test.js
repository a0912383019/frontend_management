import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import AddActivity from '@/views/ActivityAnalysisList/AddActivity.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('AddActivity', () => {
  let wrapper = null
  let spyPost

  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })

    const postResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyPost = vi.spyOn(axiosGoInstance, 'post')
    spyPost.mockResolvedValue(postResult)

    wrapper = shallowMount(AddActivity, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          },
          ElForm: {
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

  it('components', async () => {
    expect(wrapper.findComponent(CdpButton).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)
  })

  it('rules data', () => {
    const rules = {
      activityName: [
        {
          message: '請輸入活動名稱',
          required: true
        },
        {
          max: 100,
          message: '活動名稱過長(最多為100個字元)'
        }
      ],
      description: [
        {
          max: 1000,
          message: '活動說明內容過長(最多為1000個字元)'
        }
      ],
      purpose: [
        {
          max: 100,
          message: '活動目的內容過長(最多為100個字元)'
        }
      ]
    }
    expect(wrapper.vm.rules).toStrictEqual(rules)
  })

  it('validActivityAdd', async () => {
    let activityName = ' aaa '
    let purpose = ' bbb '
    let description = ' ccc '
    wrapper.vm.activityForm.activityName = activityName
    wrapper.vm.activityForm.purpose = purpose
    wrapper.vm.activityForm.description = description

    let validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.formRef.validate = validate

    let validSubActivities = vi.fn().mockReturnValue(true)
    wrapper.vm.$refs.childRef.validSubActivities = validSubActivities

    const subActivitues = [{ name: 'jimmy', offer_id: 22, original_id: 33 }]
    let getSubActivities = vi.fn().mockReturnValue(subActivitues)
    wrapper.vm.$refs.childRef.getSubActivities = getSubActivities

    wrapper.vm.validActivityAdd()
    expect(wrapper.vm.activityForm.activityName).toStrictEqual(activityName.trim())
    expect(wrapper.vm.activityForm.purpose).toStrictEqual(purpose.trim())
    expect(wrapper.vm.activityForm.description).toStrictEqual(description.trim())

    await flushPromises()
    expect(wrapper.vm.subActivities).toStrictEqual(subActivitues)
    expect(wrapper.vm.confirmBox).toBeTruthy()
  })

  it('cancelSaved & confirmSaved', async () => {
    wrapper.vm.confirmBox = true
    wrapper.vm.cancelSaved()
    expect(wrapper.vm.confirmBox).toBeFalsy()
    expect(spyPost).toBeCalledTimes(0)

    wrapper.vm.confirmBox = true
    expect(wrapper.emitted('addSuccess')).toBeFalsy()
    wrapper.vm.confirmSaved()
    await flushPromises()
    expect(wrapper.vm.confirmBox).toBeFalsy()
    expect(spyPost).toBeCalledTimes(1)
    expect(spyPost).toHaveBeenCalledWith('/api/auth/activity', expect.any(Object))
    expect(wrapper.emitted('addSuccess')).toBeTruthy()
  })

  it('initActivity & handleDialogClosed', async () => {
    const activityName = 'aaa'
    const purpose = 'bbb'
    const description = 'ccc'
    wrapper.vm.activityForm.activityName = activityName
    wrapper.vm.activityForm.purpose = purpose
    wrapper.vm.activityForm.description = description
    expect(wrapper.vm.activityForm.activityName).toStrictEqual(activityName)
    expect(wrapper.vm.activityForm.purpose).toStrictEqual(purpose)
    expect(wrapper.vm.activityForm.description).toStrictEqual(description)
    const subActivities = ['subdata']
    wrapper.vm.subActivities = subActivities
    expect(wrapper.vm.subActivities).toStrictEqual(subActivities)
    expect(wrapper.emitted('closeDialog')).toBeFalsy()

    // 呼叫 handleDialogClosed
    wrapper.vm.handleDialogClosed()
    await flushPromises()
    expect(wrapper.vm.activityForm.activityName).toStrictEqual('')
    expect(wrapper.vm.activityForm.purpose).toStrictEqual('')
    expect(wrapper.vm.activityForm.description).toStrictEqual('')
    expect(wrapper.vm.subActivities).toStrictEqual([])
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('organizeActivityDatail', () => {
    let subActivities = [
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33,
        other: null
      },
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33,
        other: null
      }
    ]
    wrapper.vm.subActivities = subActivities

    const subDetails = wrapper.vm.organizeActivityDatail()
    expect(subDetails).toStrictEqual([
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33
      },
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33
      }
    ])
  })
})
