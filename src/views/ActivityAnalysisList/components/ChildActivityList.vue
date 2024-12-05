<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomSelect from '@/views/ActivityAnalysisList/components/customSelect/CustomSelect.vue'
import AddChild from '@/components/Button/AddButton.vue'
import { dayjs } from 'element-plus'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()

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
      minWidth: '26%'
    },
    {
      label: t('activity_analysis.promotion_list'),
      prop: 'promotion_list',
      headerAlign: 'center',
      align: 'center',
      minWidth: '46%'
    },
    {
      prop: 'activity_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '22%'
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
    name: '',
    activity_date: '',
    promotion_name: '',
    offer_id: null,
    original_id: null,
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

const deleteActivity = (idx) => {
  subActivities.value.splice(idx, 1)
}

// 轉換活動分析明細的子活動
const transformChildData = () => {
  subActivities.value = []
  childListData.value.forEach((ele, idx) => {
    subActivities.value[idx] = {
      name: ele.name, // 子活動名稱
      // 子活動優惠區間
      activity_date:
        dayjs(ele.promotion_start_date).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(ele.promotion_end_date).format(t('date.format_date_rule')),
      promotion_name: ele.promotion_name, // 子活動優惠名稱
      offer_id: ele.offer_id, // 子活動優惠名稱 offer_id
      original_id: ele.original_id, // 子活動優惠名稱 original_id
      name_valid: { valid: true, msg: '' },
      promotion_valid: { valid: true, msg: '' },
      disabled: true,
      detail_key: idx
    }
  })
}

const updatePromotion = (val, scope) => {
  const proObj = JSON.parse(val)
  const startDate = dayjs(proObj.start_time).format(t('date.format_date_rule'))
  const endDate =
    dayjs(proObj.end_time).year() >= 2100
      ? dayjs(proObj.end_time).format(t('date.format_date_rule')).replace(/\d/g, '⎻')
      : dayjs(proObj.end_time).format(t('date.format_date_rule'))
  scope.row.activity_date = startDate + ' ~ ' + endDate
  scope.row.promotion_name = proObj.promotion_name
  scope.row.offer_id = proObj.offer_id
  scope.row.original_id = proObj.original_id
}

const clearActivityDate = (scope) => {
  scope.row.activity_date = ''
  scope.row.promotion_name = ''
  scope.row.offer_id = null
  scope.row.original_id = null
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
    if (
      subActivities.value[idx].promotion_name === '' ||
      subActivities.value[idx].offer_id === null ||
      subActivities.value[idx].original_id === null
    ) {
      subActivities.value[idx].promotion_valid.valid = false
      subActivityError = true
      errClass = 'row-err'
    }

    // 子活動名稱驗證（不可空白 && 字數不可超過100）
    if (subActivities.value[idx].name.trim() === '') {
      subActivityError = true
      subActivities.value[idx].name_valid.valid = false
      subActivities.value[idx].name_valid.msg = t(
        'activity_analysis.blank_activity_detail_name_error_msg'
      )
      errClass = 'row-err'
    } else if (subActivities.value[idx].name.length > 100) {
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

onMounted(() => {
  if (props.canEdit) {
    addChild()
  }
})

defineExpose({ getSubActivities, validSubActivities })
</script>
<template>
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
      :class="{ 'is-empty': subActivities && subActivities.length.toString() === '0' }"
    >
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
          <div v-if="!props.canEdit">
            <el-input v-model="scope.row.name" class="cdp-input cdp-input-disabled">
              <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
            </el-input>
          </div>
          <div v-else>
            <el-input
              v-model="scope.row.name"
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
      <template #promotion_list="scope">
        <div class="w-full text-left ml-5 mr-5" v-if="!props.canEdit">
          <el-input
            v-model="scope.row.promotion_name"
            class="cdp-input cdp-input-disabled"
            readonly
          >
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
        </div>
        <CustomSelect
          v-else
          :isValid="scope.row.promotion_valid.valid"
          :promotionData="scope.row"
          @update:promotion="updatePromotion($event, scope)"
          @update:activityDate="clearActivityDate(scope)"
        />
      </template>
      <template #activity_date="scope">
        <div class="w-full text-left ml-5 mr-5">
          <el-input v-model="scope.row.activity_date" class="cdp-input cdp-input-disabled" readonly>
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
.line-1-5 {
  line-height: 1.5;
}
</style>
