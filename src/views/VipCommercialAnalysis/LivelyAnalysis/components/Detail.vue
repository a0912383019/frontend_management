<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { useGlobalStore, useVipCommercialAnalysisStore, useDialogMemberDetailStore } from '@/stores'
import { apiQueryMemberLivelyList } from '@/api'
import {
  FormatNumber,
  addNumberColor,
  errorRespond,
  formatDateDuration,
  stringToIntArray
} from '@/utils/commonUtils.js'
import { iconStep } from '@/../public/js/system_config.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import ActiveDetail from './ActiveDetail.vue'
import ExportCSV from './ExportCSV.vue'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const apiTableResult = ref([]) // 活躍度總覽api資料
const tableData = ref([]) // 活躍度總覽表格

const apiSuccess = ref(false) // 活躍度總覽api是否成功

// 會員明細表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.deposit'),
      prop: 'deposit_amount',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bonus'),
      prop: 'offer_amount',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('data_name.profit_and_loss'),
      prop: 'profit_loss',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('data_name.net_amount'),
      prop: 'net_amount',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      prop: 'activeLevel',
      align: 'center',
      minWidth: '12%'
    }
  ]
})
// 依照不同的messageKey產生不同的message
const messageKey = ref('clickNumberAboveToShow')

const today = computed(() => {
  return dayjs(livelyAnalysisFilter.searchDate).format(t('date.format_date_rule'))
})

// tooltip顯示對應日期
const tooltipDate = computed(() => {
  return {
    lastWeekData: `
    ${dayjs(today.value).subtract(13, 'day').format(t('date.format_date_rule'))} ~
    ${dayjs(today.value).subtract(7, 'day').format(t('date.format_date_rule'))}`,
    thisWeekData: `
      ${dayjs(today.value).subtract(6, 'day').format(t('date.format_date_rule'))} ~
      ${today.value}`
  }
})

// 取得api資料
const queryMemberLivelyList = async (data) => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  livelyAnalysisFilter.detailType = data.type
  livelyAnalysisFilter.livelyLevel = data.level
  let startDate = dayjs(livelyAnalysisFilter.searchDate).subtract(6, 'day').format('YYYY-MM-DD')
  let endDate = dayjs(livelyAnalysisFilter.searchDate).format('YYYY-MM-DD')
  const { customUserList, detailType, fuzzySearch, livelyLevel, searchName, vipTag } =
    livelyAnalysisFilter
  try {
    const result = await apiQueryMemberLivelyList({
      custom_user_list: customUserList,
      detail_type: detailType,
      fuzzy_search: fuzzySearch,
      hall_name: activeHall.hall_code,
      lively_level: livelyLevel,
      search_date: formatDateDuration(`${startDate}~${endDate}`),
      search_name: searchName,
      vip_tag: stringToIntArray(vipTag)
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformQueryMemberLivelyList(result.data.result)
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed'
    }
  }
}

// 整理資料
const transformQueryMemberLivelyList = (data) => {
  tableData.value = data.map((item) => {
    return {
      user_name: item.user_name,
      deposit_amount: FormatNumber(item.deposit_amount),
      bet_amount: FormatNumber(item.bet_amount),
      payoff: FormatNumber(item.payoff),
      offer_amount: FormatNumber(item.offer_amount),
      profit_loss: FormatNumber(item.profit_loss),
      net_amount: FormatNumber(item.net_amount),
      user: {
        user_name: item.user_name,
        user_id: item.user_id
      },
      lastWeekIcon: iconStep(item.compare_level),
      thisWeekIcon: iconStep(item.analysis_level)
    }
  })

  apiTableResult.value = tableData.value.slice(0)
}

// 排序資料
const handleSort = ({ prop, order }) => {
  if (order === 'descending') {
    tableData.value.sort((a, b) => {
      return parseInt(b[prop].replaceAll(',', '')) - parseInt(a[prop].replaceAll(',', ''))
    })
  } else if (order === 'ascending') {
    tableData.value.sort((a, b) => {
      return parseInt(a[prop].replaceAll(',', '')) - parseInt(b[prop].replaceAll(',', ''))
    })
  } else {
    tableData.value = apiTableResult.value.slice(0)
  }
}

const refActiveDetail = ref(null)

const handleActiveDetailClick = (user) => {
  refActiveDetail.value.handleOpenDialog(user)
}

defineExpose({ queryMemberLivelyList, apiSuccess, messageKey })
</script>
<template>
  <section class="cdp-section-in">
    <div class="detail-top-box">
      <SectionTitle :title="$t('member_active_level.active_level_breakdown')">
        <template #tooltip>
          <div class="tooltip-date">
            {{ $t('date.aggregated_data_statistical_time_period') }}<br />
            {{ $t('date.statistical_time_period') }}{{ tooltipDate.thisWeekData }}
          </div>
        </template>
      </SectionTitle>
      <div class="detail-top-box__right" v-show="apiSuccess">
        <CurrencySignText class="mr-20" />
        <ExportCSV />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      v-if="apiSuccess === true"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="true"
      :stripe="true"
      :serverSide="false"
      :pageSize="15"
      @sort="handleSort"
      class="customTable2"
    >
      <!-- 活躍度表頭 -->
      <template #activeLevel-header>
        <span class="mr-5">{{ $t('member_active_level.active_level') }}</span>
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <div class="font-size-14">
              {{ $t('date.click_icon_display_last_days_data', { days: 90 }) }}
              <br />
              {{ $t('member_active_level.changes') + $t('date.last_week') }}
              <cdp-icon class="iconInTooltip header" name="doubleArrowDown" />
              {{ $t('date.this_week') }}
            </div>
          </template>
          <font-awesome-icon icon="fa-solid fa-circle-info" />
        </el-tooltip>
      </template>

      <!-- 會員名稱 -->
      <template #user_name="scope">
        <span class="cdp-link-click" @click="updateMemberData(scope.row.user)">
          {{ scope.row.user_name }}
        </span>
      </template>

      <!-- 損益 -->
      <template #payoff="scope">
        <span v-html="addNumberColor(scope.row.payoff, 'cdp-text-candypink')"></span>
      </template>

      <!-- 優惠獎金 -->
      <template #offer_amount="scope">
        <span v-html="addNumberColor(scope.row.offer_amount, 'cdp-text-candypink')"></span>
      </template>

      <!-- 實際損益 -->
      <template #profit_loss="scope">
        <span v-html="addNumberColor(scope.row.profit_loss, 'cdp-text-candypink')"></span>
      </template>

      <!-- 淨額 -->
      <template #net_amount="scope">
        <span v-html="addNumberColor(scope.row.net_amount, 'cdp-text-candypink')"></span>
      </template>

      <!-- 活躍度 -->
      <template #activeLevel="scope">
        <div class="activeStepBtn cursor-pointer" @click="handleActiveDetailClick(scope.row.user)">
          <font-awesome-icon
            :class="['font-size-30', scope.row.lastWeekIcon.color]"
            :icon="['fa-regular', scope.row.lastWeekIcon.icon]"
          />
          <cdp-icon
            name="doubleArrowDown"
            class="iconInTooltip mt-19- font-size-10 ml-10 mr-10"
            :class="scope.row.thisWeekIcon.color"
          />
          <font-awesome-icon
            :class="['font-size-30', scope.row.thisWeekIcon.color]"
            :icon="['fa-regular', scope.row.thisWeekIcon.icon]"
          />
        </div>
      </template>
    </CustomTable>
    <ActiveDetail ref="refActiveDetail" />
  </section>
</template>
<style lang="scss" scoped>
.detail-top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  &__right {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
}
.activeStepBtn {
  display: inline-flex;
  align-items: center;
}
:deep(.iconInTooltip) {
  transform: rotate(270deg);
  &.header {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
