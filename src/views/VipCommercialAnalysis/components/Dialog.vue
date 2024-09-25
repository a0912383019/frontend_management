<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiListCustomTagsSetting } from '@/api'
import { errorRespond, getSessionStorageEntity } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag } = vipStore
const vipTag = defaultVipTag.split(',')

// dialog 開啟狀態
const dialogStatus = ref(false)

// dialog 取消
const handelCancel = () => {
  dialogStatus.value = false
}

// 前往自訂標籤設置頁面
const handelGoPage = () => {
  router.push('/custom-tags-setting')
}

// 呼叫 api
const queryListCustomTagsSetting = async () => {
  try {
    const result = await apiListCustomTagsSetting({
      hall_name: activeHall.hall_code
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      checkListCustomTagsSetting(result.data.result)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

// 存放 dialog 要顯示的文字
const dialogText = ref('')

// dialog error type
const dialogErrorType = ref(1)

// 確認是否有 tag code
const checkVipTagCode = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || data.length === 0) {
      // 如果 data 為空，直接 reject
      reject(false)
      return
    }
    const hasVipTag = data.some((item) => vipTag.includes(item.tag_code.toString()))

    if (hasVipTag) {
      // 如果有符合的，resolve
      resolve()
    } else {
      // 如果沒有符合的，reject
      reject()
    }
  })
}

// 確認 tag row_count 是否有資料
const checkRowCount = (data) => {
  // 取得 符合 tag_code 的資料
  const hasVipTagData = data.filter((item) => vipTag.includes(item.tag_code.toString()))

  // 取得 tag config 資料
  const tagConfig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

  // 取得 row_count 為 0 的資料
  const hasRowCountZero = hasVipTagData.filter((item) => item.row_count === 0)

  // 回傳 row_count 為 0 的標籤名稱，並用 頓號 拼接
  return hasRowCountZero.map((item) => tagConfig[item.tag_code].tag_name).join('、')
}

const checkListCustomTagsSetting = (data) => {
  checkVipTagCode(data)
    .then(() => {
      let tagText = checkRowCount(data)
      if (tagText !== '') {
        dialogStatus.value = true
        dialogErrorType.value = 2
        dialogText.value = t('vip_commercial_analysis.no_vip_row_count', {
          hall_name: activeHall.hall_name,
          tag: tagText,
          sidebar: t('sidebar.custom_tags_setting')
        })
      }
    })
    .catch(() => {
      dialogStatus.value = true
      dialogErrorType.value = 1
      dialogText.value = t('vip_commercial_analysis.no_vip_warning', {
        hall_name: activeHall.hall_name
      })
    })
}

onMounted(() => {
  queryListCustomTagsSetting()
})
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogStatus"
      width="300"
      :alignCenter="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      class="cdp-confirm-dialog"
    >
      <div class="inner-dialog">
        <div class="inner-dialog__icon">
          <cdp-icon name="dialogNotice" />
        </div>
        <div class="inner-dialog__title">{{ $t('vip_commercial_analysis.not_set') }}</div>
        <div class="inner-dialog__text">
          {{ dialogText }}
        </div>

        <div class="inner-dialog__button" v-if="dialogErrorType === 1">
          <ButtonIcon color="gray" :name="$t('modal.cancel')" @click="handelCancel" />
          <ButtonIcon color="red" :name="$t('modal.confirm')" @click="handelCancel" />
        </div>

        <div class="inner-dialog__button" v-if="dialogErrorType === 2">
          <ButtonIcon color="gray" :name="$t('modal.cancel')" @click="handelCancel" />
          <ButtonIcon color="red" :name="$t('common.redirect_to_page')" @click="handelGoPage" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.inner-dialog__title) {
  color: $red;
}
:deep(.inner-dialog__icon) {
  color: $red;
}
</style>
