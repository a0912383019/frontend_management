<script setup>
import { onMounted, ref, computed, nextTick, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore, useGlobalStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import { apiQueryActivityTagsRank, apiQueryActivityBetAmountGrowthSpanTags } from '@/api'
import { getSessionStorageEntity, generateMultipleColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipSingleShared } from '@/utils/highchartsConfig.js'

const { t } = useI18n()

const props = defineProps({
  activityId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const refTable = ref(null)

// 各標籤人數
const tagsRankApiSuccess = ref(false)
const tagsRankMessageKey = ref('loading')

const tableData = ref([])
const tableColumns = computed(() => {
  return [
    {
      label: t('tags.tag_name'),
      prop: 'tag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '55%'
    },
    {
      label: t('unit.unit_people'),
      prop: 'unit_people',
      headerAlign: 'center',
      align: 'center',
      minWidth: '25%'
    },
    {
      type: 'selection',
      align: 'center',
      minWidth: '20%',
      className: 'cdp-checkbox__blue checkbox-svg'
    }
  ]
})

// 有效投注成長率區間各標籤人數
const betAmountGrowthApiSuccess = ref(false)
const betAmountGrowthMessageKey = ref('loading')

const chartOptions = reactive({
  chart: {
    type: 'column'
    // height: 300
  },
  xAxis: {
    // gridLineColor: '#e8e8e8',
    // gridLineWidth: 1,
    // lineColor: '#e8e8e8',
    // tickColor: '#e8e8e8',
    // tickWidth: 1,
    labels: {
      allowOverlap: false
    },
    categories: []
  },
  legend: {
    enabled: true
  },
  // yAxis: {
  //   gridLineColor: '#e8e8e8'
  // },
  // tooltip: {
  //   ...tooltipDarkConfig,
  //   shared: true,
  //   useHTML: true,
  //   formatter() {
  //     return tooltipSingleShared({ data: this.points, hallCode: activeHall.hall_code })
  //   }
  // },
  plotOptions: {
    column: {
      stacking: 'percent',
      dataLabels: {
        enabled: true,
        // formatter: function () {
        //   return FormatNumber(this.y)
        // }
      }
    }
  },
  series: [
    {
      name: 'Road',
      data: [434, 290, 307],
      color: '#4f84cf'
    },
    {
      name: 'Rail',
      data: [272, 153, 156]
    },
    {
      name: 'Air',
      data: [13, 7, 8]
    },
    {
      name: 'Sea',
      data: [55, 35, 41]
    }
  ]
})

const queryActivityTagsRank = async () => {
  tagsRankApiSuccess.value = false
  tagsRankMessageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryActivityTagsRank({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        tableData.value = transformTagsRank(result.data.result)
        tagsRankApiSuccess.value = true
        await nextTick()
        refTable.value.selectionAll(true)
      } else {
        tagsRankMessageKey.value = 'noResult'
      }
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        tagsRankMessageKey.value = 'noResult'
      } else {
        tagsRankMessageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      tagsRankMessageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      tagsRankMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const tag_description_dict = getSessionStorageEntity('system_config').tags_config
const tagColorObj = ref({})

const transformTagsRank = (data) => {
  let result = []

  // 產生 bar svg 的顏色
  let color = generateMultipleColors(data.not_reward.length)['bg']

  data.not_reward.forEach((ele, idx) => {
    let tableData = {
      tag_name: tag_description_dict[ele.tag_code].tag_name,
      unit_people: ele.total_count,
      tag_code: ele.tag_code.toString(),
      bar_color: color[idx]
    }

    tagColorObj.value[ele.tag_code] = color[idx]

    result.push(tableData)
  })

  queryActivityBetAmountGrowthSpanTags()

  return result
}

const generateCheckboxBar = ({ row }) => {
  let styleRes = {
    '--my-color-var': row.bar_color
  }

  return styleRes
}

const handleSelect = (selection, row) => {
  console.log(selection)
  console.log(row)
}

const queryActivityBetAmountGrowthSpanTags = async () => {
  betAmountGrowthApiSuccess.value = false
  betAmountGrowthMessageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryActivityBetAmountGrowthSpanTags({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        transformBetAmountGrowthSpanTags(result.data.result)
        betAmountGrowthApiSuccess.value = true
      } else {
        betAmountGrowthMessageKey.value = 'noResult'
      }
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        betAmountGrowthMessageKey.value = 'noResult'
      } else {
        betAmountGrowthMessageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      betAmountGrowthMessageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      betAmountGrowthMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformBetAmountGrowthSpanTags = (data) => {
  // console.log(data)
  chartOptions.xAxis.categories = data.span.map((ele) => {
    console.log(ele.upper)
    if (ele.upper !== null) {
      return t('activity_analysis.bet_amount_interval', { lower: ele.lower, upper: ele.upper })
    } else {
      return t('activity_analysis.upper_bet_amount_interval', { lower: ele.lower })
    }
  })

  console.log(chartOptions.xAxis)
}

onMounted(() => {
  queryActivityTagsRank()
})
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <SectionTitle
        :title="$t('activity_analysis.tags_member_number')"
        class="mb-15"
      ></SectionTitle>
      <CdpMessage :messageKey="tagsRankMessageKey" v-if="tagsRankApiSuccess === false" />
      <div v-else>
        <CustomTable
          ref="refTable"
          :serverSide="false"
          :pageSize="10"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :stripe="false"
          :border="true"
          :hasPagination="true"
          :hasTotalPagination="false"
          :cellStyle="generateCheckboxBar"
          :selectCheckbox="handleSelect"
          class="customTable1 customTagNumberTable"
        >
          <template #tag_name="scope">
            <GenerateTagsBadge
              v-if="scope.idx !== -1"
              :hall_name="activeHall.hall_code"
              :tag_code="scope.row.tag_code"
            />
          </template>
        </CustomTable>
      </div>
    </el-col>
    <el-col :span="16">
      <SectionTitle
        :title="$t('activity_analysis.commissionable_growth_rate_count')"
        class="mb-15"
      ></SectionTitle>
      <CdpMessage
        :messageKey="betAmountGrowthMessageKey"
        v-if="betAmountGrowthApiSuccess === false"
      />
      <template v-else>
        <div class="cursor-pointer">
          <highcharts :options="chartOptions"></highcharts>
        </div>
      </template>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
:deep(.el-table) {
  tbody {
    .checkbox-svg {
      .cell:before {
        width: 18px;
        height: 12px;
        content: '';
        mask: url(@/assets/icons/bar.svg) no-repeat;
        mask-size: cover;
        background-color: var(--my-color-var);
        margin-right: 7px;
      }
    }
  }
}
:deep(.paginationBox) {
  flex-direction: column;
  .el-pagination {
    order: 2;
    padding-top: 5px;
  }
  .totalPagination {
    order: 1;
    position: relative;
    transform: none;
    text-align: center;
  }
}
</style>
<style lang="scss">
.customTagNumberTable {
  // .el-table tbody .el-table__cell {
  //   padding: 5px 0;
  //   .cell {
  //     line-height: normal;
  //   }
  // }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 26px;
    }
  }
}
</style>
