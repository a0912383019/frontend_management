<script setup>
import { ref, reactive, watch, onMounted, defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiQueryLifeCycleAnalysisAvgData } from '@/api/manageAnalysis.js'
import { FormatNumber, getHallCurrencySign } from '@/utils/commonUtils.js'
import FilterDate from '@/components/Filter/FilterDate.vue'
import ExportCSV from './components/ExportCSV.vue'
import AvgCard from './components/AvgCard.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { queryDate } = manageAnalysisStore
const {
  searchName,
  fuzzySearch,
  stepType,
  detailType,
  filterTimestamp,
  deatilRangeDate,
  filterDateTimestamp,
  filterCustomUserList
} = storeToRefs(manageAnalysisStore)
const apiSuccess = ref(false) //階段總覽api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const stepData = reactive({
  deposit: {
    data: null
  }, //日均存款資料
  betAmount: {
    data: null
  }, //日均獲量資料
  payoff: {
    data: null,
    className: ''
  } //日均損益資料
})

//取得階段總覽api
const query_life_cycle_analysis_avg_data = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryLifeCycleAnalysisAvgData({
      custom_user_list: filterCustomUserList.value,
      hall_name: activeHall.hall_code,
      query_date: queryDate,
      life_cycle_analysis_detail_date: deatilRangeDate.value,
      life_cycle_analysis_step: stepType.value,
      detail_type: detailType.value,
      search_name: searchName.value,
      fuzzy_search: fuzzySearch.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      const { avg_bet_amount, avg_deposit_amount, avg_payoff } = result.data.result
      apiSuccess.value = true //取得資料成功
      //日均存款
      stepData['deposit']['data'] = FormatNumber(
        avg_deposit_amount,
        getHallCurrencySign('BBIN', activeHall.hall_code)
      )
      //日均貨量
      stepData['betAmount']['data'] = FormatNumber(
        avg_bet_amount,
        getHallCurrencySign('BBIN', activeHall.hall_code)
      )
      //日均損益
      stepData['payoff']['data'] = FormatNumber(
        (0 - avg_payoff).toString(),
        getHallCurrencySign('BBIN', activeHall.hall_code)
      )
      stepData['payoff']['className'] = 0 - avg_payoff < 0 ? 'cdp-text-candypink' : ''
    } else {
      messageKey.value = 'chartFailed'
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

//日期更新後執行的動作
const updateTimestamp = (data) => {
  //將資料寫到pinia
  manageAnalysisStore.filterDateTimestamp = data['timestamp']
  manageAnalysisStore.deatilRangeDate = data['rangeDate']
}

//處理Message
onMounted(() => {
  //顯示 點擊上方總覽表格數值顯示明細 message
  messageKey.value = 'clickNumberAboveToShow'
})

//監聽FilterMemberName.vue時間戳記
watch(
  () => filterTimestamp.value,
  () => {
    apiSuccess.value = false
    messageKey.value = 'clickNumberAboveToShow'
  }
)

//監聽FilterDate.vue時間戳記
watch(
  () => filterDateTimestamp.value,
  () => {
    query_life_cycle_analysis_avg_data()
  }
)

defineExpose({ query_life_cycle_analysis_avg_data })
</script>
<template>
  <div>
    <div class="step-top-box">
      <SectionTitle class="mb-15" :title="$t('manage_analysis.life_cycle_step_overview')" />
      <div class="step-top-box__right">
        <ExportCSV class="mr-10" v-if="apiSuccess" />
        <FilterDate @update:timestamp="updateTimestamp" v-show="apiSuccess" />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <el-row :gutter="20" v-else>
      <el-col :span="8">
        <AvgCard
          icon="fa-solid fa-piggy-bank"
          :title="$t('data_name.daily_avg_deposit')"
          :price="stepData['deposit']['data']"
          itemBgColor="#59b7c8"
          itemShadowColor="#2b8696"
          cardBgColor="#dceff2"
        />
      </el-col>
      <el-col :span="8">
        <AvgCard
          icon="fa-solid fa-money-bill-wave"
          :title="$t('data_name.daily_avg_bet_amount')"
          :price="stepData['betAmount']['data']"
          itemBgColor="#c68961"
          itemShadowColor="#c68961"
          cardBgColor="#f3e5dc"
        />
      </el-col>
      <el-col :span="8">
        <AvgCard
          icon="fa-solid fa-chart-area"
          :title="$t('data_name.daily_avg_payoff')"
          :class="stepData['payoff']['className']"
          :price="stepData['payoff']['data']"
          itemBgColor="#ca8484"
          itemShadowColor="#a05a5a"
          cardBgColor="#f2e3e3"
        />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.step-top-box {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  margin-bottom: 43px;
  &__right {
    display: flex;
  }
}
</style>
