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
