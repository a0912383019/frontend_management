<script setup>
import { ref, h, watch, onMounted, onUnmounted } from 'vue'
import {
  hall_config_dict,
  logout_counter_min,
  logout_counter_sec
} from '@/../public/js/system_config.js'
import { findRootHall, getSessionStorageEntity, findParentKey } from '@/utils/commonUtils'
import { ElNotification } from 'element-plus'
import { useSystemStore } from '@/stores/system.js'
import { useGlobalStore } from '@/stores/global.js'
import { useSidebarStore } from '@/stores/sidebar.js'
import { apiRefresh, apiGoRefresh, apiGetSystemConfig } from '@/api/system.js'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t, locale: i18nLocale } = useI18n()
const systemStore = useSystemStore()
const globalStore = useGlobalStore()
const sidebarStore = useSidebarStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['time'])

const updateTime = () => {
  emit('time', Date.now())
}

const isDropOpen = ref(false) //下拉開啟狀態
const countdownInterval = ref(1000) // 每秒倒數
const idleNotificationDuration = ref(
  logout_counter_min * 60 * countdownInterval.value + logout_counter_sec * countdownInterval.value
) // 閒置時間Notification的持續時間
const refHallContent = ref(null)

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

  //若目前無選取的廳別，則預設選取第一個廳別
  // globalStore.activeHall.value = `kresball測試廳(krtt)`
  let hasHall = checkActiveHall()
  if (globalStore.activeHall.hall_name === '') {
    const { hall_name, hall_code } = hallDropdownList.value[0]
    hallDropdownList.value[0]['is_active'] = true
    globalStore.activeHall.hall_name = hall_name
    globalStore.activeHall.hall_code = hall_code
    // sessionStorage['active_hall'] = JSON.stringify(activeHall)
    return true
  } else {
    //若有選取，檢查選取的廳別有無在下拉選項內
    if (hasHall !== -1) {
      const { hall_name, hall_code } = hallDropdownList.value[hasHall]
      hallDropdownList.value[hasHall]['is_active'] = true
      globalStore.activeHall.hall_name = hall_name
      globalStore.activeHall.hall_code = hall_code
      // sessionStorage['active_hall'] = JSON.stringify(activeHall)
      return true
    } else {
      //沒有在下拉選項內，回傳false
      return false
    }
  }
}

//處理選取廳別
const changeHeaderHall = (element) => {
  isDropOpen.value = false //關閉下拉
  const { hall_name, hall_code } = element
  // 目前選取的廳別
  globalStore.activeHall.hall_name = hall_name
  globalStore.activeHall.hall_code = hall_code
  // sessionStorage['active_hall'] = JSON.stringify(activeHall)

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
}

// 倒數計時
const isDisabledResetBtn = ref(false)
const counter = ref(null)
const timeoutMinText = ref(null) // 顯示於畫面的分
const timeoutSecText = ref(null) // 顯示於畫面的秒
const timeoutMin = ref(59) // 計時器計算用的分
const timeoutSec = ref(59) // 計時器計算用的秒
const timeoutZero = (value) => {
  return value < 10 ? '0' + value : value
}

//重置時間
const resetTimer = () => {
  timeoutMinText.value = 59
  timeoutSecText.value = 59
  timeoutMin.value = 59
  timeoutSec.value = 59
}

const doAutoLogoutCounter = () => {
  // let timeoutMin = 59
  // let timeoutSec = 59
  resetTimer()
  timeoutMinText.value = timeoutZero(timeoutMin.value)
  timeoutSecText.value = timeoutZero(timeoutSec.value)
  sessionStorage.start_timer = new Date().getTime() //設定起始時間
  counter.value = setInterval(() => {
    //  若倒數時間小於設定時間，跳出提醒
    if (timeoutMin.value === logout_counter_min && timeoutSec.value === logout_counter_sec) {
      ElNotification({
        message: h('div', null, [
          h('div', { style: { marginBottom: '10px' } }, t('nav.idle')),
          h(ButtonIcon, {
            name: t('nav.reset'),
            icon: 'history',
            size: 'small',
            onClick() {
              console.log('isClick')
              resetCounter()
            }
          })
        ]),
        type: 'warning',
        duration: idleNotificationDuration.value
      })
    }
    if (timeoutMin.value >= 0) {
      if (timeoutSec.value > 0) {
        timeoutSec.value--
        timeoutSecText.value = timeoutZero(timeoutSec.value)
        if (timeoutSec.value == 0) {
          timeoutMin.value--
          if (timeoutMin.value >= 0) {
            timeoutMinText.value = timeoutZero(timeoutMin.value)
          }
        }
      } else {
        timeoutSec.value = 59
        timeoutSecText.value = timeoutZero(timeoutSec.value)
        if (timeoutMin.value >= 0) {
          timeoutMinText.value = timeoutZero(timeoutMin)
        }
      }
    } else {
      systemStore.storeLogout()
      resetTimer()
    }
    if (route.name === 'Login') {
      clearInterval(counter.value)
    }
  }, countdownInterval.value)
}

const resetCounter = (is_need_close_loading = true) => {
  return refresh(is_need_close_loading).then((reset_success) => {
    if (reset_success) {
      let redirect_home = generateHeaderHallDropdown() // 更新header廳別下拉選單
      return getSystemConfig().then(function (get_success) {
        if (get_success) {
          sidebarStore.generateSidebarMenu() // 更新sidebar item
          ElNotification.closeAll() //關閉所有ElNotification
          if (redirect_home) {
            globalStore.isLoading = false // 關閉loading視窗
            // router.push({ name: 'Home' }) // 導回至首頁
            updateTime()
          }
          return redirect_home
        }
      })
    }
  })
}

const refresh = (is_need_close_loading = true) => {
  if (typeof counter.value !== 'undefined') {
    isDisabledResetBtn.value = true //將重新計時按鈕disabled
    globalStore.isLoading = true // 顯示Loading視窗
    const refreshToken = async () => {
      try {
        const [phpResponse, goResponse] = await Promise.all([apiRefresh(), apiGoRefresh()])
        const { return_code: phpReturnCode } = phpResponse.data.status
        const { return_code: goReturnCode } = goResponse.data.status
        const { access_token: phpAccessToken } = phpResponse.data
        const {
          user_type,
          access_hall,
          token_type,
          access_token: goAccessToken
        } = goResponse.data.result
        if (phpReturnCode === '0000' && goReturnCode === '0000') {
          let user_info_entity = getSessionStorageEntity('user_info')
          user_info_entity.user_type = user_type // 更新使用者身份權限
          user_info_entity.access_hall = access_hall // 更新使用者可存取廳別
          sessionStorage.setItem('user_info', JSON.stringify(user_info_entity))
          sessionStorage.access_token = token_type + ' ' + phpAccessToken // 將新取得的access_token更新至sessionStorage
          sessionStorage.access_token_go = token_type + ' ' + goAccessToken // 將新取得的access_token更新至sessionStorage
          return Promise.resolve('Refresh success') //表示Promise物件執行成功，可往下繼續執行
        } else {
          return Promise.reject(goResponse.data.status) //表示Promise物件執行失敗，拒絕後續的程式執行
        }
      } catch (error) {
        console.error(error)
        if (error.response.status === 401) {
          // 若api回應401 http error code，導至登入頁
          sessionStorage.clear()
          localStorage.clear()
          sessionStorage.access_token = '9999' // 9999表示token有誤，需重新登入取得新token
          router.push({ name: 'Login' })
          let failMsg = `${error.response.status} : ${error.response.data.message}`
          return Promise.reject(failMsg) //表示Promise物件執行失敗，拒絕後續的程式執行
        }
        return Promise.reject(error)
      }
    }
    //  refresh成功取得api access_token後才重新倒數
    return refreshToken()
      .then(() => {
        clearInterval(counter.value)
        doAutoLogoutCounter()
        isDisabledResetBtn.value = false //將重新計時按鈕enabled
        //  若沒有導回首頁且is_need_close_loading = true才關閉loading視窗
        if (is_need_close_loading) {
          setTimeout(function () {
            // 等待0.1秒後才關閉loading視窗
            globalStore.isLoading = false // 關閉loading視窗
          }, 100)
        }
        return true
      })
      .catch((error) => {
        isDisabledResetBtn.value = false //將重新計時按鈕enabled
        globalStore.isLoading = false // 關閉loading視窗
        throw error
      })
  }
}

const getSystemConfig = () => {
  globalStore.isLoading = true // 顯示Loading視窗
  const getConfig = () => {
    return new Promise((resolve, reject) => {
      apiGetSystemConfig({
        hall_name: findParentKey(globalStore.activeHall.hall_code),
        locale: i18nLocale.value
      })
        .then((result) => {
          if (result.data.status.return_code === '0000') {
            sessionStorage.setItem('system_config', JSON.stringify(result.data.result))
            resolve('Get config success') //表示Promise物件執行成功，可往下繼續執行
          } else {
            let failMsg = {
              return_code: result.data.status.return_code,
              message: result.data.status.message
            }
            reject(failMsg) //表示Promise物件執行失敗，拒絕後續的程式執行
          }
        })
        .catch((error) => {
          reject(error) //表示Promise物件執行失敗，拒絕後續的程式執行
        })
    })
  }
  return getConfig()
    .then(() => {
      return true
    })
    .catch((failMessage) => {
      console.error(failMessage)
      globalStore.isLoading = false // 關閉loading視窗
      if (failMessage.response.status === 401) {
        // 若api回應401 http error code，導至登入頁
        sessionStorage.clear()
        localStorage.clear()
        sessionStorage.access_token = '9999' // 9999表示token有誤，需重新登入取得新的資料
        router.push({ name: 'Login' })
      } else {
        ElNotification({
          title: '',
          message: t('msg.query_failed'),
          type: 'error'
        })
      }
      return false
    })
}

//init 舊版function名稱為initI18next
const initPageNext = () => {
  if (typeof getSessionStorageEntity('user_info').user_name !== 'undefined') {
    // doAutoLogoutCounter() // 開始系統自動登出倒數
    resetCounter()
  } else {
    // 清除所有sessionStorage與localStorage
    sessionStorage.clear()
    localStorage.clear()
    sessionStorage.access_token = '9999' // 9999表示token有誤，需重新登入取得新token
    router.push({ name: 'Login' })
  }
}

// 監聽瀏覽器頁籤是否被切換
const handleVisibilityChange = (e) => {
  if (document.visibilityState === 'visible') {
    //當畫面切回當前頁籤，則取得時間計算相差時間
    const startTime = JSON.parse(sessionStorage.start_timer) //倒數計時器開始後設定的時間
    const currentTime = new Date().getTime() //頁籤切回後的時間

    const timeDifference = currentTime - startTime // 兩個相減取得相差的時間

    const minutes = Math.floor(timeDifference / (countdownInterval.value * 60)) // 計算分鐘數
    const seconds = Math.floor((timeDifference / countdownInterval.value) % 60) // 計算秒數

    //將正確時間更新到計時器上
    timeoutMinText.value = 59 - minutes
    timeoutSecText.value = 59 - seconds
    timeoutMin.value = 59 - minutes
    timeoutSec.value = 59 - seconds
  }
}

//開啟下拉
const handleDocumentClick = (e) => {
  if (e.target.closest('.targetHallBox')) {
    isDropOpen.value = !isDropOpen.value
  } else if (!refHallContent.value.contains(e.target)) {
    isDropOpen.value = false
  }
}

onMounted(() => {
  initPageNext()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  document.removeEventListener('click', handleDocumentClick)
})

//監聽語系切換
watch(
  () => i18nLocale.value,
  () => {
    initPageNext()
  }
)

// 監聽route.path，換頁後執行的內容
watch(
  () => route.path,
  () => {
    initPageNext()
  }
)

//監聽廳主切換
watch(
  () => globalStore.activeHall.hall_code,
  () => {
    if (route.path === '/home') {
      initPageNext()
    }
  }
)
</script>
<template>
  <div class="hallbox">
    <div class="hallbox__box targetHallBox">
      <div class="hallbox__label">{{ $t('nav.hall') }}</div>
      <div class="hallbox__name">
        {{ globalStore.activeHall.hall_name }}({{ globalStore.activeHall.hall_code }})
      </div>
      <div class="hallbox__dropbox">
        <div class="hallbox__arrow">
          <font-awesome-icon icon="fa-solid fa-angle-down" />
        </div>
      </div>
    </div>
    <transition name="slide-up-fade">
      <div class="hallbox__content" ref="refHallContent" v-show="isDropOpen">
        <div class="hallbox__counter">
          <div class="hallbox__counter__time">{{ timeoutMinText }}</div>
          <div class="hallbox__counter__text">{{ $t('unit.minute') }}</div>
          <div class="hallbox__counter__time">{{ timeoutSecText }}</div>
          <div class="hallbox__counter__text">{{ $t('unit.second') }}</div>
          <div class="hallbox__counter__text">{{ $t('nav.auto_logout') }}</div>
          <ButtonIcon
            :name="$t('nav.reset')"
            icon="history"
            size="small"
            color="green"
            class="hallbox__counter__button"
            :disabled="isDisabledResetBtn"
            @click="resetCounter"
          />
        </div>
        <ul class="hallbox__list ul-reset">
          <li
            v-for="(item, index) in hallDropdownList"
            :key="index"
            :class="{ active: item.is_active }"
            @click="changeHeaderHall(item)"
          >
            {{ item['hall_name'] }}({{ item['hall_code'] }})
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.hallbox {
  position: relative;
  &__box {
    display: flex;
    height: 38px;
    cursor: pointer;
  }
  &__label {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border-color: #ddd;
    color: #444;
    border-radius: 0.25rem 0 0 0.25rem;
    padding: 0.375rem 0.75rem;
  }
  &__name {
    font-weight: 700;
    padding: 0.375rem 0.75rem;
    background-color: #343a40;
  }
  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transition: all 0.4s;
  }
  &__dropbox {
    position: relative;
    width: 30px;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #343a40;
    font-size: 12px;
    cursor: pointer;
  }
  &__content {
    position: absolute;
    right: 0;
    top: 110%;
    // width: 280px;
    min-width: 285px;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  }
  &__list {
    li {
      text-align: center;
      padding: toRem(8) toRem(16);
      cursor: pointer;
      border-top: 1px solid #e9ecef;
      transition: all 0.5s;
      &:hover {
        background-color: #f8f9fa;
      }
      &.active {
        background-color: #007bff;
        color: #fff;
      }
    }
  }
  &__counter {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: toRem(8) toRem(16);
    font-size: toRem(14);
    &__time {
      font-weight: 700;
      color: $red;
    }
    &__time,
    &__text {
      margin-right: toRem(4);
      white-space: nowrap;
    }
    &__button {
      flex-shrink: 0;
      margin-left: 4px;
    }
  }
}
</style>
