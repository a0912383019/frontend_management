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
import { errorRespond, FormatNumber } from '@/utils/commonUtils.js'

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

//依照不同的messageKey產生不同的message
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
      prop: 'hall_profit_day_avg',
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
  try {
    const result = await apiQueryActivityCompareOverview({
      hall_name: activeHall.hall_code,
      activity_id_hide: 67,
      // activity_detail_id_hide: currentChildAnalysis.id
      activity_detail_id_hide: 1
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        apiSuccess.value = true
        performanceTableData.value = transformPerformance(result.data.result)
        proportionTableData.value = transformProportion(result.data.result)
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
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformProportion = (data) => {
  let result = []
  let durationKey = ['before', 'current', 'after']
  let durationName = [
    t('activity_analysis.activity_before'),
    t('activity_analysis.activity_now'),
    t('activity_analysis.activity_after')
  ]

  durationKey.map((key, idx) => {
    let dataObj = data.reward[key]
    let tempObj = {
      activity_duration: durationName[idx],
      data_duration: dataObj.date_range
        .split('~')
        .map((date) => dayjs(date).format(t('date.format_date_rule')))
        .join(' ~ '),
      date_count: t('activity_analysis.total_day_num', { day_num: dataObj.day_diff }),
      deposit_day_avg: dataObj.commissionable_avg,
      rate: FormatNumber('-2072783'),
      commissionable_day_avg: dataObj.commissionable_avg,
      profit_day_avg: dataObj.commissionable_avg,
      bonus_day_avg: dataObj.commissionable_avg,
      hall_profit_day_avg: dataObj.commissionable_avg
    }

    result.push(tempObj)
  })

  return result
}

const transformPerformance = (data) => {
  let result = []
  let durationKey = ['before', 'current', 'after']
  let durationName = [
    t('activity_analysis.activity_before'),
    t('activity_analysis.activity_now'),
    t('activity_analysis.activity_after')
  ]

  durationKey.map((key, idx) => {
    let dataObj = data.reward[key]
    let tempObj = {
      activity_duration: durationName[idx],
      data_duration: dataObj.date_range
        .split('~')
        .map((date) => dayjs(date).format(t('date.format_date_rule')))
        .join(' ~ '),
      date_count: t('activity_analysis.total_day_num', { day_num: dataObj.day_diff }),
      deposit_day_avg: FormatNumber(dataObj.commissionable_avg),
      rate: FormatNumber('-2000923.3332'),
      commissionable_day_avg: FormatNumber(dataObj.commissionable_avg),
      profit_day_avg: FormatNumber(dataObj.commissionable_avg),
      bonus_day_avg: FormatNumber(dataObj.commissionable_avg),
      hall_profit_day_avg: FormatNumber(dataObj.commissionable_avg)
    }

    result.push(tempObj)
  })

  return result
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
              :percentData="scope.row.rate"
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
              :percentData="scope.row.rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #profit_day_avg="scope">
          <div>
            {{ scope.row.profit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.rate"
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
              :percentData="scope.row.rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #hall_profit_day_avg="scope">
          <div>
            {{ scope.row.hall_profit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.rate"
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
        <template #deposit_day_avg="scope">
          <div>
            {{ scope.row.deposit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.rate"
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
              :percentData="scope.row.rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #profit_day_avg="scope">
          <div>
            {{ scope.row.profit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.rate"
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
              :percentData="scope.row.rate"
              iconSize="12"
              fontSize="14"
              fontWeight="normal"
            ></PercentWithIcon>
          </div>
        </template>
        <template #hall_profit_day_avg="scope">
          <div>
            {{ scope.row.hall_profit_day_avg }}
            <br />
            <PercentWithIcon
              v-if="scope.idx > 0"
              :percentData="scope.row.rate"
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
