<script setup>
import { ref, h, watch, onMounted, onUnmounted } from 'vue'
import { logout_counter_min, logout_counter_sec } from '@/../public/js/system_config.js'
import { ElNotification } from 'element-plus'
import { useSystemStore } from '@/stores/system.js'
import { useGlobalStore } from '@/stores/global.js'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const systemStore = useSystemStore()
const { storeGetSystemConfig, storeRefreshToken } = systemStore
const route = useRoute()

const countdownInterval = ref(1000) // 每秒倒數

const idleNotificationDuration = ref(
  logout_counter_min * 60 * countdownInterval.value + logout_counter_sec * countdownInterval.value
) // 閒置時間Notification的持續時間

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
  ElNotification.closeAll() //關閉所有ElNotification
}

// 倒數計時函數
const countDown = () => {
  if (timeoutSec.value > 0) {
    timeoutSec.value--
  } else {
    timeoutSec.value = 59
    timeoutMin.value--
    if (timeoutMin.value >= 0) {
      timeoutMinText.value = timeoutZero(timeoutMin.value)
    }
  }
  timeoutSecText.value = timeoutZero(timeoutSec.value)
}

// 設定倒數計時
const setCountDownTimer = () => {
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
              restartTimer(true)
            }
          })
        ]),
        type: 'warning',
        duration: idleNotificationDuration.value
      })
    }
    if (timeoutMin.value >= 0) {
      countDown()
    } else {
      systemStore.storeLogout()
      clearInterval(counter.value)
    }
  }, countdownInterval.value)
}

// 監聽瀏覽器頁籤是否被切換，頁籤切換後更新目前時間
const handleVisibilityChange = () => {
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

// 重新計時
const restartTimer = async (type) => {
  clearInterval(counter.value)
  isDisabledResetBtn.value = true //將重新計時按鈕disabled
  if (type) {
    await storeGetSystemConfig()
    await storeRefreshToken()
  }
  setCountDownTimer()
  isDisabledResetBtn.value = false
}

//監聽廳主切換
watch(
  () => globalStore.activeHall.hall_code,
  () => {
    if (sessionStorage.system_config !== undefined) {
      restartTimer(true)
    }
  }
)

//監聽語系切換
watch(
  () => i18nLocale.value,
  () => {
    restartTimer(true)
  }
)

// 監聽route.path，換頁後執行的內容
watch(
  () => route.path,
  () => {
    if (route.path !== '/login') {
      restartTimer()
    }
  }
)

onMounted(() => {
  setCountDownTimer()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearInterval(counter.value)
})
</script>
<template>
  <div class="counter">
    <div class="counter__time">{{ timeoutMinText }}</div>
    <div class="counter__text font-semibold">{{ $t('unit.minute') }}</div>
    <div class="counter__time">{{ timeoutSecText }}</div>
    <div class="counter__text font-semibold">{{ $t('unit.second') }}</div>
    <div class="counter__text font-semibold">{{ $t('nav.auto_logout') }}</div>
    <ButtonIcon
      :name="$t('nav.reset')"
      icon="history"
      size="small"
      class="counter__button font-semibold"
      :disabled="isDisabledResetBtn"
      @click="restartTimer(true)"
    />
  </div>
</template>
<style lang="scss" scoped>
.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(8) toRem(16);
  font-size: toRem(14);
  &__time {
    font-weight: 700;
    color: $red-dark;
  }
  &__time,
  &__text {
    margin-right: toRem(4);
    white-space: nowrap;
  }
  &__button {
    flex-shrink: 0;
    margin-left: 4px;
    height: 26px !important;
    > :first-child {
      margin-right: 2px !important;
      height: 13px !important;
      transform: scaleX(-1);
    }
  }
}
</style>
