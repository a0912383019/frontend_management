import { defineStore, storeToRefs } from 'pinia'
import { hall_config_dict } from '@/../public/js/system_config.js'
import { computed, ref } from 'vue'
import { useGlobalStore } from '@/stores'

export const useUserAccountSettingStore = defineStore('userAccountSetting', () => {
  const globalStore = useGlobalStore()

  /**
   * 產生廳別
   * @param {Array} halls 要勾選的廳
   * @returns {Array} 排序好的全廳
   */
  const generateHalls = (halls) => {
    let allHalls = []
    let accessHalls = []
    for (let root_key in hall_config_dict) {
      if (Object.prototype.hasOwnProperty.call(hall_config_dict, root_key)) {
        for (let key in hall_config_dict[root_key]) {
          allHallCode.value.push(key)

          let sortToIndex = halls.findIndex((ele) => ele === key)
          if (sortToIndex != -1) {
            accessHalls[sortToIndex] = {
              hallCode: key,
              label: root_key + ' －【' + key + '】' + hall_config_dict[root_key][key].hall_name
            }
          } else {
            allHalls.push({
              hallCode: key,
              label: root_key + ' －【' + key + '】' + hall_config_dict[root_key][key].hall_name
            })
          }
        }
      }
    }

    // 如果有不存在的廳，accessHalls的index會出現跳碼，造成非預期錯誤
    const compactArray = accessHalls.reduce((acc, curr) => {
      if (curr !== undefined) {
        acc.push(curr)
      }
      return acc
    }, [])

    allHalls = compactArray.concat(allHalls)

    return allHalls
  }

  const allHallCode = ref([])

  const selectUserTypeOptions = computed(() => {
    return appendOptions(globalStore.userTypeConfig)
  })

  const selectUserStatusOptions = computed(() => {
    return appendOptions(globalStore.userStatusConfig)
  })

  const appendOptions = (obj) => {
    let options = []
    const keys = Object.keys(obj)

    keys.forEach((key) => {
      options.push({
        value: key,
        label: obj[key]
      })
    })

    return options
  }

  return { generateHalls, allHallCode, selectUserTypeOptions, selectUserStatusOptions }
})
