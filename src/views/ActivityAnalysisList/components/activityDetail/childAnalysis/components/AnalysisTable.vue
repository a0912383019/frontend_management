<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActivityCompareOverview } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import PercentWithIcon from '@/components/PercentWithIcon.vue'
import { errorRespond, FormatNumber, addNumberColor } from '@/utils/commonUtils.js'

const { t } = useI18n()

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const apiSuccess = ref(false) //api是否成功

// 依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const performanceTableData = ref([])
const performanceTableColumns = computed(() => {
  return [
    {
      prop: 'activity_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('activity_analysis.data_duration'),
      prop: 'data_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '17%'
    },
    {
      label: t('activity_analysis.deposit_day_avg'),
      prop: 'deposit_day_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '14%'
    },
    {
      label: t('activity_analysis.commissionable_day_avg'),
      prop: 'commissionable_day_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '14%'
    },
    {
      label: t('activity_analysis.profit_day_avg'),
      prop: 'profit_day_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '14%'
    },
    {
      label: t('activity_analysis.bonus_day_avg'),
      prop: 'bonus_day_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '14%'
    },
    {
      label: t('activity_analysis.hall_profit_day_avg'),
      prop: 'profit_day_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    }
  ]
})

const proportionTableData = ref([])
const proportionTableColumns = computed(() => {
  return [
    {
      prop: 'activity_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('activity_analysis.data_duration'),
      prop: 'data_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '17%'
    },
    {
      label: t('activity_analysis.commissionable_people_proportion'),
      prop: 'commissionable_people_proportion',
      headerAlign: 'center',
      align: 'center',
      minWidth: '13%'
    },
    {
      label: t('activity_analysis.commissionable_proportion'),
      prop: 'commissionable_proportion',
      headerAlign: 'center',
      align: 'center',
      minWidth: '13%'
    },
    {
      label: t('activity_analysis.deposit_proportion'),
      prop: 'deposit_proportion',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('activity_analysis.deposit_count'),
      prop: 'deposit_count',
      headerAlign: 'center',
      align: 'center',
      minWidth: '9%'
    },
    {
      label: t('data_name.active_member'),
      prop: 'active_member',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    },
    {
      label: t('activity_analysis.people_tags_count'),
      prop: 'people_tags_count',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    },
    {
      label: t('activity_analysis.register_in_30_days'),
      prop: 'register_in_30_days',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const queryActivityCompareOverview = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  performanceTableData.value = []
  proportionTableData.value = []

  try {
    const result = await apiQueryActivityCompareOverview({
      hall_name: activeHall.hall_code,
      id: currentChildAnalysis.id,
      is_reward: props.isRewarded
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        transformCompareOverview(result.data.result)
        apiSuccess.value = true
      } else {
        messageKey.value = 'noResult'
      }
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
    if (error.response.status === 403) {
      messageKey.value = 'noPermission'
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else if (error.response.status === 404) {
      messageKey.value = 'noResult'
    } else {
      messageKey.value = 'queryFailed'
    }
  }
}

// 轉換資料
const transformCompareOverview = (data) => {
  let performanceResult = []
  let proportionResult = []
  let durationKey = ['before', 'current', 'after']
  let durationName = [
    t('activity_analysis.activity_before'),
    t('activity_analysis.activity_now'),
    t('activity_analysis.activity_after')
  ]

  durationKey.map((key, idx) => {
    let dataObj = data[key]
    const startDate =
      dayjs(dataObj.start_date).year() >= 2100
        ? dayjs(dataObj.start_date).format(t('date.format_date_rule')).replace(/\d/g, '⎻')
        : dayjs(dataObj.start_date).format(t('date.format_date_rule'))
    const endDate =
      dayjs(dataObj.end_date).year() >= 2100
        ? dayjs(dataObj.end_date).format(t('date.format_date_rule')).replace(/\d/g, '⎻')
        : dayjs(dataObj.end_date).format(t('date.format_date_rule'))

    let performanceTempObj = {
      activity_duration: durationName[idx],
      data_duration: startDate + ' ~ ' + endDate,
      // 日均存款
      deposit_day_avg: FormatNumber(dataObj.average.deposit, '', 2),
      deposit_day_avg_rate: FormatNumber(dataObj.growth_rate.deposit),
      // 日均有效投注
      commissionable_day_avg: FormatNumber(dataObj.average.commissionable, '', 2),
      commissionable_day_avg_rate: FormatNumber(dataObj.growth_rate.commissionable),
      // 日均損益
      payoff_day_avg: addNumberColor(FormatNumber(dataObj.average.payoff, '', 2)),
      payoff_day_avg_rate: FormatNumber(dataObj.growth_rate.payoff),
      // 日均優惠獎金
      bonus_day_avg: FormatNumber(dataObj.average.offer, '', 2),
      bonus_day_avg_rate: FormatNumber(dataObj.growth_rate.offer),
      // 日均實際損益
      profit_day_avg: addNumberColor(FormatNumber(dataObj.average.profit, '', 2)),
      profit_day_avg_rate: FormatNumber(dataObj.growth_rate.profit)
    }

    let proportionTempObj = {
      activity_duration: durationName[idx],
      data_duration: startDate + ' ~ ' + endDate,
      // 有效投注人數占比
      commissionable_people_proportion: FormatNumber(dataObj.ratio.commissionable_count, '', 2),
      commissionable_people_proportion_rate: FormatNumber(
        dataObj.growth_rate.ratio_commissionable_count,
        '',
        2
      ),
      // 整體有效投注占比
      commissionable_proportion: FormatNumber(dataObj.ratio.commissionable, '', 2),
      commissionable_proportion_rate: FormatNumber(dataObj.growth_rate.ratio_commissionable, '', 2),
      // 整體存款佔比
      deposit_proportion: FormatNumber(dataObj.ratio.deposit, '', 2),
      deposit_proportion_rate: FormatNumber(dataObj.growth_rate.ratio_deposit, '', 2),
      // 存款人數
      deposit_count: dataObj.count.deposit,
      deposit_count_rate: FormatNumber(dataObj.growth_rate.deposit_count),
      // 實動人數
      active_member: dataObj.count.active,
      active_member_rate: FormatNumber(dataObj.growth_rate.active_count),
      // 標籤人數
      people_tags_count: dataObj.count.label,
      people_tags_count_rate: FormatNumber(dataObj.growth_rate.label_count),
      // 註冊30天內人數
      register_in_30_days: dataObj.count.register,
      register_in_30_days_rate: FormatNumber(dataObj.growth_rate.register_count)
    }

    performanceResult.push(performanceTempObj)
    proportionResult.push(proportionTempObj)
  })

  performanceTableData.value = performanceResult
  proportionTableData.value = proportionResult
}

onMounted(() => {
  queryActivityCompareOverview()
})
</script>
<template>
  <section class="cdp-section-in mb-20">
    <SectionTitle
      :title="$t('activity_analysis.performance_analysis')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div v-else>
      <CustomTable
        :serverSide="false"
        :tableData="performanceTableData"
        :tableColumns="performanceTableColumns"
        :stripe="true"
        :hasPagination="false"
        class="customTable2 customAnalysisTable"
      >
        <template #activity_duration-header>
          <span class="mr-5">{{ $t('activity_analysis.activity_duration') }}</span>
          <el-tooltip effect="dark" placement="right">
            <template #content>
              <div class="font-size-14">
                <div class="font-black mb-10">{{ $t('activity_analysis.data_stat_period') }}</div>
                <div>{{ $t('activity_analysis.within_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.before_2_weeks') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.activity_now_with_colon') }}</div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ongoing') }}</li>
                </div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ended') }}</li>
                </div>
                <div class="ml-14 mb-10">{{ $t('activity_analysis.after_2_weeks') }}</div>
                <div>{{ $t('activity_analysis.beyond_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.before_2_weeks') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.activity_now_with_colon') }}</div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ongoing_last_90') }}</li>
                </div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ended_last_90') }}</li>
                </div>
                <div class="ml-14 mb-10">{{ $t('activity_analysis.after_2_weeks') }}</div>
              </div>
            </template>
            <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </template>
        <template #data_duration="scope">
          <div>
            {{ scope.row.data_duration }}
          </div>
        </template>
        <template #deposit_day_avg="scope">
          <div>
            {{ scope.row.deposit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.deposit_day_avg_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #commissionable_day_avg="scope">
          <div>
            {{ scope.row.commissionable_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.commissionable_day_avg_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #profit_day_avg="scope">
          <div class="flex flex-col">
            <div v-html="scope.row.payoff_day_avg"></div>
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.payoff_day_avg_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #bonus_day_avg="scope">
          <div>
            {{ scope.row.bonus_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.bonus_day_avg_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #hall_profit_day_avg="scope">
          <div class="flex flex-col">
            <div v-html="scope.row.hall_profit_day_avg"></div>
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.profit_day_avg_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
      </CustomTable>
    </div>
  </section>
  <section class="cdp-section-in mb-20">
    <SectionTitle
      :title="$t('activity_analysis.proportion_people_analysis')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div v-else>
      <CustomTable
        :serverSide="false"
        :tableData="proportionTableData"
        :tableColumns="proportionTableColumns"
        :stripe="true"
        :hasPagination="false"
        class="customTable2 customAnalysisTable"
      >
        <template #activity_duration-header>
          <span class="mr-5">{{ $t('activity_analysis.activity_duration') }}</span>
          <el-tooltip effect="dark" placement="right">
            <template #content>
              <div class="font-size-14">
                <div class="font-black mb-10">{{ $t('activity_analysis.data_stat_period') }}</div>
                <div>{{ $t('activity_analysis.within_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.before_2_weeks') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.activity_now_with_colon') }}</div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ongoing') }}</li>
                </div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ended') }}</li>
                </div>
                <div class="ml-14 mb-10">{{ $t('activity_analysis.after_2_weeks') }}</div>
                <div>{{ $t('activity_analysis.beyond_90_days') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.before_2_weeks') }}</div>
                <div class="ml-14">{{ $t('activity_analysis.activity_now_with_colon') }}</div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ongoing_last_90') }}</li>
                </div>
                <div class="ml-28">
                  <li>{{ $t('activity_analysis.status_ended_last_90') }}</li>
                </div>
                <div class="ml-14 mb-10">{{ $t('activity_analysis.after_2_weeks') }}</div>
              </div>
            </template>
            <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </template>
        <template #data_duration="scope">
          <div>
            {{ scope.row.data_duration }}
          </div>
        </template>
        <template #commissionable_people_proportion="scope">
          <div>
            {{ scope.row.commissionable_people_proportion + '%' }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.commissionable_people_proportion_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #commissionable_proportion="scope">
          <div>
            {{ scope.row.commissionable_proportion + '%' }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.commissionable_proportion_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #deposit_proportion="scope">
          <div>
            {{ scope.row.deposit_proportion + '%' }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.deposit_proportion_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #deposit_count="scope">
          <div>
            {{ scope.row.deposit_count }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.deposit_count_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #active_member="scope">
          <div>
            {{ scope.row.active_member }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.active_member_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #people_tags_count="scope">
          <div>
            {{ scope.row.people_tags_count }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.people_tags_count_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #register_in_30_days="scope">
          <div>
            {{ scope.row.register_in_30_days }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.register_in_30_days_rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
      </CustomTable>
    </div>
  </section>
</template>
<style lang="scss">
.customAnalysisTable {
  .el-table tbody .el-table__cell {
    padding: 5px 0;
    .cell {
      line-height: normal;
    }
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 43px;
    }
  }
}
</style>
