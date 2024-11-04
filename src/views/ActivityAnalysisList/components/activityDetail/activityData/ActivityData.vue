<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { apiActivityInfo } from '@/api'
import CdpButton from '@/components/Button/CdpButton.vue'
import ChildActivityList from '@/views/ActivityAnalysisList/components/ChildActivityList.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { ElNotification } from 'element-plus'

const { t, locale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { childListData } = activityStore

const props = defineProps({
  activityId: {
    type: Number
  }
})

const confirmWidth = ref(350)

const validateForm = reactive({
  name: '',
  purpose: '',
  operatedAccount: '',
  createdTime: '',
  description: ''
})

const rules = reactive({
  name: [
    { required: true, message: t('activity_analysis.blank_activity_name_error_msg') },
    { max: 100, message: t('activity_analysis.activity_name_length_limit_error_msg') }
  ],
  purpose: [{ max: 100, message: t('activity_analysis.activity_purpose_length_limit_error_msg') }],
  description: [
    { max: 1000, message: t('activity_analysis.activity_description_length_limit_error_msg') }
  ]
})

const formRef = ref(null)
const childRef = ref(null)

const subActivities = ref([])

const edit = ref(false)
const editDisabled = ref(true)

const handleEdit = () => {
  edit.value = true
}

const handleEditCancel = () => {
  cancelEditBox.value = true
}

const handleEditConfirm = async () => {
  const validPass = await validActivity()
  if (validPass) {
    subActivities.value = await childRef.value.getSubActivities()
    confirmBox.value = true
  }
}

const validClass = reactive({
  topBlock: false,
  middleBlock: false
})

const initValidMsg = () => {
  formRef.value.clearValidate()
  validClass.topBlock = false
  validClass.middleBlock = false
}

// 驗證資料
const validActivity = async () => {
  validateForm.name = validateForm.name.trim()
  validateForm.purpose = validateForm.purpose.trim()
  validateForm.description = validateForm.description.trim()

  initValidMsg()
  const subValid = childRef.value.validSubActivities()
  const infoValid = await formRef.value.validate((valid, failPart) => {
    if (!valid) {
      const failKey = Object.keys(failPart)
      if (failKey.includes('name', 'purpose')) {
        validClass.topBlock = true
      }
      if (failKey.includes('description')) {
        validClass.middleBlock = true
      }
    }

    return valid
  })

  return subValid && infoValid
}

const queryActivityInfo = async () => {
  initFormAndData()
  editDisabled.value = true

  try {
    const result = await apiActivityInfo({
      hall_name: activeHall.hall_code,
      activity_id: props.activityId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformActivityData(result.data.result)
      editDisabled.value = false
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
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  }
}

const initFormAndData = () => {
  originalData.value = null
  validateForm.name = ''
  validateForm.purpose = ''
  validateForm.operatedAccount = ''
  validateForm.createdTime = ''
  validateForm.description = ''
  childListData.value = []
}

const originalData = ref(null)
const transformActivityData = (data) => {
  validateForm.name = data.activity_name
  validateForm.purpose = data.activity_purpose ? data.activity_purpose : ''
  validateForm.operatedAccount = data.operator_name
  validateForm.createdTime = data.created_time
  validateForm.description = data.activity_description ? data.activity_description : ''

  originalData.value = JSON.parse(JSON.stringify(validateForm))

  childListData.value = data.activity_detail_data
}

const cancelEditBox = ref(false)

const cancelExecute = () => {
  cancelEditBox.value = false
}

const confirmExecute = () => {
  initValidMsg()

  validateForm.name = originalData.value.name
  validateForm.purpose = originalData.value.purpose
  validateForm.operatedAccount = originalData.value.operatedAccount
  validateForm.createdTime = originalData.value.createdTime
  validateForm.description = originalData.value.description
  edit.value = false
  cancelEditBox.value = false
}

const confirmBox = ref(false)

const cancelSaved = () => {
  confirmBox.value = false
}

const confirmSaved = () => {
  confirmBox.value = false
  edit.value = false
  queryActivityInfo()
}

onMounted(() => {
  initFormAndData()
  confirmWidth.value = locale.value === 'en' ? 400 : 350
  queryActivityInfo()
})
</script>
<template>
  <section class="cdp-section mb-0">
    <el-form ref="formRef" :model="validateForm" @submit.prevent>
      <el-row :gutter="20">
        <el-col :span="6" :class="{ 'mb-10': validClass.topBlock }">
          <div class="cdp-text-blue mb-3">{{ $t('activity_analysis.activity_name') }}</div>
          <el-form-item prop="name" :rules="rules.name">
            <el-input
              v-model="validateForm.name"
              :placeholder="edit ? $t('activity_analysis.input_activity_name') : ''"
              class="cdp-input"
              :class="{ 'cdp-input-disabled': !edit }"
              :validate-event="false"
            >
              <template #append v-if="!edit"
                ><font-awesome-icon icon="fa-solid fa-lock"
              /></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="cdp-text-blue mb-3">{{ $t('activity_analysis.activity_purpose') }}</div>
          <el-form-item prop="purpose" :rules="rules.purpose">
            <el-input
              v-model="validateForm.purpose"
              :placeholder="edit ? $t('activity_analysis.input_activity_purpose') : ''"
              class="cdp-input"
              :class="{ 'cdp-input-disabled': !edit }"
              :validate-event="false"
            >
              <template #append v-if="!edit"
                ><font-awesome-icon icon="fa-solid fa-lock"
              /></template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="cdp-text-blue mb-3">{{ $t('data_name.operator_account') }}</div>
          <el-input
            v-model="validateForm.operatedAccount"
            class="cdp-input cdp-input-disabled"
            readonly
          >
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
          <el-input
            v-model="validateForm.createdTime"
            class="cdp-input cdp-input-disabled"
            readonly
          >
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
        </el-col>
        <el-col :span="24" :class="{ 'mb-15': validClass.middleBlock }">
          <div class="cdp-text-blue mb-3">
            {{ $t('activity_analysis.activity_description') }}
          </div>
          <el-form-item prop="description" :rules="rules.description">
            <el-input
              v-model="validateForm.description"
              type="textarea"
              :placeholder="edit ? $t('activity_analysis.input_activity_description') : ''"
              class="cdp-data-textarea"
              :validate-event="false"
              :disabled="!edit"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ChildActivityList ref="childRef" :canEdit="edit" />
    <div class="flex justify-end mt-20">
      <span v-if="!edit" class="pt-5 font-size-13 cdp-text-blue">
        *{{ $t('data_name.click_to_edit') }}
      </span>
      <div v-if="!edit">
        <CdpButton
          class="custom-bg-dark__blue ml-20"
          :name="$t('common.edit')"
          size="sm-130"
          :disabled="editDisabled"
          @click="handleEdit()"
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
    <ConfirmBox
      color="blue"
      v-model="cancelEditBox"
      :title="$t('modal.not_yet_saved')"
      :content="$t('modal.do_you_want_to_cancel_edit')"
      class="top15per"
      @cancelExecute="cancelExecute"
      @confirmExecute="confirmExecute"
    >
    </ConfirmBox>
    <ConfirmBox
      color="blue"
      v-model="confirmBox"
      :width="confirmWidth"
      :title="$t('modal.confirm_correct_desc')"
      class="top15per"
      @cancelExecute="cancelSaved"
      @confirmExecute="confirmSaved"
    >
      <template v-slot:text-body>
        <table class="table-total">
          <tr class="vertical-baseline">
            <td class="text-right white-space-nowrap">
              {{ $t('activity_analysis.activity_name') }}
            </td>
            <td class="text-center">：</td>
            <td class="text-left">{{ validateForm.name }}</td>
          </tr>
          <tr>
            <td class="text-right white-space-nowrap">
              {{ $t('activity_analysis.activity_purpose') }}
            </td>
            <td class="text-center">：</td>
            <td class="text-left">
              {{ validateForm.purpose === '' ? $t('common.none') : validateForm.purpose }}
            </td>
          </tr>
          <tr class="vertical-baseline">
            <td class="text-right white-space-nowrap">
              {{ $t('activity_analysis.activity_detail') }}
            </td>
            <td class="text-center">：</td>
            <td class="text-left">
              <div v-for="(item, idx) in subActivities" :key="idx" class="word-break">
                {{
                  item.activity_detail_name + '(' + item.activity_date.replaceAll('-', '/') + ')'
                }}
              </div>
            </td>
          </tr>
        </table>
      </template>
    </ConfirmBox>
  </section>
</template>
<style lang="scss" scoped>
:deep(.el-form) {
  .cdp-data-textarea {
    border: solid 1px #cfd8e6;
    border-radius: 5px;
    .el-textarea {
      &__inner {
        box-shadow: none;
        height: 180px;
        resize: none;
        &:hover {
          box-shadow: 0 0 0 1px #4f84cf !important;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  .is-error {
    .cdp-input {
      border: none;
      .el-input__wrapper:hover {
        box-shadow: 0 0 0 1px #f56c6c !important;
      }
    }
    .cdp-data-textarea {
      border: solid 1px #f56c6c;
      .el-textarea {
        &__inner {
          &:hover {
            box-shadow: 0 0 0 1px #f56c6c !important;
          }
        }
      }
    }
  }
  .el-form-item__error {
    margin-top: 2px;
  }
}
.table-total {
  width: 100%;
  td {
    font-size: 14px;
    color: #404040;
    font-weight: normal;
    div {
      word-break: break-all;
    }
  }
}
</style>
