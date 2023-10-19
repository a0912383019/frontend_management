<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiQueryStepTrendAnalysisOverview } from '@/api/manageAnalysis.js'
import { addNumberColor, FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import FilterDate from '@/components/Filter/FilterDate.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import StepConfig from '@/components/StepConfig.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { stepTrendRangeDate, filterDateStepTrendTimestamp } = storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const apiTableResult = ref([]) //趨勢分析總覽api資料
const tableData = ref([]) //趨勢分析總覽表格

//趨勢分析總覽表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.life_cycle_step'),
      prop: 'step_name',
      headerAlign: 'center',
      align: 'left',
      minWidth: '20%'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'right',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.bet_amount_ratio'),
      prop: 'bet_amount_percent',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'right',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.profit_ratio'),
      prop: 'gross_percent',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    }
  ]
})

const query_step_trend_analysis_overview_tbl = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryStepTrendAnalysisOverview({
      hall_name: activeHall.hall_code,
      search_date: stepTrendRangeDate.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true //取得資料成功
      apiTableResult.value = []
      apiTableResult.value = result.data.result //存放取得的api資料
      //資料處理
      transform_step_trend_analysis_overview_tbl(result.data.result)
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      apiSuccess.value = false
      apiTableResult.value = []
      tableData.value = []
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'chartFailed'
      apiSuccess.value = false
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//轉換趨勢分析總覽表格資料
const transform_step_trend_analysis_overview_tbl = (data) => {
  const ary = [] //存放轉換後的資料
  // 階段0不處理，從階段1開始
  for (let i = 0; i < data.length; i++) {
    //產生階段對應文字
    let tempObj = {}
    tempObj['step_index'] = i + 1 //階段名稱的設定
    tempObj['bet_amount'] = FormatNumber(data[i].bet_amount) //貨量
    tempObj['bet_amount_percent'] = FormatNumber(data[i].bet_amount_percent) + '%' //獲量佔比
    tempObj['payoff'] = addNumberColor(
      FormatNumber((0 - data[i].payoff).toString()),
      'cdp-text-candypink'
    ) //損益
    tempObj['gross_percent'] = addNumberColor(
      FormatNumber((0 - data[i].gross_percent).toString()) + '%',
      'cdp-text-candypink'
    ) //獲利率
    ary.push(tempObj)
  }
  tableData.value = []
  tableData.value = ary
}

//日期更新後執行的動作
const updateTimestamp = (data) => {
  //將資料寫到pinia
  manageAnalysisStore.filterDateStepTrendTimestamp = data['timestamp']
  manageAnalysisStore.stepTrendRangeDate = data['rangeDate']
}

watch(i18nLocale, () => {
  transform_step_trend_analysis_overview_tbl(apiTableResult.value)
})

//監聽FilterDate.vue時間戳記
watch(
  () => filterDateStepTrendTimestamp.value,
  () => {
    query_step_trend_analysis_overview_tbl()
  }
)

defineExpose({ query_step_trend_analysis_overview_tbl })
</script>
<template>
  <section class="cdp-section">
    <div class="section-top-filter">
      <FilterDate @update:timestamp="updateTimestamp" />
    </div>
    <div class="cdp-section__top">
      <SectionTitle
        class="mb-15"
        :title="$t('manage_analysis.life_cycle_step_profit_overview')"
      ></SectionTitle>
      <CurrencySignText />
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />

    <CustomTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      border
      v-if="apiSuccess === true"
    >
      <template #step_name="scope">
        <div class="cdp-link-box">
          <StepConfig :stepIndex="scope.row.step_index" />
        </div>
      </template>
      <template #payoff="scope">
        <div v-html="scope.row.payoff"></div>
      </template>
      <template #gross_percent="scope">
        <div v-html="scope.row.gross_percent"></div>
      </template>
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  position: relative;
  .section-top-filter {
    position: absolute;
    right: 0;
    top: -65px;
  }
  &__top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
