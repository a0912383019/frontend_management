import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import UploadFile from '@/components/Filter/UploadFile.vue'
import test from '@/assets/test.csv'
import Papa from 'papaparse'

describe('UploadFile', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(UploadFile, {
      global: {
        plugins: [i18n, ElementPlus, Papa]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 檢查副檔名是否為CSV
  it('checkCSVFile function', () => {
    // 輸入副檔名為csv的檔名，預期驗證通過
    wrapper.vm.checkCSVFile('test.csv')
    expect(wrapper.vm.isCSVFile).toBe(true)

    // 輸入副檔名為word的檔名，預期驗證失敗
    wrapper.vm.checkCSVFile('test.word')
    expect(wrapper.vm.isCSVFile).toBe(false)
  })

  // 處理選擇好的檔案
  it('handleFileChange function', () => {
    let element = {
      target: {
        files: {
          0: {
            name: 'test.csv'
          }
        }
      }
    }
    wrapper.vm.handleFileChange(element)
    expect(wrapper.vm.notOkAccountData).toBe([])
    expect(wrapper.vm.errorText).toBe('')
  })
})
