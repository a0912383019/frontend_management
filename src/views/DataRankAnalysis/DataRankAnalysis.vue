<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import BetAmountRank from '@/views/DataRankAnalysis/BetAmount/BetAmount.vue'
import PositiveProfitRank from '@/views/DataRankAnalysis/ProfitRank/PositiveProfitRank.vue'
import NegativeProfitRank from '@/views/DataRankAnalysis/ProfitRank/NegativeProfitRank.vue'
import { useDataRankAnalysisStore } from '@/stores'
import Filter from '@/views/DataRankAnalysis/ProfitRank/components/Filter.vue'

const dataRankStore = useDataRankAnalysisStore()

const { t } = useI18n()

// tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'BetAmountRank',
      label: t('rank_analysis.bet_amount_rank')
    },
    {
      name: 'BetAmountGrowthRank',
      label: t('rank_analysis.bet_amount_growth_rank')
    },
    {
      name: 'BetAmountDeclineRank',
      label: t('rank_analysis.bet_amount_decline_rank')
    },
    {
      name: 'PositiveProfitRank',
      label: t('rank_analysis.positive_profit_rank')
    },
    {
      name: 'NegativeProfitRank',
      label: t('rank_analysis.negative_profit_rank')
    }
  ]
})

// 當前顯示的tab
const currentTabs = ref('BetAmountRank')

// 整理所有 component
const componentMap = {
  BetAmountRank,
  PositiveProfitRank,
  NegativeProfitRank
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle class="mb-20" icon="menuData" :title="$t('sidebar.bbin_rank_analysis')" />
    <el-row :gutter="20" class="mb-20">
      <el-col :span="19">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="5">
        <div class="filter-box-out">
          <Filter
            v-if="currentTabs === 'PositiveProfitRank' || currentTabs === 'NegativeProfitRank'"
          />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped>
:deep(.cdp-section-in) {
  position: relative;
}
:deep(.filter-box-out) {
  position: absolute;
  right: 10px;
  top: 5px;
}
</style>
