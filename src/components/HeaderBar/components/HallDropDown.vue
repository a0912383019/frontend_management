<script setup>
import { ref, onMounted } from 'vue'
import { hall_config_dict } from '@/../public/js/system_config.js'
import { findRootHall, getSessionStorageEntity } from '@/utils/commonUtils'
import { useGlobalStore } from '@/stores/global.js'
import { useSystemStore } from '@/stores/system.js'
import { useSidebarStore } from '@/stores/sidebar.js'
import { useRouter } from 'vue-router'

const globalStore = useGlobalStore()
const systemStore = useSystemStore()
const sidebarStore = useSidebarStore()
const router = useRouter()

const emit = defineEmits(['update:drop'])

const hallDropdownList = ref([]) //廳別下拉選單選項

//檢查目前選取的廳別是否存在廳別下拉選項內
const checkActiveHall = () => {
  const activeHallName = globalStore.activeHall.hall_name
  return hallDropdownList.value.findIndex((item) => {
    return item['hall_name'] === activeHallName
  })
}

//產生廳別下拉選單選項
const generateHeaderHallDropdown = () => {
  //取得storage內的可檢視廳別
  let hallAry = getSessionStorageEntity('user_info').access_hall.split(',')
  //清空廳別下拉選單選項
  hallDropdownList.value = []
  //根據storage內的可檢視廳別，產生出對應的廳別資料
  for (let i = 0; i < hallAry.length; i++) {
    const hallData = hall_config_dict[findRootHall(hallAry[i])][hallAry[i]]
    hallDropdownList.value.push(hallData)
    //將選取狀態預設為false
    hallDropdownList.value[i]['is_active'] = false
  }

  let hasHall = checkActiveHall()
  //若有選取，檢查選取的廳別有無在下拉選項內
  if (hasHall !== -1) {
    const { hall_name, hall_code } = hallDropdownList.value[hasHall]
    hallDropdownList.value[hasHall]['is_active'] = true
    globalStore.activeHall.hall_name = hall_name
    globalStore.activeHall.hall_code = hall_code
  } else {
    systemStore.storeLogout()
  }
}

//處理選取廳別
const changeHeaderHall = (element) => {
  const { hall_name, hall_code } = element
  // 目前選取的廳別
  globalStore.activeHall.hall_name = hall_name
  globalStore.activeHall.hall_code = hall_code

  // 將所有廳別選取狀態取消，並選取目前的廳別
  const updatedDropdownList = Object.values(hallDropdownList.value).map((item) => {
    const isCurrentHall = item.hall_name === hall_name
    return { ...item, is_active: isCurrentHall }
  })

  // 更新 hallDropdownList.value
  hallDropdownList.value = updatedDropdownList

  // 依據所選廳別產生對應的sidebar功能
  sidebarStore.generateSidebarMenu()

  //導回首頁
  router.push({ path: '/home' })

  // 關閉下拉
  emit('update:drop', false)
}

onMounted(() => {
  generateHeaderHallDropdown()
})
</script>
<template>
  <ul class="hallbox__list ul-reset limit-height">
    <li
      v-for="(item, index) in hallDropdownList"
      :key="index"
      :class="[{ active: item.is_active }, 'font-medium']"
      @click="changeHeaderHall(item)"
    >
      {{ item['hall_name'] }}({{ item['hall_code'] }})
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.hallbox {
  &__list {
    li {
      text-align: left;
      padding: toRem(8) toRem(16);
      cursor: pointer;
      border-top: 1px solid #e9ecef;
      transition: all 0.5s;
      &:hover {
        color: #4f84cf;
        background-color: rgba(79, 132, 207, 0.1);
      }
      &.active {
        background-color: #007bff;
        color: #fff;
      }
    }
  }
}

.limit-height {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
