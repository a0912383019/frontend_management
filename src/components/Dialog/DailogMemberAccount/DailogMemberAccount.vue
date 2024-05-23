<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryUserInfo } from '@/api'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore } from '@/stores'
import { ElNotification, dayjs } from 'element-plus'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { userTypeConfig } = storeToRefs(globalStore)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const userName = ref('')
const memberData = reactive({
  email: '',
  accountType: '',
  createdTime: '',
  loginNum: '',
  lastUpdateTime: '',
  lastLoginTime: ''
})

//取得會員資訊
const queryUserInfo = async () => {
  let user_id = getSessionStorageEntity('user_info').user_id
  try {
    const result = await apiQueryUserInfo({
      member_id: user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformUserInfo(result.data.result)
    } else {
      // 放在這可以讓只有資料異動才會初始化，只有第一次打開需要新渲染資料，之後只要資料沒有異動畫面就不會有斷點
      initMemberData()
    }
  } catch (error) {
    console.error(error)
    initMemberData()
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  }
}

const initMemberData = () => {
  userName.value = ''
  memberData.email = ''
  memberData.accountType = ''
  memberData.createdTime = ''
  memberData.loginNum = ''
  memberData.lastUpdateTime = ''
  memberData.lastLoginTime = ''
}

const transformUserInfo = (data) => {
  userName.value = data.name
  memberData.email = data.email
  memberData.accountType = userTypeConfig.value[data.user_type]
  memberData.createdTime =
    data.created_time === null
      ? '-'
      : dayjs(data.created_time).format(t('date.format_datetime_rule'))
  memberData.loginNum = data.login_num.toString()
  memberData.lastUpdateTime =
    data.updated_time === null
      ? '-'
      : dayjs(data.updated_time).format(t('date.format_datetime_rule'))
  memberData.lastLoginTime =
    data.last_login_date === null
      ? '-'
      : dayjs(data.last_login_date).format(t('date.format_datetime_rule'))
}

// 開啟 dialog
const handleOpenDialog = () => {
  queryUserInfo()
}

const emit = defineEmits(['closeDialog'])

// 關閉 dialog
const handleDialogClosed = () => {
  emit('closeDialog')
}
</script>
<template>
  <div>
    <el-dialog
      :model-value="props.modelValue"
      class="cdp-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      width="740"
      @open="handleOpenDialog"
      @closed="handleDialogClosed"
    >
      <template #header>
        <div class="cdp-dialog__header">
          {{ $t('user_detail_info.personal_account_data') }}
          <div class="underline ml-10">{{ userName }}</div>
        </div>
      </template>
      <div class="cdp-dialog__content">
        <section class="cdp-section">
          <el-row :gutter="20" class="mb-16">
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.email') }}</div>
              <el-input v-model="memberData.email" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.user_type') }}</div>
              <el-input
                v-model="memberData.accountType"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb-16">
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
              <el-input
                v-model="memberData.createdTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.login_num') }}</div>
              <el-input v-model="memberData.loginNum" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.last_update_time') }}</div>
              <el-input
                v-model="memberData.lastUpdateTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.last_login_time') }}</div>
              <el-input
                v-model="memberData.lastLoginTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
          </el-row>
        </section>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__header {
    display: flex;
    align-items: center;
    color: #fff;
  }
}
:deep(.cdp-input) {
  .el-input__wrapper:hover {
    box-shadow: none !important;
  }
  .el-input__inner {
    cursor: default;
  }
}
</style>
