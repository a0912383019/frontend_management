<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryPromotionList } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import AddChild from '@/components/Button/AddButton.vue'
import { dayjs } from 'element-plus'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { childListData } = storeToRefs(activityStore)

const props = defineProps({
  canEdit: {
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
      minWidth: '22%'
    },
    {
      label: t('activity_analysis.filter_date'),
      prop: 'filter_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '21%'
    },
    {
      prop: 'promotion_list',
      headerAlign: 'center',
      align: 'center',
      minWidth: '30%'
    },
    {
      prop: 'activity_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '21%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '6%'
    }
  ]
})

const createSubActivity = () => {
  return {
    activity_detail_name: '',
    filter_date: '',
    promotion_list: '',
    promotion_options: [],
    activity_date: '',
    api_success: false,
    name_valid: { valid: true, msg: '' },
    promotion_valid: { valid: true, msg: '' },
    disabled: false,
    detail_key: new Date().getTime()
  }
}

const subActivities = ref([])

const maxLimit = ref(false)
const addBtnDisabled = computed({
  get() {
    return !props.canEdit || maxLimit.value
  },
  set(newValue) {
    maxLimit.value = newValue
  }
})

const addChild = () => {
  if (!addBtnDisabled.value) {
    subActivities.value.push(createSubActivity())
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
const queryPromotionList = async (detailKey) => {
  let start_date = ''
  let end_date = ''
  subActivities.value.forEach((ele, idx) => {
    if (ele.detail_key === detailKey) {
      subActivities.value[idx].api_success = false
      subActivities.value[idx].promotion_list = ''
      start_date = ele.filter_date.split('~').map((date) => date.trim())[0]
      end_date = ele.filter_date.split('~').map((date) => date.trim())[1]
    }
  })

  try {
    const result = await apiQueryPromotionList({
      hall_name: activeHall.hall_code,
      start_date: start_date,
      end_date: end_date
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      let promotionOptions = generateOptions(result.data.result)
      subActivities.value.forEach((ele, idx) => {
        if (ele.detail_key === detailKey) {
          subActivities.value[idx].promotion_options = promotionOptions
          subActivities.value[idx].api_success = true
        }
      })
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

const updatePromotionList = (disabled, detailKey, idx) => {
  if (isDeleting.value || disabled) return
  // 第一次渲染組件會有不同步問題，el-table 尚未渲染完畢 scope.$index 會是 -1
  // 但是 daterangepicker 已開始渲染，所以在跑 onMounted 這邊的idx 會是-1
  if (idx !== -1) {
    queryPromotionList(detailKey)
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

const transformChildData = () => {
  subActivities.value = []
  childListData.value.forEach((ele, idx) => {
    subActivities.value[idx] = {
      activity_detail_name: ele.activity_detail_name,
      filter_date:
        dayjs(ele.activity_start_date).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(ele.activity_end_date).format(t('date.format_date_rule')),
      promotion_name: ele.promotion_name,
      promotion_list: ele.promotion_name,
      promotion_options: ele.promotion_name,
      activity_date:
        dayjs(ele.activity_start_date).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(ele.activity_end_date).format(t('date.format_date_rule')),
      name_valid: { valid: true, msg: '' },
      promotion_valid: { valid: true, msg: '' },
      disabled: true,
      api_success: true,
      detail_key: idx
    }
  })
}

const getSubActivities = () => {
  return subActivities.value
}

// 驗證資料
const validSubActivities = () => {
  let subActivityError = false
  subActivities.value.forEach((val, idx) => {
    let errClass = ''
    subActivities.value[idx].name_valid.valid = true
    subActivities.value[idx].promotion_valid.valid = true

    // 優惠名單驗證必選（此驗證msg不會有換行的情況因此放在前面）
    if (subActivities.value[idx].promotion_list === '') {
      subActivityError = true
      subActivities.value[idx].promotion_valid.valid = false
      subActivities.value[idx].promotion_valid.msg = t(
        'activity_analysis.blank_promotion_error_msg'
      )
      errClass = 'row-err'
    }

    // 子活動名稱驗證（不可空白 && 字數不可超過100）
    if (subActivities.value[idx].activity_detail_name.trim() === '') {
      subActivityError = true
      subActivities.value[idx].name_valid.valid = false
      subActivities.value[idx].name_valid.msg = t(
        'activity_analysis.blank_activity_detail_name_error_msg'
      )
      errClass = 'row-err'
    } else if (subActivities.value[idx].activity_detail_name.length > 100) {
      subActivityError = true
      subActivities.value[idx].name_valid.valid = false
      subActivities.value[idx].name_valid.msg = t(
        'activity_analysis.activity_detail_name_length_limit_error_msg'
      )
      errClass = locale.value === 'en' ? 'row-err-long' : 'row-err'
    }

    // 變化驗證文字的高度
    const cells = document.querySelectorAll(`.el-dialog .el-table tr:nth-child(${idx + 1}) .cell`)
    cells.forEach((cell) => {
      cell.classList.remove('row-err', 'row-err-long')
      if (subActivityError) {
        cell.classList.add(errClass)
      }
    })
  })
  return !subActivityError
}

watch(
  () => childListData.value,
  () => {
    if (childListData.value.length !== 0) {
      transformChildData()
    }
  }
)

watch(
  () => props.canEdit,
  () => {
    if (!props.canEdit) {
      transformChildData()
    }
  }
)

watch(
  () => subActivities.value.length,
  (newLength) => {
    maxLimit.value = newLength >= 20
  }
)

defineExpose({ getSubActivities, validSubActivities })
</script>
<template>
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
        class="customTable2"
        :class="{ 'is-empty': childListData.value && childListData.value.length === 0 }"
      >
        <template #promotion_list-header>
          <span class="mr-5">{{ $t('activity_analysis.promotion_list') }}</span>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="font-size-14">
                {{ $t('activity_analysis.activity_detail_connect_promotion_reminder') }}
              </div>
            </template>
            <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </template>
        <template #activity_date-header>
          <span class="mr-5">{{ $t('activity_analysis.activity_date') }}</span>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="font-size-14">
                <div class="font-black mb-10">{{ $t('activity_analysis.auto_fill') }}</div>
                <div>{{ $t('activity_analysis.within_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.status_ongoing') }}</div>
                <div class="ml-14 mb-10">{{ $t('activity_analysis.status_ended') }}</div>
                <div>{{ $t('activity_analysis.beyond_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.status_ongoing_last_90') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.status_ended_last_90') }}</div>
              </div>
            </template>
            <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </template>
        <template #activity_detail_name="scope">
          <div class="w-full text-left mr-5">
            <div v-if="scope.row.disabled">
              <el-input
                v-model="scope.row.activity_detail_name"
                class="cdp-input cdp-input-disabled"
              >
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </div>
            <div v-else>
              <el-input
                v-model="scope.row.activity_detail_name"
                class="cdp-input"
                :class="{ 'is-error': !scope.row.name_valid.valid }"
              ></el-input>
              <div
                v-if="!scope.row.name_valid.valid"
                class="cdp-text-candypink font-size-12 line-1-5"
              >
                {{ scope.row.name_valid.msg }}
              </div>
            </div>
          </div>
        </template>
        <template #filter_date="scope">
          <div v-if="scope.row.disabled" class="w-full text-left ml-5 mr-5">
            <el-input v-model="scope.row.filter_date" class="cdp-input cdp-input-disabled" readonly>
              <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
            </el-input>
          </div>
          <DatepickerRange
            v-else
            v-model="scope.row.filter_date"
            :rangeDate="scope.row.filter_date"
            :config="8"
            :shortcutsConfig="1"
            :disableDate="false"
            @update:modelValue="
              updatePromotionList(scope.row.disabled, scope.row.detail_key, scope.idx)
            "
            class="w-full filter-datepicker activity-date-picker ml-5 mr-5"
          />
        </template>
        <template #promotion_list="scope">
          <div class="loading" v-if="!scope.row.api_success">
            <LoadingBox color="blue" size="sm" />
          </div>
          <div v-else class="w-full text-left ml-5 mr-5">
            <div v-if="scope.row.disabled">
              <el-input v-model="scope.row.promotion_name" class="cdp-input cdp-input-disabled">
                <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
              </el-input>
            </div>
            <div v-else>
              <el-select
                v-model="scope.row.promotion_list"
                class="cdp-select cdp-select__blue w-full"
                :class="{ 'is-error': !scope.row.promotion_valid.valid }"
                popper-class="cdp-select-popper__blue"
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
                class="cdp-text-candypink font-size-12 line-1-5"
              >
                {{ scope.row.promotion_valid.msg }}
              </div>
            </div>
          </div>
        </template>
        <template #activity_date="scope">
          <div class="w-full text-left ml-5 mr-5">
            <el-input
              v-model="scope.row.activity_date"
              class="cdp-input cdp-input-disabled"
              readonly
            >
              <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
            </el-input>
          </div>
        </template>
        <template #operation="scope">
          <div class="text-right w-full">
            <ButtonIcon
              v-if="subActivities.length > 1 && props.canEdit"
              class="detail-button"
              color="red"
              icon="trash"
              :isSvg="true"
              @click="deleteActivity(scope.idx)"
            />
          </div>
        </template>
      </CustomTable>
      <AddChild
        class="mt-5"
        :name="$t('activity_analysis.add_activity_detail')"
        size="long"
        :bg="true"
        :disabled="addBtnDisabled"
        @click="addChild()"
      />
    </section>
  </el-col>
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
// 當無資料時隱藏查無資料
.is-empty {
  :deep(.el-table__body-wrapper) {
    display: none;
  }
}
:deep(.el-table) {
  .cell {
    overflow: visible !important;
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
      min-height: 84px;
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
</style>
