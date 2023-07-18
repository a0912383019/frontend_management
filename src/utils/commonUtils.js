import { hall_config_dict } from '@/../public/js/system_config.js'

/**
 * 取得儲存在sessionStorage中的JSON物件
 * @param {string} key sessionStorage的key值
 * @return {object} sessionStorage儲存的JSON物件
 */
export function getSessionStorageEntity(key) {
  return JSON.parse(sessionStorage.getItem(key))
}

/**
 * 返回輸入廳別的根廳別
 * @param hall_name 要搜尋的廳別
 */
export function findRootHall(hall_name) {
  let root_hall = null
  for (let root_key in hall_config_dict) {
    if (Object.prototype.hasOwnProperty.call(hall_config_dict, root_key)) {
      for (let key in hall_config_dict[root_key]) {
        if (key === hall_name) {
          root_hall = root_key
          break
        }
      }
      if (root_hall !== null) {
        break
      }
    }
  }
  return root_hall
}

/**
 * 返回輸入廳別的key
hall_config_dict_xbb['178t'] = {
  hall_code: 'demo1'
}
例如：輸入demo1返回178t
 * @param hall_name 要搜尋的廳別
 */
export function findParentKey(hall_name) {
  let root_hall = null
  for (let root_key in hall_config_dict) {
    if (Object.prototype.hasOwnProperty.call(hall_config_dict, root_key)) {
      Object.entries(hall_config_dict[root_key]).forEach((item) => {
        if (item[1]['hall_code'] === hall_name) {
          root_hall = item[0]
        }
      })
      if (root_hall !== null) {
        break
      }
    }
  }
  return root_hall
}

/**
 * 錯誤訊息通用顯示格式
 * @param {object} error 錯誤物件
 * @returns {string}
 */
export function errorRespond(error) {
  return error.return_code + ' : ' + error.message
}

/**
 * 將浮點數四捨五入至指定位數
 * @param val 要處理的數值
 * @param {int} precision 小數點後四捨五入的位數
 * @returns {string}
 */
export function roundDecimal(val, precision) {
  if (parseFloat(val)) {
    if (val < 0) {
      val = 0 - val
      return (
        0 -
        Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
          Math.pow(10, precision || 0)
      ).toString()
    } else {
      return (
        Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
        Math.pow(10, precision || 0)
      ).toString()
    }
  } else {
    return val.toString()
  }
}

/**
 * 數字加上千分位分隔符號及幣別符號
 * @param n 要加工的數值
 * @param {string} currency_sign 要加上的幣別符號
 * @param {int} precision 顯示的小數位數
 * @returns {string}
 */
export function FormatNumber(n, currency_sign = '', precision = 0) {
  n = roundDecimal(n, precision)
  let arr = n.split('.')

  // format小數點位數顯示
  if (arr[1] !== undefined) {
    if (arr[1] === '00') {
      // 若小數均為0則去掉小數不顯示
      arr.splice(1, 1)
    } else if (arr[1].substring(1, 2) === '0' && arr[1].length < 3) {
      // 若小數第二位為0且沒有第三位數則去掉不顯示
      arr[1] = arr[1].substring(0, 1)
    } else {
      if (arr[1].substring(2, 3) === '0') {
        // 若小數第三位為0則去掉不顯示
        arr[1] = arr[1].substring(0, 2)
      }
    }
  }

  let re = /(\d{1,3})(?=(\d{3})+$)/g
  return currency_sign + arr[0].replace(re, '$1,') + (arr.length == 2 ? '.' + arr[1] : '')
}

/**
 * 將數字加上顏色
 * @param {string} n 要加工的數值
 * @param class_name 要加上的class name
 */
export function addNumberColor(n, class_name = 'text-danger') {
  if (n.indexOf('-') !== -1 || n.indexOf('+') !== -1) {
    return '<span class="' + class_name + '">' + n + '</span>'
  } else {
    return n
  }
}

/**
 * 格式化日期格式為yyyy-MM-dd
 * @param {string} date 要處理的date
 * @returns {string}
 */
export function formatDate(date) {
  let date_entity = new Date(date)
  let format_date = new Intl.DateTimeFormat('zh', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date_entity)

  return format_date.replaceAll('/', '-')
}

/**
 * 格式化日期區間格式為yyyy-MM-dd ~ yyyy-MM-dd
 * @param {string} date_duration 要處理的date區間
 * @returns {string}
 */
export function formatDateDuration(date_duration) {
  let date_ary = date_duration.split('~')
  let start_date = new Date(date_ary[0].trim())
  let end_date = new Date(date_ary[1].trim())

  return formatDate(start_date) + ' ~ ' + formatDate(end_date)
}

/**
 * 取得廳別對應的幣別符號
 * @param root_hall 對應的根廳別
 * @param hall_name 對應的廳別
 * @return {string} 幣別符號
 */
export function getHallCurrencySign(root_hall, hall_name) {
  return hall_config_dict[root_hall][hall_name].currency_sign
}

/**
 * 取得廳別對應的幣別符號文字
 * @param root_hall 對應的根廳別
 * @param hall_name 對應的廳別
 * @return {string} 幣別符號文字
 */
export function getCurrencySignText(root_hall, hall_name) {
  return {
    currency: 'currency.currency',
    currencySign: `currency.currency_${hall_config_dict[root_hall][hall_name].currency_sign}`,
    currencySignText: hall_config_dict[root_hall][hall_name].currency_sign
  }
}

/**
 * chart.js隨機產生背景顏色
 * @param {int[]} rgb_ary 顏色rgb數值
 * @param {number} alpha 顏色透明度
 * @returns {string} 顏色rgb字串
 */
export function generateRGBColors(rgb_ary, alpha) {
  return 'rgb(' + rgb_ary[0] + ',' + rgb_ary[1] + ',' + rgb_ary[2] + ',' + alpha + ')'
}

/**
 * chart.js隨機產生背景顏色
 * @param {number} alpha 顏色透明度
 * @returns {string} 顏色rgb字串
 */
export function dynamicBackgroundColors(alpha) {
  let r = Math.floor(Math.random() * 255)
  let g = Math.floor(Math.random() * 255)
  let b = Math.floor(Math.random() * 255)

  return 'rgb(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}

/**
 * 檢查標籤的可用狀況
 * @param hall_name 檢查的廳別
 * @param tag_code 檢查的標籤代碼
 */
export function checkTagUsage(hall_name, tag_code) {
  let tag_description_dict = getSessionStorageEntity('system_config').tags_config[hall_name]
  return tag_description_dict[tag_code] && tag_description_dict[tag_code].tag_enabled
}

/**
 * 產生標籤多選下拉選單
 * @param {string} element_id 要設定的下拉選單id
 * @param {string} root_hall_name 要設定的標籤根廳別
 * @param {string} hall_name 要設定的標籤廳別
 * @param {number[]} tag_category 要設定的標籤種類(1:一般標籤 2:週次標籤 3:時段標籤)
 * @param {boolean} is_check_tag_usage 是否檢查標籤可用性
 */
export function generateTagMultiSelect({
  hall_name,
  tag_category = [1],
  is_check_tag_usage = true
}) {
  let tag_sort_dict = {} // 存放排序好的標籤字典
  let tag_description_dict = getSessionStorageEntity('system_config').tags_config[hall_name]
  Object.entries(tag_description_dict).map((item) => {
    //  若需檢查標籤是否禁用且標籤代碼禁用，則跳過不顯示
    if (!checkTagUsage(hall_name, item[0]) && is_check_tag_usage) {
      return
    }
    //  判斷標籤種類是否為要設定的種類，若不是則跳過不新增
    if (!tag_category.includes(item[1].tag_category)) {
      return
    }
    tag_sort_dict[item[0]] = item[1]
    tag_sort_dict[item[0]]['tag_key'] = item[0]
  })
  return tag_sort_dict
}

/**
 * 單位格式化，輸入2500, 輸出2.5k
 * @param {Number} label //要格式化的數值
 */
export function formatNumberWithK(label) {
  return Math.abs(label) >= 1000 ? label / 1000 + 'k' : label
}
