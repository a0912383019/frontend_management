<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiAddActivity } from '@/api'
import { useGlobalStore } from '@/stores'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { ElNotification } from 'element-plus'
import ChildActivityList from '@/views/ActivityAnalysisList/components/ChildActivityList.vue'

const { t, locale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const confirmWidth = ref(350)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const formRef = ref(null)
const childRef = ref(null)

const activityForm = reactive({
  activityName: '',
  purpose: '',
  description: ''
})

const rules = reactive({
  activityName: [
    { required: true, message: t('activity_analysis.blank_activity_name_error_msg') },
    { max: 100, message: t('activity_analysis.activity_name_length_limit_error_msg') }
  ],
  purpose: [{ max: 100, message: t('activity_analysis.activity_purpose_length_limit_error_msg') }],
  description: [
    { max: 1000, message: t('activity_analysis.activity_description_length_limit_error_msg') }
  ]
})

const subActivities = ref([])

// 驗證資料
const validActivityAdd = async () => {
  activityForm.activityName = activityForm.activityName.trim()
  activityForm.purpose = activityForm.purpose.trim()
  activityForm.description = activityForm.description.trim()

  const infoValid = formRef.value.validate((valid) => {
    return valid
  })

  const subValid = childRef.value.validSubActivities()

  if (subValid && infoValid) {
    subActivities.value = await childRef.value.getSubActivities()
    confirmBox.value = true
  }
}

const confirmBox = ref(false)

const cancelSaved = () => {
  confirmBox.value = false
}

const confirmSaved = () => {
  confirmBox.value = false
  queryAddActivity()
}

const emit = defineEmits(['closeDialog', 'addSuccess'])

// 初始化資料
const initActivity = () => {
  activityForm.activityName = ''
  activityForm.purpose = ''
  activityForm.description = ''
  subActivities.value = []
}

// 關閉 dialog
const handleDialogClosed = () => {
  initActivity()
  emit('closeDialog')
}

const queryAddActivity = async () => {
  try {
    const result = await apiAddActivity({
      hall_name: activeHall.hall_code,
      activity_name: activityForm.activityName,
      activity_purpose: activityForm.purpose,
      activity_description: activityForm.description,
      activity_detail: organizeActivityDatail()
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.add_successful'),
        type: 'success'
      })
      handleDialogClosed()
      emit('addSuccess', result.data.result)
    } else {
      ElNotification({
        title: t('msg.add_failed'),
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
        title: t('msg.add_failed'),
        type: 'error'
      })
    }
  }
}

onMounted(() => {
  confirmWidth.value = locale.value === 'en' ? 400 : 350
})
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog overflow-visible dialog-mt-40"
    :append-to-body="true"
    width="1280"
    :destroy-on-close="true"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('activity_analysis.header_add_activity') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <el-form ref="formRef" :model="activityForm" @submit.prevent :rules="rules">
          <el-row :gutter="20" class="mb-16">
            <el-col :span="12">
              <div class="mb-20">
                <div class="cdp-text-blue mb-3">
                  {{ $t('activity_analysis.activity_name') }}
                </div>
                <el-form-item prop="activityName">
                  <el-input
                    v-model="activityForm.activityName"
                    class="cdp-input"
                    :placeholder="$t('activity_analysis.input_activity_name')"
                    :validate-event="false"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="cdp-text-blue mb-3">
                {{ $t('activity_analysis.activity_purpose') }}
              </div>
              <el-form-item prop="purpose">
                <el-input
                  v-model="activityForm.purpose"
                  class="cdp-input"
                  :placeholder="$t('activity_analysis.input_activity_purpose')"
                  :validate-event="false"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb-20">
              <div class="cdp-text-blue mb-3">
                {{ $t('activity_analysis.activity_description') }}
              </div>
              <el-form-item prop="description">
                <el-input
                  v-model="activityForm.description"
                  type="textarea"
                  :placeholder="$t('activity_analysis.input_activity_description')"
                  class="cdp-activity-textarea"
                  :validate-event="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <ChildActivityList ref="childRef" :canEdit="true" />
            </el-col>
          </el-row>
        </el-form>
        <div class="flex justify-end">
          <CdpButton
            class="custom-bg-dark__blue"
            :name="$t('modal.add')"
            size="sm-130"
            @click="validActivityAdd()"
          />
        </div>
      </section>
    </div>
  </el-dialog>
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
          <td class="text-left">{{ activityForm.activityName }}</td>
        </tr>
        <tr>
          <td class="text-right white-space-nowrap">
            {{ $t('activity_analysis.activity_purpose') }}
          </td>
          <td class="text-center">：</td>
          <td class="text-left">
            {{ activityForm.purpose === '' ? $t('common.none') : activityForm.purpose }}
          </td>
        </tr>
        <tr class="vertical-baseline">
          <td class="text-right white-space-nowrap">
            {{ $t('activity_analysis.activity_detail') }}
          </td>
          <td class="text-center">：</td>
          <td class="text-left">
            <div v-for="(item, idx) in subActivities" :key="idx" class="word-break">
              {{ item.activity_detail_name + '(' + item.activity_date.replaceAll('-', '/') + ')' }}
            </div>
          </td>
        </tr>
      </table>
    </template>
  </ConfirmBox>
</template>
<style lang="scss" scoped>
.cdp-dialog {
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
  .cdp-activity-textarea {
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
    .cdp-activity-textarea {
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
<style lang="scss">
.overflow-visible {
  overflow: visible !important;
}
.dialog-mt-40 {
  margin-top: 40px;
}
</style>
