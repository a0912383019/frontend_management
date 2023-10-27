<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import {
  formatDateDuration,
  FormatNumber,
  errorRespond,
  addNumberColor
} from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'
import CurrencySignText from '@/components/CurrencySignText.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { apiQueryLivelyChangeDetail } from '@/api/home.js'
import ActiveDetail from './ActiveDetail.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import CdpMessage from '@/components/CdpMessage.vue'
import { iconStep } from '@/../public/js/system_config.js'

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const { t } = useI18n()
const dialogVisible = ref(false)

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//api是否成功
const apiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const weekDuration = computed(() => {
  return (
    dayjs().subtract(8, 'day').startOf('day').format(t('date.format_date_rule')) +
    ' ~ ' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
  )
})

const refActiveDetail = ref(null) //活躍度明細

const activityTableData = ref([])
//頁面點擊排名欄位
const activityTableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'memberName',
      align: 'center',
      width: 120
    },
    {
      label: t('data_name.deposit'),
      prop: 'deposit',
      align: 'center',
      sortable: 'custom'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'betAmount',
      align: 'center',
      sortable: 'custom'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      align: 'center',
      sortable: 'custom'
    },
    {
      label: t('data_name.bonus'),
      prop: 'bonus',
      align: 'center',
      sortable: 'custom'
    },
    {
      label: t('data_name.profit_and_loss'),
      prop: 'profitAndLoss',
      align: 'center',
      sortable: 'custom'
    },
    {
      label: t('data_name.net_amount'),
      prop: 'netAmount',
      align: 'center',
      sortable: 'custom'
    },
    {
      prop: 'activeLevel',
      align: 'center',
      width: 140
    }
  ]
})

let beforeSort

//取得資料
const queryLivelyChangeDetail = async (livelyChangeAry) => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryLivelyChangeDetail({
      hall_name: activeHall.hall_code,
      search_date: formatDateDuration(weekDuration.value),
      lively_change_ary: livelyChangeAry
    })
    const { return_code } = result.data.status

    if (return_code === '0001') {
      messageKey.value = 'noResult'
    } else if (return_code === '0000' && result.data.result.length !== 0) {
      apiSuccess.value = true
      //整理table對應的資料
      transformLivelyChangeDetail(result.data.result)
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed'
    }
  }
}

// 轉換資料
const transformLivelyChangeDetail = (data) => {
  activityTableData.value = data.map((ele) => {
    return {
      memberName: ele.user_name,
      deposit: FormatNumber(ele.deposit_amount),
      betAmount: FormatNumber(ele.bet_amount),
      payoff: FormatNumber(0 - ele.payoff),
      bonus: FormatNumber(0 - ele.offer_amount),
      profitAndLoss: FormatNumber(ele.profit_loss),
      netAmount: FormatNumber(ele.net_amount),
      user: {
        user_name: ele.user_name,
        user_id: ele.user_id
      },
      lastWeekIcon: iconStep(ele.compare_level),
      thisWeekIcon: iconStep(ele.analysis_level)
    }
  })

  //複製原始data
  beforeSort = activityTableData.value.slice(0)
}

//開啟 dialog
const handleOpenDialog = (lastWeek, thisWeek) => {
  dialogVisible.value = true
  queryLivelyChangeDetail([lastWeek, thisWeek])
}

defineExpose({ handleOpenDialog })

//所有資料排序
const handleSort = ({ prop, order }) => {
  if (order === 'descending') {
    activityTableData.value.sort((a, b) => {
      return parseInt(b[prop].replaceAll(',', '')) - parseInt(a[prop].replaceAll(',', ''))
    })
  } else if (order === 'ascending') {
    activityTableData.value.sort((a, b) => {
      return parseInt(a[prop].replaceAll(',', '')) - parseInt(b[prop].replaceAll(',', ''))
    })
  } else {
    //複製回去，要用複製的不然會改變到beforeSort的值
    activityTableData.value = beforeSort.slice(0)
  }
}

const handleActiveDetailClick = (user) => {
  refActiveDetail.value.handleOpenDialog(user)
}
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-member-activity-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      :alignCenter="true"
    >
      <template #header>
        <span class="cdp-dialog__header">
          {{ $t('member_active_level.detail_changes_in_member_active_level') }}
        </span>
      </template>
      <div class="cdp-section mb-0">
        <div class="flex justify-between align-end mb-5">
          <div>
            <p>{{ $t('date.aggregated_data_statistical_time_period') }}</p>
            <p>{{ $t('date.statistical_time_period') + weekDuration }}</p>
          </div>
          <div>
            <CurrencySignText></CurrencySignText>
          </div>
        </div>
        <CdpMessage
          :messageKey="messageKey"
          bg="white"
          v-if="apiSuccess === false"
          class="mt-25 font-size-16"
        />
        <CustomTable
          v-else
          :stripe="true"
          :tableData="activityTableData"
          :tableColumns="activityTableColumns"
          :hasPagination="true"
          :serverSide="false"
          :pageSize="10"
          @sort="handleSort"
          class="customTable2"
        >
          <template #activeLevel-header>
            <span class="mr-5">{{ $t('member_active_level.active_level') }}</span>
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="font-size-14">
                  {{ $t('date.click_icon_display_last_days_data', { days: 14 }) }}
                  <br />
                  {{ $t('member_active_level.changes') + $t('date.last_week') }}
                  <cdp-icon
                    name="doubleArrowDown"
                    class="iconInTooltip mt-3- font-size-10 ml-5 mr-5"
                  />
                  {{ $t('date.this_week') }}
                </div>
              </template>
              <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
            </el-tooltip>
          </template>
          <template #memberName="scope">
            <span class="cdp-link-click" @click="updateMemberData(scope.row.user)">
              {{ scope.row.memberName }}
            </span>
          </template>
          <template #payoff="scope">
            <span v-html="addNumberColor(scope.row.payoff, 'cdp-text-candypink')"></span>
          </template>
          <template #bonus="scope">
            <span v-html="addNumberColor(scope.row.bonus, 'cdp-text-candypink')"></span>
          </template>
          <template #profitAndLoss="scope">
            <span v-html="addNumberColor(scope.row.profitAndLoss, 'cdp-text-candypink')"></span>
          </template>
          <template #netAmount="scope">
            <span v-html="addNumberColor(scope.row.netAmount, 'cdp-text-candypink')"></span>
          </template>
          <template #activeLevel="scope">
            <span class="activeStepBtn" @click="handleActiveDetailClick(scope.row.user)">
              <font-awesome-icon
                :class="['font-size-30', 'mt-6', 'ml-1', scope.row.lastWeekIcon.color]"
                :icon="['fa-regular', scope.row.lastWeekIcon.icon]"
              />
              <cdp-icon
                name="doubleArrowDown"
                class="iconInTooltip mt-19- font-size-10 ml-10 mr-10"
                :class="scope.row.thisWeekIcon.color"
              />
              <font-awesome-icon
                :class="['font-size-30', 'mt-6', 'ml-1', scope.row.thisWeekIcon.color]"
                :icon="['fa-regular', scope.row.thisWeekIcon.icon]"
              />
            </span>
          </template>
        </CustomTable>
      </div>
    </el-dialog>
  </div>
  <ActiveDetail ref="refActiveDetail" />
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    background-color: #fff;
  }
  &__header {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: bold;
  }
}

.mb-0 {
  margin-bottom: 0;
}

.align-end {
  align-items: end;
}

.mt-3- {
  margin-top: -3px;
}

.mt-19- {
  margin-top: -19px;
}

.iconInTooltip {
  transform: rotate(270deg);
}

:deep(.el-table__body) {
  .el-table__cell {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

.title__icon {
  font-size: 13px;
}

.activeStepBtn {
  cursor: pointer;
}
</style>
<style lang="scss">
.cdp-member-activity-dialog {
  &.cdp-dialog {
    width: 100%;
    max-width: 80%;
  }
}
</style>
