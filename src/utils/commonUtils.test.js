import { it, describe, expect } from 'vitest'
import {
  getSessionStorageEntity,
  findRootHall,
  // findParentKey,
  errorRespond,
  roundDecimal,
  FormatNumber,
  addNumberColor,
  formatDate,
  formatDateDuration,
  getHallCurrencySign,
  getCurrencySignText,
  generateRGBColors,
  dynamicBackgroundColors,
  generateMultipleColors,
  checkTagUsage,
  generateTagMultiSelect,
  formatNumberWithK,
  // getRangeEveryDay,
  findHallIdMappingKey,
  extractNumberValue,
  stringToIntArray,
  sortTableData
} from '@/utils/commonUtils.js'

describe('Utility Functions', () => {
  //測試 getSessionStorageEntity 函數
  it('getSessionStorageEntity should return the correct JSON object', () => {
    const key = 'user_info'
    const user_info = {
      user_name: 'BI-Yu',
      picture: 'https://lyudd.mm.mw'
    }
    sessionStorage.setItem(key, JSON.stringify(user_info))

    const result = getSessionStorageEntity(key)
    expect(result).toEqual(user_info)
  })

  //測試 findRootHall 函數
  it('findRootHall should return the correct root hall', () => {
    const result = findRootHall('esb')
    expect(result).toStrictEqual('BBIN')
  })

  //測試 errorRespond 函數
  it('errorRespond should return the correct error message format', () => {
    const error = {
      return_code: '0001',
      message: 'no result to display',
      error_code: '210400000',
      errors: 'data not found.'
    }
    const result = errorRespond(error)
    expect(result).toStrictEqual('0001 : no result to display')
  })

  //測試 roundDecimal 函數
  it('roundDecimal should return the correct value', () => {
    const result1 = roundDecimal('187.22387', 3)
    expect(result1).toStrictEqual('187.224')

    const result2 = roundDecimal('-22.456', 1)
    expect(result2).toStrictEqual('-22.5')
  })

  //測試 FormatNumber 函數
  it('FormatNumber should return the correct value', () => {
    const result1 = FormatNumber('23187.00', '$')
    expect(result1).toStrictEqual('$23,187')

    const result2 = FormatNumber('23187.27', '$', 1)
    expect(result2).toStrictEqual('$23,187.3')
  })

  //測試 addNumberColor 函數
  it('addNumberColor should return the correct value', () => {
    const result1 = addNumberColor('123')
    expect(result1).toStrictEqual('123')

    const result2 = addNumberColor('-456')
    expect(result2).toStrictEqual('<span class="text-danger">-456</span>')
  })

  //測試 formatDate 函數
  it('formatDate should return the correct date', () => {
    const result = formatDate('2011/12/13')
    expect(result).toStrictEqual('2011-12-13')
  })

  //測試 formatDateDuration 函數
  it('formatDateDuration should return the correct date', () => {
    const result = formatDateDuration('2022/03/04 ~ 2022/05/06')
    expect(result).toStrictEqual('2022-03-04 ~ 2022-05-06')
  })

  //測試 getHallCurrencySign 函數
  it('getHallCurrencySign should return the correct value', () => {
    const result = getHallCurrencySign('BBIN', 'esb')
    expect(result).toStrictEqual('¥')
  })

  //測試 getHallCurrencySign 函數
  it('getCurrencySignText should return the correct value', () => {
    const result = getCurrencySignText('BBIN', 'esb')
    expect(result).toStrictEqual({
      currency: 'currency.currency',
      currencySign: 'currency.currency_¥',
      currencySignText: '¥'
    })
  })

  //測試 getHallCurrencySign 函數
  it('getCurrencySignText should return the correct value', () => {
    const result = generateRGBColors([245, 105, 84], 0.4)
    expect(result).toStrictEqual('rgb(245,105,84,0.4)')
  })

  //測試 dynamicBackgroundColors 函數
  it('dynamicBackgroundColors should return the correct value', () => {
    const alpha = 0.7
    const result = dynamicBackgroundColors(alpha)

    //驗證返回的字串是否符合 rgb 格式
    const rgbRegex = /^rgb\(\d+,\d+,\d+,0\.\d+\)$/
    expect(rgbRegex.test(result)).toBe(true)

    //驗證返回的透明度是否與指定的 alpha 一致
    const resultAlpha = parseFloat(result.match(/0\.\d+/)[0])
    expect(resultAlpha).toBe(alpha)
  })

  //測試 generateMultipleColors 函數
  it('generateMultipleColors should return the correct value', () => {
    const result = generateMultipleColors(22)

    //前20種是固定的
    const colorArr = {
      bg: [
        'rgb(245,105,84,0.7)',
        'rgb(0,166,90,0.7)',
        'rgb(243,156,18,0.7)',
        'rgb(0,192,239,0.7)',
        'rgb(232,208,152,0.7)',
        'rgb(60,141,188,0.7)',
        'rgb(210,214,222,0.7)',
        'rgb(128,128,192,0.7)',
        'rgb(102,204,204,0.7)',
        'rgb(194,176,97,0.7)',
        'rgb(200,100,80,0.7)',
        'rgb(51,51,102,0.7)',
        'rgb(30,222,88,0.7)',
        'rgb(102,102,102,0.7)',
        'rgb(111,22,222,0.7)',
        'rgb(255,153,204,0.7)',
        'rgb(123,99,82,0.7)',
        'rgb(255,0,204,0.7)',
        'rgb(88,140,140,0.7)',
        'rgb(51,102,51,0.7)',
        expect.any(String),
        expect.any(String)
      ],
      border: [
        'rgb(245,105,84,1)',
        'rgb(0,166,90,1)',
        'rgb(243,156,18,1)',
        'rgb(0,192,239,1)',
        'rgb(232,208,152,1)',
        'rgb(60,141,188,1)',
        'rgb(210,214,222,1)',
        'rgb(128,128,192,1)',
        'rgb(102,204,204,1)',
        'rgb(194,176,97,1)',
        'rgb(200,100,80,1)',
        'rgb(51,51,102,1)',
        'rgb(30,222,88,1)',
        'rgb(102,102,102,1)',
        'rgb(111,22,222,1)',
        'rgb(255,153,204,1)',
        'rgb(123,99,82,1)',
        'rgb(255,0,204,1)',
        'rgb(88,140,140,1)',
        'rgb(51,102,51,1)',
        expect.any(String),
        expect.any(String)
      ]
    }
    expect(result).toStrictEqual(colorArr)
  })

  //測試 checkTagUsage 函數
  it('checkTagUsage should return the correct value', () => {
    const system_config = {
      tags_config: {
        esb: {
          10000: {
            tag_type: 1,
            tag_name: '測試',
            tag_description: '測試敘述',
            tag_category: 1,
            sort_index: 1000000,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          10001: {
            tag_type: 1,
            tag_name: 'VIP客',
            tag_description: '人工定義為高價值會員',
            tag_category: 1,
            sort_index: 1000001,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          10002: {
            tag_type: 1,
            tag_name: '退場VIP',
            tag_description: '人工定義為「曾經」是高價值會員',
            tag_category: 1,
            sort_index: 1000002,
            tag_enabled: false,
            mutual_tags_code: '',
            tag_key: '10002'
          }
        }
      }
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))
    const result1 = checkTagUsage('esb', 10000)
    expect(result1).toBe(true)

    const result2 = checkTagUsage('esb', 10002)
    expect(result2).toBe(false)
  })

  //測試 generateTagMultiSelect 函數
  it('generateTagMultiSelect should return the correct value', () => {
    const system_config = {
      tags_config: {
        esb: {
          10000: {
            tag_type: 1,
            tag_name: '測試',
            tag_description: '測試敘述',
            tag_category: 1,
            sort_index: 1000000,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          10001: {
            tag_type: 1,
            tag_name: 'VIP客',
            tag_description: '人工定義為高價值會員',
            tag_category: 1,
            sort_index: 1000001,
            tag_enabled: true,
            mutual_tags_code: ''
          },
          10002: {
            tag_type: 1,
            tag_name: '退場VIP',
            tag_description: '人工定義為「曾經」是高價值會員',
            tag_category: 1,
            sort_index: 1000002,
            tag_enabled: false,
            mutual_tags_code: '',
            tag_key: '10002'
          }
        }
      }
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))
    const result = generateTagMultiSelect({ hall_name: 'esb' })

    const tag_sort_dict = {
      10000: {
        mutual_tags_code: '',
        sort_index: 1000000,
        tag_category: 1,
        tag_description: '測試敘述',
        tag_enabled: true,
        tag_key: '10000',
        tag_name: '測試',
        tag_type: 1
      },
      10001: {
        mutual_tags_code: '',
        sort_index: 1000001,
        tag_category: 1,
        tag_description: '人工定義為高價值會員',
        tag_enabled: true,
        tag_key: '10001',
        tag_name: 'VIP客',
        tag_type: 1
      }
    }
    expect(result).toStrictEqual(tag_sort_dict)
  })

  //測試 formatNumberWithK 函數
  it('formatNumberWithK should return the correct value', () => {
    const result = formatNumberWithK(40392203)
    expect(result).toStrictEqual('40392.203k')
  })

  //測試 findHallIdMappingKey 函數
  it('findHallIdMappingKey should return the correct value', () => {
    const result = findHallIdMappingKey(['BBIN'], { hall_id: 3820566, domain_id: 0 })
    expect(result).toStrictEqual('sk2')
  })

  // 測試 extractNumberValue 函數
  it('extractNumberValue should return the correct value', () => {
    const value1 = '<div class="aaa">123,443</div>'
    const result1 = extractNumberValue(value1)
    expect(result1).toBe(123443)

    const value2 = '-12,321'
    const result2 = extractNumberValue(value2)
    expect(result2).toBe(-12321)
  })

  // 測試 stringToIntArray 函數
  it('stringToIntArray should return the correct value', () => {
    const value = '10001,10003,10004'
    const result = stringToIntArray(value)
    expect(result).toStrictEqual([10001, 10003, 10004])
  })

  // 測試 sortTableData 函數
  it('sortTableData should return the correct value', () => {
    const tableData = [
      {
        count: 10,
        user_name: 'dcash888',
        total_login_count: 89
      },
      {
        count: 18,
        user_name: 'ballguest',
        total_login_count: 47
      },
      {
        count: 5,
        user_name: 'bballguest',
        total_login_count: 14
      },
      {
        count: 200,
        user_name: 'dballguest',
        total_login_count: 5
      }
    ]

    // 測試 欄位：total_login_count 排序：ascending
    const result = sortTableData({ prop: 'total_login_count', order: 'ascending', tableData })
    expect(result).toStrictEqual([
      {
        count: 200,
        user_name: 'dballguest',
        total_login_count: 5
      },
      {
        count: 5,
        user_name: 'bballguest',
        total_login_count: 14
      },
      {
        count: 18,
        user_name: 'ballguest',
        total_login_count: 47
      },
      {
        count: 10,
        user_name: 'dcash888',
        total_login_count: 89
      }
    ])

    // 測試 欄位：count 排序：descending
    const result2 = sortTableData({ prop: 'count', order: 'descending', tableData })
    expect(result2).toStrictEqual([
      {
        count: 200,
        user_name: 'dballguest',
        total_login_count: 5
      },
      {
        count: 18,
        user_name: 'ballguest',
        total_login_count: 47
      },
      {
        count: 10,
        user_name: 'dcash888',
        total_login_count: 89
      },
      {
        count: 5,
        user_name: 'bballguest',
        total_login_count: 14
      }
    ])
  })
})
