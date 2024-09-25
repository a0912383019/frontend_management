import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { useGlobalStore } from '@/stores/global.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ElementPlus from 'element-plus'
import ImportCSV from '@/views/CustomTagsSetting/components/upload/ImportCSV.vue'
import UploadFile from '@/views/CustomTagsSetting/components/upload/UploadFile.vue'

describe('ImportCSV', () => {
  let wrapper = null
  let spyPut
  let globalStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    globalStore = useGlobalStore(pinia)

    globalStore.isLoading = true

    let result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyPut = vi.spyOn(axiosGoInstance, 'put').mockResolvedValue(result)

    wrapper = shallowMount(ImportCSV, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        tagCode: '50001'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('expect components exists', () => {
    expect(wrapper.findComponent(UploadFile).exists()).toBeTruthy()
  })

  it('handleGetFileName & handleClose & uploadCustomTagsList', async () => {
    const dialogClose = vi.fn()
    wrapper.vm.$refs.refUploadFile.dialogClose = dialogClose
    const fileName = '4040404.csv'
    expect(spyPut).toBeCalledTimes(0)
    expect(globalStore.isLoading).toBeTruthy()
    expect(dialogClose).toBeCalledTimes(0)
    expect(wrapper.emitted('closeImportCsv')).toBeFalsy()
    expect(wrapper.emitted('update:success')).toBeFalsy()

    wrapper.vm.handleGetFileName(fileName)

    //等待異步完成
    await flushPromises()
    expect(spyPut).toBeCalledTimes(1)
    expect(globalStore.isLoading).toBeFalsy()
    expect(dialogClose).toBeCalledTimes(1)
    expect(wrapper.emitted('closeImportCsv')).toBeTruthy()
    expect(wrapper.emitted('update:success')).toBeTruthy()
  })
})
