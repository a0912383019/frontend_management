<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Filter from './components/Filter.vue'
import AmountAnalysis from './components/AmountAnalysis/AmountAnalysis.vue'
import PayoffAnalysis from './components/PayoffAnalysis/PayoffAnalysis.vue'

const { t } = useI18n()

const refFilter = ref(null)

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'AmountAnalysis',
      label: t('game_tag_analysis.game_bet_amount_analysis')
    },
    {
      name: 'PayoffAnalysis',
      label: t('game_tag_analysis.game_payoff_analysis')
    }
  ]
})

//當前顯示的tab
const currentTabs = ref('AmountAnalysis')

//當前的component
const currentTabComponent = computed(() => {
  let result = null
  switch (currentTabs.value) {
    case 'AmountAnalysis':
      result = AmountAnalysis
      break
    case 'PayoffAnalysis':
      result = PayoffAnalysis
      break
  }
  return result
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle icon="menuGame" class="mb-20" :title="$t('sidebar.bbin_game_tag_analysis')" />
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <Tab
          :tabData="tabData"
          :activeName="currentTabs"
          class="tabs-game-tag-analysis"
          v-model="currentTabs"
        ></Tab>
      </el-col>
      <el-col :span="16">
        <div class="flex justify-end">
          <Filter ref="refFilter" />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped>
.tabs-game-tag-analysis {
  width: 100%;
  max-width: 445px;
}

.mb-0 {
  margin-bottom: 0px !important;
}
</style>
