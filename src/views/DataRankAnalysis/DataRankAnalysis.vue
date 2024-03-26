<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import BetAmountRank from '@/views/DataRankAnalysis/BetAmount/BetAmount.vue'
import Growth from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/Growth.vue'
import Decline from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/Decline.vue'

const { t } = useI18n()

// tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'BetAmountRank',
      label: t('rank_analysis.bet_amount_rank')
    },
    {
      name: 'Growth',
      label: t('rank_analysis.bet_amount_growth_rank')
    },
    {
      name: 'Decline',
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
const currentTabs = ref('Growth')

// 整理所有 component
const componentMap = {
  BetAmountRank,
  Growth,
  Decline
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
      <el-col :span="5"></el-col>
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
:deep(.filter-box) {
  position: absolute;
  right: 0;
  top: -57px;
}
</style>
