<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiUserByAdmin, apiUpdateUserByAdmin } from '@/api'
import { useGlobalStore, useUserAccountSettingStore } from '@/stores'
import AccessHall from '@/views/AdminUserList/components/AccessHall.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { dayjs, ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { userTypeConfig, userStatusConfig } = globalStore

const userAccountSettingStore = useUserAccountSettingStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number
  },
  userName: {
    type: String
  }
})

const accessHallRef = ref(null)

const form = reactive({
  userType: null,
  userStatus: null
})

const userDetail = reactive({
  userId: '',
  email: '',
  userType: '',
  userStatus: '',
  createTime: '',
  loginNum: '',
  updateTime: '',
  lastLoginTime: ''
})

const emit = defineEmits(['closeDialog', 'updateSuccess'])

const edit = ref(false)

const handleUserEdit = () => {
  edit.value = true
}

const newAccessHallsLable = ref([])
const newAccessHallsValue = ref('')

const handleEditConfirm = () => {
  newAccessHallsLable.value = []
  let accessHalls = accessHallRef.value.checkHallNodes()
  if (accessHalls.length === 0) return

  newAccessHallsLable.value = accessHalls.map((ele) => {
    return ele.label
  })

  let newHallArr = accessHalls.map((ele) => {
    return ele.hallCode
  })
  newAccessHallsValue.value = newHallArr.join(',')

  confirmEditBox.value = true
}

const handleOpenDialog = () => {
  initUser()
  queryUserByAdmin()
}

const initUser = () => {
  for (let val in form) {
    form[val] = null
  }

  for (let val in userDetail) {
    userDetail[val] = ''
  }
}

const queryUserByAdmin = async () => {
  try {
    const result = await apiUserByAdmin({
      member_id: props.userId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformUserData(result.data.result)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

const originUserData = ref(null)

const startRender = ref(false)
const userHalls = ref([])
const transformUserData = (data) => {
  originUserData.value = JSON.parse(JSON.stringify(data))

  userDetail.userId = data.id
  userDetail.email = data.email
  form.userType = data.user_type.toString()
  userDetail.userType = userTypeConfig[data.user_type]
  form.userStatus = data.user_status.toString()
  userDetail.userStatus = userStatusConfig[data.user_status]
  userDetail.createTime = dayjs(data.created_time).format(t('date.format_datetime_rule'))
  userDetail.loginNum = data.login_num
  userDetail.updateTime =
    data.updated_time === null
      ? '-'
      : dayjs(data.updated_time).format(t('date.format_datetime_rule'))
  userDetail.lastLoginTime =
    data.last_login_date === null
      ? '-'
      : dayjs(data.last_login_date).format(t('date.format_datetime_rule'))

  userHalls.value = data.access_hall_name.split(',')
  startRender.value = true
}

// 關閉 dialog
const handleDialogClosed = () => {
  edit.value = false
  startRender.value = false
  emit('closeDialog')
}

const cancelEditBox = ref(false)

const handleEditCancel = () => {
  cancelEditBox.value = true
}

const cancelExecute = () => {
  cancelEditBox.value = false
}

const confirmExecute = () => {
  initUserTypeStatus()
  accessHallRef.value.initHalls()
  edit.value = false
  cancelEditBox.value = false
}

const initUserTypeStatus = () => {
  let userData = originUserData.value
  form.userType = userData.user_type.toString()
  form.userStatus = userData.user_status.toString()
}

const confirmEditBox = ref(false)

const cancelSaved = () => {
  confirmEditBox.value = false
}

const confirmSaved = () => {
  updateUserByAdmin()
}

const updateUserByAdmin = async () => {
  try {
    const result = await apiUpdateUserByAdmin({
      user_type: parseInt(form.userType),
      user_status: parseInt(form.userStatus),
      access_hall_name: newAccessHallsValue.value,
      user_id: props.userId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.updated_successfully'),
        type: 'success'
      })
      confirmEditBox.value = false
      emit('updateSuccess')
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
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
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog dialog-mt-25"
    :append-to-body="true"
    width="1150"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
    @open="handleOpenDialog"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('user_detail_info.account_name_with_colon') }}
        <span class="ml-5 underline">{{ props.userName }}</span>
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <div class="mb-20 justify-between">
          <el-row :gutter="20" class="mb-16">
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('admin_user.user_id') }}</div>
              <el-input v-model="userDetail.userId" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.email') }}</div>
              <el-input v-model="userDetail.email" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.user_type') }}</div>
              <el-input
                v-if="!edit"
                v-model="userDetail.userType"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
              <el-select
                v-else
                v-model="form.userType"
                class="cdp-select cdp-select__blue w-full"
                popper-class="cdp-select-popper cdp-select-popper__blue"
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
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.status') }}</div>
              <el-input
                v-if="!edit"
                v-model="userDetail.userStatus"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
              <el-select
                v-else
                v-model="form.userStatus"
                class="cdp-select cdp-select__blue w-full"
                popper-class="cdp-select-popper cdp-select-popper__blue"
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
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
              <el-input
                v-model="userDetail.createTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12" class="mb-20">
              <div class="cdp-text-blue mb-3">{{ $t('data_name.login_num') }}</div>
              <el-input v-model="userDetail.loginNum" class="cdp-input cdp-input-disabled" readonly>
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.last_update_time') }}</div>
              <el-input
                v-model="userDetail.updateTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">{{ $t('user_detail_info.last_login_time') }}</div>
              <el-input
                v-model="userDetail.lastLoginTime"
                class="cdp-input cdp-input-disabled"
                readonly
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <AccessHall v-if="startRender" ref="accessHallRef" :userHalls="userHalls" :edit="edit" />
        <div class="flex justify-end mt-20">
          <div v-if="!edit">
            <CdpButton
              class="custom-bg-dark__blue ml-20"
              :name="$t('common.edit')"
              size="sm-130"
              @click="handleUserEdit()"
            />
          </div>
          <div v-else>
            <CdpButton
              class="custom-bg-white ml-15"
              :name="$t('common.cancel_edit')"
              size="sm-130"
              @click="handleEditCancel()"
            />
            <CdpButton
              class="custom-bg-dark__blue ml-10"
              :name="$t('common.confirm_update')"
              size="sm-130"
              @click="handleEditConfirm()"
            />
          </div>
        </div>
      </section>
    </div>
  </el-dialog>
  <ConfirmBox
    color="blue"
    v-model="cancelEditBox"
    :title="$t('modal.not_yet_saved')"
    :content="$t('modal.do_you_want_to_cancel_edit')"
    @cancelExecute="cancelExecute"
    @confirmExecute="confirmExecute"
  >
  </ConfirmBox>
  <ConfirmBox
    color="blue"
    v-model="confirmEditBox"
    :width="350"
    :title="$t('modal.confirm_correct_desc')"
    class="confirm-box"
    @cancelExecute="cancelSaved"
    @confirmExecute="confirmSaved"
  >
    <template v-slot:text-body>
      <table class="cdp-confirm-box">
        <tr>
          <td width="35%" class="text-right">
            {{ $t('user_detail_info.account_name') }}
          </td>
          <td width="2%" class="text-center">：</td>
          <td width="63%" class="text-left">{{ props.userName }}</td>
        </tr>
        <tr>
          <td width="35%" class="text-right">
            {{ $t('data_name.email') }}
          </td>
          <td width="2%" class="text-center">：</td>
          <td width="63%" class="text-left">
            <div>
              {{ userDetail.email }}
            </div>
          </td>
        </tr>
        <tr>
          <td width="35%" class="text-right">
            {{ $t('user_detail_info.user_type') }}
          </td>
          <td width="2%" class="text-center">：</td>
          <td width="63%" class="text-left">{{ userTypeConfig[form.userType] }}</td>
        </tr>
        <tr>
          <td width="35%" class="text-right">{{ $t('data_name.status') }}</td>
          <td width="2%" class="text-center">：</td>
          <td width="63%" class="text-left">{{ userStatusConfig[form.userStatus] }}</td>
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
.underline {
  text-decoration: underline;
}
:deep(.el-input .el-input__wrapper) {
  box-shadow: none !important;
  .el-input__inner {
    cursor: auto;
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
