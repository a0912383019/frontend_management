import { describe, expect, it, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DeleteBox from '@/views/ExportReportList/components/DeleteBox.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { createTestingPinia } from '@pinia/testing'

describe('DeleteBox.vue', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'Esball'
    }

    let result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result)

    wrapper = shallowMount(DeleteBox, {
      global: {
        plugins: [i18n]
      },
      props: {
        confirmBoxVisible: true,
        confirmBoxTopVisible: true,
        confirmInfo: {
          sourcePage: '',
          exportDate: ''
        },
        deleteLinkList: []
      }
    })
  })

  it('test components exists', () => {
    expect(wrapper.findComponent(ConfirmBox).exists()).toBeTruthy()
  })

  it('test set prop value', async () => {
    expect(wrapper.vm.visibleBox).toBeTruthy()
    expect(wrapper.vm.visibleTopBox).toBeTruthy()

    await wrapper.setProps({ confirmBoxVisible: false })
    await wrapper.setProps({ confirmBoxTopVisible: false })
    expect(wrapper.vm.visibleBox).toBeFalsy()
    expect(wrapper.vm.visibleTopBox).toBeFalsy()

    wrapper.vm.visibleBox = true
    expect(wrapper.emitted('deleteBoxClose')).toBeTruthy()

    wrapper.vm.visibleTopBox = true
    expect(wrapper.emitted('deleteBoxClose')).toBeTruthy()
  })

  it('api called', async () => {
    await wrapper.vm.deleteExecute()
    expect(spyGet).toHaveBeenCalledWith(
      '/api/auth/export_report/delete_user_export_report',
      expect.any(Object)
    )
  })
})
