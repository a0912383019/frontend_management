import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import UploadFile from '@/components/Filter/UploadFile.vue'
import fs from 'fs'

// 讀取文件內容
const filePath = '__test__/upload-demo.csv' // 替換為實際文件路徑
const fileContent = fs.readFileSync(filePath, 'utf8')
// 創建file
const fileData = new File([fileContent], 'upload-demo.csv', { type: 'text/csv' })

describe('UploadFile', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(UploadFile, {
      global: {
        plugins: [i18n, ElementPlus]
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
  it('handleFileChange function', async () => {
    // 讀取內容符合格式的檔案
    let element = {
      target: {
        files: {
          0: fileData
        }
      }
    }
    wrapper.vm.handleFileChange(element)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.notOkAccountData).toStrictEqual([])
    expect(wrapper.vm.errorText).toBe('')

    // 檔案為undefiend
    let elementUndefined = {
      target: {
        files: {}
      }
    }
    wrapper.vm.handleFileChange(elementUndefined)
    await wrapper.vm.$nextTick()

    // file undefined 執行 dialogClose
    expect(wrapper.vm.fileName).toBe('')
    expect(wrapper.vm.fileData).toBe('')
    expect(wrapper.vm.notOkAccountData).toStrictEqual([])
    expect(wrapper.vm.errorText).toBe('')
    expect(wrapper.vm.isCSVFile).toBe(true)
  })

  // 檢查帳號
  it('checkAccount function', () => {
    let data = [
      { user_name: 'Gboyfly' },
      { user_name: 'jszch 888' },
      { user_name: 'a123456xu' },
      { user_name: 'hc6666' }
    ]
    wrapper.vm.checkAccount(data)

    // 預期不合格帳號
    expect(wrapper.vm.notOkAccountData[0]['name']).toBe('Gboyfly')
    expect(wrapper.vm.notOkAccountData[1]['name']).toBe('jszch 888')
  })

  // 送出
  it('handleSubmit function', () => {
    wrapper.vm.fileData = {
      name: 'demo.csv'
    }
    wrapper.vm.isCSVFile = true
    wrapper.vm.handleSubmit()
    expect(wrapper.emitted('update:files')).toStrictEqual([
      [
        {
          name: 'demo.csv'
        }
      ]
    ])
  })
})
