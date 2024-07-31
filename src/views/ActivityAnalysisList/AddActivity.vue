<script setup>
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryPromotionList, apiAddActivity } from '@/api'
import { useGlobalStore } from '@/stores'
import CdpButton from '@/components/Button/CdpButton.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import AddActivity from '@/components/Button/AddButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { ElNotification } from 'element-plus'

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

const tableColumns = computed(() => {
  return [
    {
      label: t('activity_analysis.activity_detail_name'),
      prop: 'activity_detail_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '29%'
    },
    {
      label: t('activity_analysis.activity_date'),
      prop: 'activity_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '27%'
    },
    {
      prop: 'promotion_list',
      headerAlign: 'center',
      align: 'center',
      minWidth: '36%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    }
  ]
})

const formRef = ref(null)

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

const subActivities = ref([createSubActivity('0')])

function createSubActivity(key) {
  return {
    detail_key: key.toString(),
    activity_detail_name: '',
    activity_date: '',
    promotion_list: '',
    promotion_options: [],
    api_success: false,
    detail_valid: { valid: true, msg: '' },
    promotion_valid: { valid: true, msg: '' }
  }
}

const addActivity = () => {
  const rowKey = Date.now().toString()
  subActivities.value.push(createSubActivity(rowKey))
}

const confirmBox = ref(false)

// 驗證資料
const validActivityAdd = () => {
  activityForm.activityName = activityForm.activityName.trim()
  activityForm.purpose = activityForm.purpose.trim()
  activityForm.description = activityForm.description.trim()

  let activityError = false
  formRef.value.validate((valid) => {
    if (!valid) {
      activityError = true
    }
  })

  let detailActivityError = false
  subActivities.value.forEach((val, idx) => {
    let errClass = ''
    subActivities.value[idx].detail_valid.valid = true
    subActivities.value[idx].promotion_valid.valid = true

    // 優惠名單驗證必選（此驗證msg不會有換行的情況因此放在前面）
    if (subActivities.value[idx].promotion_list === '') {
      detailActivityError = true
      subActivities.value[idx].promotion_valid.valid = false
      subActivities.value[idx].promotion_valid.msg = t(
        'activity_analysis.blank_promotion_error_msg'
      )
      errClass = 'row-err'
    }

    // 子活動名稱驗證（不可空白 && 字數不可超過100）
    if (subActivities.value[idx].activity_detail_name.trim() === '') {
      detailActivityError = true
      subActivities.value[idx].detail_valid.valid = false
      subActivities.value[idx].detail_valid.msg = t(
        'activity_analysis.blank_activity_detail_name_error_msg'
      )
      errClass = 'row-err'
    } else if (subActivities.value[idx].activity_detail_name.length > 100) {
      detailActivityError = true
      subActivities.value[idx].detail_valid.valid = false
      subActivities.value[idx].detail_valid.msg = t(
        'activity_analysis.activity_detail_name_length_limit_error_msg'
      )
      errClass = locale.value === 'en' ? 'row-err-long' : 'row-err'
    }

    // 變化驗證文字的高度
    const cells = document.querySelectorAll(`.el-dialog .el-table tr:nth-child(${idx + 1}) .cell`)
    cells.forEach((cell) => {
      cell.classList.remove('row-err', 'row-err-long')
      if (detailActivityError) {
        cell.classList.add(errClass)
      }
    })
  })

  // 驗證未通過，返回
  if (activityError || detailActivityError) {
    return
  }

  confirmBox.value = true
}

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
  subActivities.value = [createSubActivity('0')]
}

// 關閉 dialog
const handleDialogClosed = () => {
  initActivity()
  emit('closeDialog')
}

const organizeActivityDatail = () => {
  let activity_detail = []
  subActivities.value.forEach((val, idx) => {
    let dataJson = JSON.parse(val.promotion_list)
    let activityDetailData = {
      activity_detail_id: (idx + 1).toString(),
      activity_detail_name: val.activity_detail_name,
      activity_detail_date: val.activity_date,
      promotion_id: dataJson.promotion_id,
      promotion_name: dataJson.promotion_name,
      original_id: dataJson.original_id,
      offer_id: dataJson.offer_id
    }

    activity_detail[idx + 1] = JSON.stringify(activityDetailData)
  })

  return activity_detail
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

const generateOptions = (arr) => {
  let options = [
    {
      value: '',
      label: t('common.select'),
      selected: true
    }
  ]

  arr.forEach((val) => {
    let optionValue = JSON.stringify(val)
    options.push({
      value: optionValue,
      label: val.promotion_name
    })
  })

  return options
}

// 取得優惠活動
const queryPromotionList = async (idx) => {
  subActivities.value[idx].api_success = false
  subActivities.value[idx].promotion_list = ''
  const [start_date, end_date] = subActivities.value[idx].activity_date
    .split('~')
    .map((date) => date.trim())

  try {
    const result = await apiQueryPromotionList({
      hall_name: activeHall.hall_code,
      start_date: start_date,
      end_date: end_date
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      subActivities.value[idx].promotion_options = generateOptions(result.data.result)
      subActivities.value[idx].api_success = true
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

const updatePromotionList = (idx) => {
  if (isDeleting.value) return
  // 第一次渲染組件會有不同步問題，el-table 尚未渲染完畢 scope.$index 會是 -1
  // 但是 daterangepicker 已開始渲染，所以在跑 onMounted 這邊的idx 會是-1
  if (idx != -1) {
    queryPromotionList(idx)
  }
}

const isDeleting = ref(false)

const deleteActivity = (idx) => {
  // 刪除會觸發table重新渲染，導致組件也刷新觸發updatePromotionList
  // 所以設定此參數擋住
  isDeleting.value = true
  subActivities.value.splice(idx, 1)
  nextTick(() => {
    isDeleting.value = false
  })
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
    width="1000"
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
              <section class="cdp-section-in">
                <SectionTitle class="mb-15" :title="$t('activity_analysis.activity_detail_list')" />
                <CustomTable
                  :serverSide="false"
                  :tableData="subActivities"
                  :tableColumns="tableColumns"
                  :hasPagination="false"
                  :stripe="false"
                  rowKey="detail_key"
                  class="customTable2 customTagListTable"
                >
                  <template #promotion_list-header>
                    <span class="mr-5">{{ $t('activity_analysis.promotion_list') }}</span>
                    <el-tooltip effect="dark" placement="top">
                      <template #content>
                        <div class="font-size-14">
                          {{ $t('activity_analysis.activity_detail_connect_promotion_reminder') }}
                        </div>
                      </template>
                      <font-awesome-icon
                        class="title__icon activeStepBtn"
                        icon="fa-solid fa-circle-info"
                      />
                    </el-tooltip>
                  </template>
                  <template #activity_detail_name="scope">
                    <div class="w-full text-left mr-5">
                      <el-input
                        v-model="scope.row.activity_detail_name"
                        class="cdp-input"
                        :class="{ 'is-error': !scope.row.detail_valid.valid }"
                      ></el-input>
                      <div
                        v-if="!scope.row.detail_valid.valid"
                        class="cdp-text-candypink font-size-12 line-1-5"
                      >
                        {{ scope.row.detail_valid.msg }}
                      </div>
                    </div>
                  </template>
                  <template #activity_date="scope">
                    <DatepickerRange
                      v-model="scope.row.activity_date"
                      :rangeDate="scope.row.activity_date"
                      :config="8"
                      :shortcutsConfig="1"
                      :disableDate="false"
                      @update:modelValue="updatePromotionList(scope.idx)"
                      class="w-full filter-datepicker activity-date-picker ml-5 mr-5"
                    />
                  </template>
                  <template #promotion_list="scope">
                    <div class="loading" v-if="!scope.row.api_success">
                      <LoadingBox color="blue" size="sm" />
                    </div>
                    <div v-else class="w-full text-left mr-5">
                      <el-select
                        v-model="scope.row.promotion_list"
                        class="cdp-select cdp-select__blue w-full ml-5"
                        :class="{ 'is-error': !scope.row.promotion_valid.valid }"
                        popper-class="cdp-select-popper cdp-select-popper__blue"
                        filterable
                        :fallback-placements="['bottom-end', 'top-end']"
                        :teleported="true"
                      >
                        <el-option
                          v-for="item in scope.row.promotion_options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :selected="item.selected"
                        />
                      </el-select>
                      <div
                        v-if="!scope.row.promotion_valid.valid"
                        class="cdp-text-candypink font-size-12 line-1-5 ml-5"
                      >
                        {{ scope.row.promotion_valid.msg }}
                      </div>
                    </div>
                  </template>
                  <template #operation="scope">
                    <div class="text-right w-full">
                      <ButtonIcon
                        v-if="scope.idx !== 0"
                        class="detail-button"
                        color="red"
                        icon="trash"
                        :isSvg="true"
                        @click="deleteActivity(scope.idx)"
                      />
                    </div>
                  </template>
                </CustomTable>
                <AddActivity
                  class="mt-5"
                  :name="$t('activity_analysis.add_activity_detail')"
                  size="long"
                  :bg="true"
                  @click="addActivity()"
                />
              </section>
            </el-col>
          </el-row>
        </el-form>
        <CdpButton
          class="custom-bg-dark__blue ml-20"
          :name="$t('modal.add')"
          size="sm-130"
          @click="validActivityAdd()"
        />
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
:deep(.el-table) {
  .cell {
    overflow: visible !important;
    .el-popper.cdp-select-popper {
      overflow: scroll;
      right: 0px !important;
      top: 50px !important;
    }
  }
  td.el-table__cell {
    z-index: auto !important;
    padding: 0px 0;
    .cell {
      padding: 0;
    }
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: flex-start !important;
      min-height: 50px;
      .cdp-input.is-error {
        border: #f56c6c 1px solid;
        .el-input__wrapper:hover {
          box-shadow: 0 0 0 1px #f56c6c !important;
        }
      }
      .cdp-select.is-error {
        .el-select__wrapper {
          box-shadow: 0 0 0 1px #f56c6c inset;
        }
        .el-select__wrapper:hover {
          box-shadow: 0 0 0 1px #f56c6c inset !important;
        }
      }
    }
    .row-err {
      min-height: 65px;
    }
    .row-err-long {
      min-height: 87px;
    }
  }
  .el-table__header {
    margin-bottom: 10px;
  }
}
.activity-date-picker {
  :deep(.el-popper.el-picker__popper) {
    inset: 50px auto auto auto !important;
  }
}
:deep(.el-scrollbar__wrap) {
  overflow: visible !important;
}
:deep(.el-table--fit) {
  overflow: visible !important;
}
:deep(.el-table__body-wrapper) {
  overflow: visible !important;
  .el-scrollbar {
    overflow: visible !important;
  }
}
// :deep(.el-table .cell) {
//   overflow: visible !important;
// }
.detail-button {
  min-width: 40px !important;
  width: 85%;
  height: 38px;
  display: inline-block !important;
}
.loading {
  z-index: 2098;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 38px;
}
.line-1-5 {
  line-height: 1.5;
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
