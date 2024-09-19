import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import UploadFile from '@/views/CustomTagsSetting/components/upload/UploadFile.vue'
import fs from 'fs'
import path from 'path'
import exp from 'constants'

// 讀取文件內容
const filePath = path.join(__dirname, 'upload-demo.csv') // 替換為實際文件路徑
const fileContent = fs.readFileSync(filePath, 'utf8')
// 創建file
const fileData = new File([fileContent], 'upload-demo.csv', { type: 'text/csv' })

describe('UploadFile', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(UploadFile, {
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
  it('handleFileChange & dialogClose', async () => {
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
    expect(wrapper.vm.errorAccountText).toStrictEqual('')
    expect(wrapper.vm.errorDateText).toStrictEqual('')
    expect(wrapper.vm.errorEnableText).toStrictEqual('')

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
    expect(wrapper.vm.fileData).toBe(null)
    expect(wrapper.vm.notOkAccountData).toStrictEqual([])
    expect(wrapper.vm.errorAccountText).toStrictEqual('')
    expect(wrapper.vm.errorDateText).toStrictEqual('')
    expect(wrapper.vm.errorEnableText).toStrictEqual('')
    expect(wrapper.vm.isCSVFile).toBe(true)
  })

  // 檢查帳號
  it('checkAccount function', () => {
    wrapper.vm.isParseFile = true
    let data = [
      { user_name: 'Gboyfly', data_date: '2024-01-01', enable: 1 },
      { user_name: 'jszch 888', data_date: '2024/01-01', enable: 1 },
      { user_name: 'a123456xu', data_date: '2024-01-01', enable: 1 },
      { user_name: 'hc6666', data_date: '2024-01-01', enable: 'z' }
    ]
    expect(wrapper.vm.isParseFile).toBeTruthy()
    expect(wrapper.vm.errorAccountText).toStrictEqual('')
    expect(wrapper.vm.errorDateText).toStrictEqual('')
    expect(wrapper.vm.errorEnableText).toStrictEqual('')

    wrapper.vm.checkFileDetail(data)

    // 預期不合格帳號
    expect(wrapper.vm.notOkAccountData[0]['name']).toStrictEqual('Gboyfly')
    expect(wrapper.vm.notOkAccountData[1]['name']).toStrictEqual('jszch 888')
    expect(wrapper.vm.errorAccountText).toStrictEqual('以下會員名稱不合規定，需為小寫英文或數字')
    expect(wrapper.vm.errorDateText).toStrictEqual('日期格式錯誤, ex: 2024-01-01')
    expect(wrapper.vm.errorEnableText).toStrictEqual('enable 格式錯誤, 0或1')
    expect(wrapper.vm.isParseFile).toBeFalsy()
  })

  // 送出
  it('handleSubmit', () => {
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
