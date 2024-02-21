<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Dialog from '@/views/VipCommercialAnalysis/components/Dialog.vue'
import LivelyAnalysis from '@/views/VipCommercialAnalysis/LivelyAnalysis/LivelyAnalysis.vue'
import ActiveTimeAnalysis from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/ActiveTimeAnalysis.vue'
import DayReport from '@/views/VipCommercialAnalysis/DayReport/DayReport.vue'
import WeekReport from '@/views/VipCommercialAnalysis/WeekReport/WeekReport.vue'
import WeekTotalReport from '@/views/VipCommercialAnalysis/WeekTotalReport/WeekTotalReport.vue'

const { t } = useI18n()

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'LivelyAnalysis',
      label: t('vip_commercial_analysis.lively_analysis')
    },
    {
      name: 'ActiveTimeAnalysis',
      label: t('vip_commercial_analysis.active_time_analysis')
    },
    {
      name: 'DayReport',
      label: t('vip_commercial_analysis.day_report')
    },
    {
      name: 'WeekReport',
      label: t('vip_commercial_analysis.week_report')
    },
    {
      name: 'WeekTotalReport',
      label: t('vip_commercial_analysis.week_total_report')
    }
  ]
})

// 當前顯示的tab
const currentTabs = ref('LivelyAnalysis')

// 整理所有 component
const componentMap = {
  LivelyAnalysis,
  ActiveTimeAnalysis,
  DayReport,
  WeekReport,
  WeekTotalReport
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle class="mb-20" icon="menuVIP" :title="$t('sidebar.bbin_vip_commercial_analysis')" />
    <el-row :gutter="20" class="mb-15">
      <el-col :span="19">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="5"></el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
    <Dialog />
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
