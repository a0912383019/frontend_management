<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Tab from '@/components/Tab.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import RankerDetail from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/RankerDetail.vue'
import DetailChart from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/DetailChart.vue'
import { useGlobalStore, useDataRankAnalysisStore } from '@/stores'
import { apiBetAmountGrowthDeclineRank } from '@/api'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dataRankStore = useDataRankAnalysisStore()
const { growthDecayFilter } = dataRankStore

const refContent = ref(null)

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'RankerDetail',
      label: t('rank_analysis.ranker_detail')
    },
    {
      name: 'DetailChart',
      label: t('rank_analysis.detail_chart')
    }
  ]
})

// 當前顯示的tab
const currentTabs = ref('RankerDetail')

// 整理所有 component
const componentMap = {
  RankerDetail,
  DetailChart
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})

const apiObject = reactive({
  apiSuccess: false,
  messageKey: 'loading',
  result: {}
})

const clientWidth = ref(0)

// 取得資料
const queryBetAmountRank = async () => {
  apiObject.messageKey = 'loading'
  apiObject.apiSuccess = false
  apiObject.result = {}
  try {
    const result = await apiBetAmountGrowthDeclineRank({
      hall_name: activeHall.hall_code,
      financial_month: growthDecayFilter.financialMonth,
      financial_week: growthDecayFilter.financialWeek,
      financial_year: growthDecayFilter.financialYear,
      order: 'DESC',
      rank_num: growthDecayFilter.rank
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiObject.result = result.data.result
      apiObject.apiSuccess = true
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiObject.messageKey = 'noResult'
      } else {
        apiObject.messageKey = 'queryFailed'
      }
    }
  } catch (error) {
    console.error(error)
    apiObject.apiSuccess = false //取得資料失敗
    if (error.response.status === 403) {
      apiObject.messageKey = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      apiObject.messageKey = 'queryFailed' //更改message內容
    }
  }
}

onMounted(() => {
  clientWidth.value = refContent.value.clientWidth
  if (!growthDecayFilter.isFirst) {
    queryBetAmountRank()
  }
})

watch(
  () => dataRankStore.growthDecayAgainNum,
  () => {
    queryBetAmountRank()
  }
)
</script>
<template>
  <section class="cdp-section-in mb-0" ref="refContent">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="16" class="flex justify-end items-end">
        <CurrencySignText v-show="currentTabs === 'RankerDetail'" />
      </el-col>
    </el-row>
    <div class="component-box" :class="{ show: dataRankStore.currentTab === 'Growth' }">
      <keep-alive>
        <component
          :is="currentTabComponent"
          :apiObject="apiObject"
          :clientWidth="clientWidth"
        ></component>
      </keep-alive>
    </div>
  </section>
</template>
<style lang="scss" scoped>
:deep(.cdp-section-in) {
  position: relative;
}
:deep(.filter-box) {
  position: absolute;
  right: 0;
  top: -57px;
}
.component-box {
  opacity: 0;
  transition: all 0.5s;
  &.show {
    opacity: 1;
    transition-delay: 1s;
  }
}
</style>
