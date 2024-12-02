<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore, useGlobalStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiQueryActivityMemberParticipation, apiQueryActivityBetAmountGrowthSpan } from '@/api'
import { errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipColumnSeparate } from '@/utils/highchartsConfig.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { dayjs } from 'element-plus'
import { latest_chart_color } from '@/../public/js/system_config.js'

const { t, locale } = useI18n()

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  },
  activityId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

// 會員參與率
const memberPartiApiSuccess = ref(false)
const memberPartiMessageKey = ref('loading')

const tableData = ref([])
const tableColumns = computed(() => {
  return [
    {
      label: t('activity_analysis.col_name'),
      prop: 'col_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '45%'
    },
    {
      label: t('activity_analysis.col_value'),
      prop: 'col_value',
      headerAlign: 'center',
      align: 'center',
      minWidth: '55%'
    }
  ]
})

// 有效投注成長率區間人數
const commissionableApiSuccess = ref(false)
const commissionableMessageKey = ref('loading')

const chartOptions = reactive({
  chart: {
    type: 'column',
    height: locale.value === 'en' ? 400 : 300,
    marginLeft: locale.value === 'en' ? 120 : 100
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    categories: [],
    labels: {
      rotation: locale.value === 'en' ? -40 : -18,
      style: {
        whiteSpace: 'nowrap', // 避免文字換行
        textOverflow: 'none', // 防止省略號(...)
        fontSize: '12px'
      }
    },
    min: 0,
    max: 10
  },
  legend: {
    enabled: false
  },
  tooltip: {
    ...tooltipDarkConfig,
    useHTML: true,
    formatter() {
      return tooltipColumnSeparate({ showName: false, data: this, sign: t('unit.people') })
    }
  },
  plotOptions: {
    column: {
      borderWidth: 0, // 去除柱狀邊框
      borderRadius: 0
    },
    series: {
      pointWidth: 40, // 每個柱狀的寬度
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [
    {
      data: []
    }
  ]
})

const participateRate = ref(60)

const queryActivityMemberParticipation = async () => {
  memberPartiApiSuccess.value = false
  memberPartiMessageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryActivityMemberParticipation({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id,
      activity_member_betAmount_growth_percent_hide: participateRate.value
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformMemberParticipation(result.data.result)
      memberPartiApiSuccess.value = true
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        memberPartiMessageKey.value = 'noResult'
      } else {
        memberPartiMessageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      memberPartiMessageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      memberPartiMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformMemberParticipation = (data) => {
  tableData.value = [
    {
      col_name: t('activity_analysis.activity_date'),
      col_value: data.activity_detail_date
        .split(' ~ ')
        .map((date) => dayjs(date).format(t('date.format_date_rule')))
        .join(' ~ ')
    },
    {
      col_name: t('activity_analysis.member_list_num'),
      col_value: data.not_reward_member_count
    },
    {
      col_name: t('activity_analysis.achieve_member_count'),
      col_value: data.not_reward_achieve_member_count
    },
    {
      col_name: t('activity_analysis.member_participation_percent'),
      col_value: data.not_reward_member_participation_percent + '%'
    }
  ]
}

const queryActivityBetAmountGrowthSpan = async () => {
  commissionableApiSuccess.value = false
  commissionableMessageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryActivityBetAmountGrowthSpan({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        transformBetAmountGrowthSpan(result.data.result)
        commissionableApiSuccess.value = true
      } else {
        commissionableMessageKey.value = 'noResult'
      }
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        commissionableMessageKey.value = 'noResult'
      } else {
        commissionableMessageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      commissionableMessageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      commissionableMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformBetAmountGrowthSpan = (data) => {
  chartOptions.xAxis.categories = data.span.map((ele) => {
    if (ele.upper !== null) {
      return t('activity_analysis.bet_amount_interval', { lower: ele.lower, upper: ele.upper })
    } else {
      return t('activity_analysis.upper_bet_amount_interval', { lower: ele.lower })
    }
  })

  data.not_reward.forEach((ele, idx) => {
    chartOptions.series[0].data.push({
      name: idx,
      y: ele,
      color: generateRGBColors(latest_chart_color[idx], 0.7)
    })
  })
}

const handleSerach = () => {
  queryActivityMemberParticipation()
}

onMounted(() => {
  queryActivityMemberParticipation()
  queryActivityBetAmountGrowthSpan()
})
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <SectionTitle :title="$t('activity_analysis.member_participation')" class="mb-15">
        <template #tooltip>
          <div
            class="font-size-14"
            v-html="$t('activity_analysis.enter_member_participation_reminder')"
          ></div>
        </template>
      </SectionTitle>
      <CdpMessage :messageKey="memberPartiMessageKey" v-if="memberPartiApiSuccess === false" />
      <div v-else>
        <el-input
          v-model="participateRate"
          :formatter="(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/(,*)/g, '')"
          class="mb-10"
        >
          <template #suffix>
            <span>%</span>
          </template>
          <template #append>
            <el-button @click="handleSerach">
              <font-awesome-icon class="search__iconsearch" icon="fa-magnifying-glass" />
            </el-button>
          </template>
        </el-input>
        <CustomTable
          :stripe="false"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :hasPagination="false"
          :border="true"
          class="cdp-table customCommisionableTable"
        >
        </CustomTable>
      </div>
    </el-col>
    <el-col :span="16">
      <SectionTitle
        :title="$t('activity_analysis.commissionable_growth_duration_num')"
        class="mb-15"
      ></SectionTitle>
      <CdpMessage
        :messageKey="commissionableMessageKey"
        v-if="commissionableApiSuccess === false"
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
:deep(.el-input__suffix-inner) {
  color: rgb(59, 59, 59);
}
</style>
<style lang="scss">
.customCommisionableTable {
  .el-table tbody .el-table__cell {
    padding: 5px 0;
    .cell {
      line-height: normal;
      min-height: 40px;
    }
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
