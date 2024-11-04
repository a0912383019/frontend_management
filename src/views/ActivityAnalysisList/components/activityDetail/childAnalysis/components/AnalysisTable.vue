<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActivityCompareOverview } from '@/api'
import { useGlobalStore, useExportListStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import DeleteBox from '@/views/ExportReportList/components/DeleteBox.vue'
import SearchDetailBox from '@/views/ExportReportList/components/SearchDetailBox.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import PercentWithIcon from '@/components/PercentWithIcon.vue'

const { t } = useI18n()

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  },
  activityId: {
    type: Number
  },
  detailId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const performanceApiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const performanceMessageKey = ref('loading')

const performanceTableData = ref([])

const performanceTableColumns = computed(() => {
  return [
    {
      label: t('activity_analysis.activity_duration'),
      prop: 'activity_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('activity_analysis.data_duration'),
      prop: 'data_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
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
      minWidth: '14%'
    }
  ]
})

const queryActivityCompareOverview = async () => {
  performanceApiSuccess.value = false
  performanceMessageKey.value = 'loading'
  performanceTableData.value = []
  try {
    const result = await apiQueryActivityCompareOverview({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: props.detailId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      performanceApiSuccess.value = true
      if (result.data.result.length !== 0) {
        performanceTableData.value = transformPerformance(result.data.result)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      performanceMessageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      performanceMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformPerformance = (data) => {
  if (!props.isRewarded) return
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
      rate: '-20',
      commissionable_day_avg: dataObj.commissionable_avg,
      profit_day_avg: dataObj.commissionable_avg,
      bonus_day_avg: dataObj.commissionable_avg,
      hall_profit_day_avg: dataObj.commissionable_avg
    }

    result.push(tempObj)
  })

  console.log(result)
  return result
}

onMounted(() => {
  console.log(props.detailId)
  queryActivityCompareOverview()
})
</script>
<template>
  <section class="cdp-section-in mb-0">
    <SectionTitle
      :title="$t('activity_analysis.performance_analysis')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="performanceMessageKey" v-if="performanceApiSuccess === false" />
    <div v-else>
      <CustomTable
        :serverSide="false"
        :tableData="performanceTableData"
        :tableColumns="performanceTableColumns"
        :stripe="true"
        :hasPagination="false"
        class="customTable2 customAnalysisTable"
      >
        <template #data_duration="scope">
          <div>
            {{ scope.row.data_duration }}
            <br />
            {{ scope.row.date_count }}
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
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.customAnalysisTable {
  .el-table tbody .el-table__cell {
    padding: 5px 0;
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
    }
  }
}
</style>
