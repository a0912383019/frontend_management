<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore, useGlobalStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiQueryActivityMemberParticipation, apiQueryActivityBetAmountGrowthSpan } from '@/api'
import { errorRespond, generateRGBColors, FormatNumber } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipColumnSeparate } from '@/utils/highchartsConfig.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { dayjs } from 'element-plus'
import { latest_chart_color } from '@/../public/js/system_config.js'

const { t, locale } = useI18n()

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
    marginLeft: locale.value === 'en' ? 120 : 50
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    categories: [],
    labels: {
      rotation: locale.value === 'en' ? -40 : -19,
      style: {
        whiteSpace: 'nowrap', // 避免文字換行
        textOverflow: 'none', // 防止省略號(...)
        fontSize: '12px'
      }
    },
    min: 0,
    max: 11
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
      id: currentChildAnalysis.id,
      is_reward: props.isRewarded,
      threshold: participateRate.value
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
    } else if (error.response.status === 404) {
      memberPartiMessageKey.value = 'noResult'
    } else {
      memberPartiMessageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformMemberParticipation = (data) => {
  tableData.value = [
    {
      col_name: t('activity_analysis.activity_duration_now'),
      col_value: data.activity_analysis_date
        .split('~')
        .map((date) => {
          const formatDate = dayjs(date.trim())
          if (formatDate.year() >= 2100) {
            return formatDate.format(t('date.format_date_rule')).replace(/\d/g, '⎻')
          }
          return formatDate.format(t('date.format_date_rule'))
        })
        .join(' ~ ')
    },
    {
      col_name: t('activity_analysis.member_list_num'),
      col_value: data.member_count
    },
    {
      col_name: t('activity_analysis.achieve_member_count'),
      col_value: data.achieve_member_count
    },
    {
      col_name: t('activity_analysis.member_participation_percent'),
      col_value:
        data.participation_percent === null ? '--' : FormatNumber(data.participation_percent) + '%'
    }
  ]
}

const queryActivityBetAmountGrowthSpan = async () => {
  commissionableApiSuccess.value = false
  commissionableMessageKey.value = 'loading'
  try {
    const result = await apiQueryActivityBetAmountGrowthSpan({
      hall_name: activeHall.hall_code,
      id: currentChildAnalysis.id,
      is_reward: props.isRewarded
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
  chartOptions.xAxis.categories = data.map((ele) => {
    if (ele.upper === 0 && ele.lower === 0) {
      return t('activity_analysis.no_bet_amount_interval')
    } else if (ele.upper === 0 && ele.lower === 100) {
      return t('activity_analysis.upper_bet_amount_interval', { lower: ele.lower })
    } else {
      return t('activity_analysis.bet_amount_interval', { lower: ele.lower, upper: ele.upper })
    }
  })

  data.forEach((ele, idx) => {
    chartOptions.series[0].data.push({
      name: idx,
      y: ele.span_count,
      color: generateRGBColors(latest_chart_color[idx], 0.7)
    })
  })
}

const handleInput = (val) => {
  participateRate.value = val
    .replace(/[^0-9-]/g, '') // 保留數字和負號
    .replace(/(?!^)-/g, '') // 只允許負號出現在開頭

  // 限制最小值-100
  if (Number(participateRate.value) < -100) {
    participateRate.value = -100
  }
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
      <el-input
        v-model.number="participateRate"
        @input="handleInput"
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
      <CdpMessage :messageKey="memberPartiMessageKey" v-if="memberPartiApiSuccess === false" />
      <div v-else>
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
