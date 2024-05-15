<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  memberName: {
    type: String
  }
})

// 開啟 dialog
// const handleOpenDialog = () => {
// }

const emit = defineEmits(['closeDialog'])

// 關閉 dialog
const handleDialogClosed = () => {
  emit('closeDialog')
}

const memberData = reactive({
  email: 'abc@abc',
  accountType: '系統管理員',
  createdTime: '2023/05/12 17:18:42',
  loginNum: '2067',
  lastUpdateTime: '2024/01/19 15:13:24',
  lastLoginTime: '2024/05/13 13:50:09'
})
</script>
<template>
  <div>
    <el-dialog
      :model-value="props.modelValue"
      class="cdp-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      width="740"
      @closed="handleDialogClosed"
    >
      <template #header>
        <div class="cdp-dialog__header">
          {{ $t('user_detail_info.personal_account_data') }}
          <div class="underline ml-10">{{ props.memberName }}</div>
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
              <el-input v-model="memberData.accountType" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb-16">
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
              <el-input v-model="memberData.createdTime" class="cdp-input cdp-input-disabled" readonly>
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
              <el-input v-model="memberData.lastUpdateTime" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.last_login_time') }}</div>
              <el-input v-model="memberData.lastLoginTime" class="cdp-input cdp-input-disabled" readonly>
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
