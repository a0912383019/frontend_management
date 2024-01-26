<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import LifeCycleAnalysis from './components/LifeCycleAnalysis/LifeCycleAnalysis.vue'
import StepTrendAnalysis from './components/StepTrendAnalysis/StepTrendAnalysis.vue'

const { t } = useI18n()

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'LifeCycleAnalysis',
      label: t('manage_analysis.life_cycle_analysis')
    },
    {
      name: 'StepTrendAnalysis',
      label: t('manage_analysis.step_trend_analysis')
    }
  ]
})

//當前顯示的tab
const currentTabs = ref('LifeCycleAnalysis')

//當前的component
const currentTabComponent = computed(() => {
  let result = null
  switch (currentTabs.value) {
    case 'LifeCycleAnalysis':
      result = LifeCycleAnalysis
      break
    case 'StepTrendAnalysis':
      result = StepTrendAnalysis
      break
  }
  return result
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle class="mb-20" icon="menuManage" :title="$t('sidebar.bbin_manage_analysis')" />
    <el-row :gutter="20" class="mb-20">
      <el-col :span="13">
        <Tab
          :tabData="tabData"
          :activeName="currentTabs"
          class="tabs-manage-analysis"
          v-model="currentTabs"
        ></Tab>
      </el-col>
      <el-col :span="11"></el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped>
.tabs-manage-analysis {
  width: 100%;
  max-width: 445px;
}
</style>
