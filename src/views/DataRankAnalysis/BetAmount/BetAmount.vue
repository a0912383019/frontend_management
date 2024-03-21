<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Tab from '@/components/Tab.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import Filter from '@/views/DataRankAnalysis/BetAmount/components/Filter.vue'
import RankerDetail from '@/views/DataRankAnalysis/BetAmount/components/RankerDetail.vue'
import DetailChart from '@/views/DataRankAnalysis/BetAmount/components/DetailChart.vue'
import { useGlobalStore, useDataRankAnalysisStore } from '@/stores'
import { apiQueryBetAmountRank } from '@/api'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dataRankStore = useDataRankAnalysisStore()
const { betAmountFilter } = dataRankStore

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
  apiRecordsTotal: 0,
  result: {}
})

const clientWidth = ref(0)

// 取得資料
const queryBetAmountRank = async () => {
  apiObject.messageKey = 'loading'
  apiObject.apiSuccess = false
  try {
    const result = await apiQueryBetAmountRank({
      hall_name: activeHall.hall_code,
      rank_date: betAmountFilter.searchDate,
      rank_num: betAmountFilter.rank,
      users_detail_date: betAmountFilter.searchDate
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiObject.result = result.data.result
      apiObject.apiSuccess = true
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiObject.apiRecordsTotal = 0
        apiObject.messageKey = 'noResult'
      } else {
        apiObject.apiRecordsTotal = 0
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

const handleCallApi = () => {
  queryBetAmountRank()
}

onMounted(() => {
  clientWidth.value = refContent.value.clientWidth
  // 將篩選恢復成預設值
  queryBetAmountRank()
})
</script>
<template>
  <section class="cdp-section-in mb-0" ref="refContent">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="16" class="flex justify-end items-end">
        <CurrencySignText v-show="currentTabs === 'RankerDetail'" />
      </el-col>
    </el-row>
    <keep-alive>
      <component
        :is="currentTabComponent"
        :apiObject="apiObject"
        :clientWidth="clientWidth"
      ></component>
    </keep-alive>
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
.vtal-b {
  vertical-align: bottom;
}
</style>
