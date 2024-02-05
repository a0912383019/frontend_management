import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ImportCSV from '@/components/Filter/ImportCSV.vue'
import UploadFile from '@/components/Filter/UploadFile.vue'
import { library } from '@/utils/fontawsome.js'

describe('ImportCSV', () => {
  let wrapper = null
  let result

  beforeEach(() => {
    result = {
      data: {
        result: ['ye4676', 'txphydd', 'j8888', 'jsasdg'],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result)

    wrapper = mount(ImportCSV, {
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
        }
      },
      props: {
        csvType: 1
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 取得檔案路徑
  it('handleGetFileName', async () => {
    const fileData = {
      lastModified: 1698300593556,
      lastModifiedDate: '2023/10/20',
      name: '未命名的試算表 - 工作表1 (3).csv',
      size: 115,
      type: 'text/csv',
      webkitRelativePath: ''
    }
    wrapper.vm.handleGetFileName(fileData)
    expect(wrapper.vm.filePath).toStrictEqual(fileData)

    //等待異步完成
    await flushPromises()
    expect(wrapper.vm.dialogVisible).toBe(false)
    expect(wrapper.vm.globalStore.isLoading).toBe(false)
    expect(wrapper.emitted('update:success')).toStrictEqual([
      [['ye4676', 'txphydd', 'j8888', 'jsasdg']]
    ])
  })

  // switch change
  it('handleUseCustomSwitchChange', () => {
    wrapper.vm.handleUseCustomSwitchChange(true)
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[true]])
    expect(wrapper.vm.dialogVisible).toBe(true)
  })

  it('handleClose', async () => {
    const dialogClose = vi.fn()

    wrapper.vm.dialogVisible = true

    await wrapper.vm.$nextTick()

    wrapper.vm.$refs.refUploadFile.dialogClose = dialogClose

    wrapper.vm.handleClose()

    expect(wrapper.findComponent(UploadFile).exists()).toBe(true)

    expect(wrapper.vm.switchValue).toBe(false)

    // 驗證 dialogClose 是否被調用
    expect(dialogClose).toHaveBeenCalled()
  })
})
