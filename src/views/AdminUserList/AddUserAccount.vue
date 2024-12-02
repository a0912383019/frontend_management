<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiCreateUserByAdmin } from '@/api'
import { useGlobalStore, useUserAccountSettingStore } from '@/stores'
import AccessHall from '@/views/AdminUserList/components/AccessHall.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const userAccountSettingStore = useUserAccountSettingStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  userId: {
    type: Number
  },
  userName: {
    type: String
  }
})

const emit = defineEmits(['closeAddDialog', 'addSuccess'])

// 關閉 dialog
const handleDialogClosed = () => {
  initUser()
  emit('closeAddDialog')
}

const initUser = () => {
  formRef.value.resetFields()
  user.userType = '0'
  user.userStatus = '0'
  accessHallRef.value.initHalls()
}

const user = reactive({
  userType: '0',
  userStatus: '0'
})

const formRef = ref(null)
const accessHallRef = ref(null)

const emailDuplicate = ref(false)
const validateForm = reactive({
  userEmail: ''
})

const formRules = computed(() => {
  return [
    {
      required: true,
      message: t('user_detail_info.blank_email_error_msg')
    },
    {
      type: 'email',
      message: t('user_detail_info.wrong_email_formation_error_msg')
    },
    {
      validator: (rule, value, callback) => {
        if (emailDuplicate.value) {
          callback(new Error(t('user_detail_info.email_exist_error_msg')))
        } else {
          callback()
        }
      }
    }
  ]
})

const confirmAddBox = ref(false)

const newAccessHallsLable = ref([])
const newAccessHallsValue = ref('')

const handleUserAdd = () => {
  formRef.value.clearValidate()
  newAccessHallsLable.value = []
  newAccessHallsValue.value = ''

  let accessHalls = accessHallRef.value.checkHallNodes()
  formRef.value.validate((valid) => {
    if (accessHalls.length !== 0 && valid && accessHalls.length < 30) {
      newAccessHallsLable.value = accessHalls.map((ele) => {
        return ele.label
      })

      let newHallArr = accessHalls.map((ele) => {
        return ele.hallCode
      })
      newAccessHallsValue.value = newHallArr.join(',')

      confirmAddBox.value = true
    }
  })
}

const cancelAdd = () => {
  confirmAddBox.value = false
}

const confirmAdd = () => {
  createUserByAdmin()
}

const createUserByAdmin = async () => {
  try {
    const result = await apiCreateUserByAdmin({
      email: validateForm.userEmail,
      user_type: parseInt(user.userType),
      user_status: parseInt(user.userStatus),
      access_hall_name: newAccessHallsValue.value
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.add_successful'),
        type: 'success'
      })
      confirmAddBox.value = false
      emit('addSuccess')
    } else {
      ElNotification({
        title: t('msg.add_failed'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    const errStatus = error.response.data.errors
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 422 && errStatus.hasOwnProperty('email')) {
      emailDuplicate.value = true
      formRef.value.validate()
      confirmAddBox.value = false
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.add_failed'),
        type: 'error'
      })
    }
  }
}

const emailChange = () => {
  emailDuplicate.value = false
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog"
    :append-to-body="true"
    width="1150"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('admin_user.add_account') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <div class="justify-between mb-15">
          <el-row :gutter="20">
            <el-col :span="12">
              <SectionTitle size="small" class="cdp-text-blue mb-4" :title="$t('data_name.email')">
                <template #tooltip>
                  {{ $t('user_detail_info.email_bound_to_google') }}
                </template>
              </SectionTitle>
              <el-form ref="formRef" :model="validateForm" @submit.prevent>
                <el-form-item prop="userEmail" :rules="formRules">
                  <el-input
                    v-model="validateForm.userEmail"
                    type="email"
                    class="cdp-input"
                    :placeholder="$t('user_detail_info.input_google_email')"
                    @input="emailChange"
                    :validate-event="false"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <SectionTitle
                size="small"
                class="cdp-text-blue mb-4"
                :title="$t('user_detail_info.user_type')"
              />
              <el-select
                v-model="user.userType"
                class="cdp-select cdp-select__blue"
                popper-class="cdp-select-popper cdp-select-popper__blue w-full"
                :teleported="false"
              >
                <el-option
                  v-for="item in userAccountSettingStore.selectUserTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :selected="item.selected"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <SectionTitle
                size="small"
                class="cdp-text-blue mb-4"
                :title="$t('data_name.status')"
              />
              <el-select
                v-model="user.userStatus"
                class="cdp-select cdp-select__blue"
                popper-class="cdp-select-popper cdp-select-popper__blue w-full"
                :teleported="false"
              >
                <el-option
                  v-for="item in userAccountSettingStore.selectUserStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :selected="item.selected"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <AccessHall ref="accessHallRef" :edit="true" />
        <div class="flex justify-end mt-20">
          <CdpButton
            class="custom-bg-dark__blue ml-20"
            :name="$t('modal.add')"
            size="sm-130"
            @click="handleUserAdd()"
          />
        </div>
      </section>
    </div>
    <ConfirmBox
      color="blue"
      v-model="confirmAddBox"
      :width="350"
      :title="$t('modal.confirm_correct_desc')"
      class="confirm-box"
      @cancelExecute="cancelAdd"
      @confirmExecute="confirmAdd"
    >
      <template v-slot:text-body>
        <table class="cdp-confirm-box">
          <tr>
            <td width="35%" class="text-right">
              {{ $t('data_name.email') }}
            </td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">
              <div>
                {{ validateForm.userEmail }}
              </div>
            </td>
          </tr>
          <tr>
            <td width="35%" class="text-right">
              {{ $t('user_detail_info.user_type') }}
            </td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">{{ globalStore.userTypeConfig[user.userType] }}</td>
          </tr>
          <tr>
            <td width="35%" class="text-right">{{ $t('data_name.status') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">
              {{ globalStore.userStatusConfig[user.userStatus] }}
            </td>
          </tr>
          <tr class="vertical-baseline">
            <td width="35%" class="text-right">{{ $t('admin_user.can_access_hall') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">
              <div class="max-box">
                <div v-for="(item, idx) in newAccessHallsLable" :key="idx">
                  {{ item }}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </template>
    </ConfirmBox>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  height: 810px;
  &__component {
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px #e6eaf2 solid;
  }
  &__header {
    color: #fff;
  }
}
:deep(.el-form) {
  .is-error {
    .cdp-input {
      border: none;
      .el-input__wrapper:hover {
        box-shadow: 0 0 0 1px #f56c6c !important;
      }
    }
  }
}
.confirm-box {
  width: 100%;
  td {
    font-size: 14px;
    color: #404040;
    font-weight: normal;
    div {
      word-break: break-all;
    }
  }
  .max-box {
    max-height: 300px;
    overflow: scroll;
  }
}
</style>
<style lang="scss">
.dialog-mt-25 {
  margin-top: 25px;
}
</style>
