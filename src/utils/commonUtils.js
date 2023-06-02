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
