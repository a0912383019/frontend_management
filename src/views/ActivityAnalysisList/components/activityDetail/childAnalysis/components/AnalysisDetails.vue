<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'
import Tab from '@/components/Tab.vue'
import TagStatistics from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/TagStatistics.vue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { currentDetailTab } = storeToRefs(activityStore)

const props = defineProps({
  activityId: {
    type: Number
  }
})

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'Commissionable',
      label: t('activity_analysis.commissionable_statistics')
    },
    {
      name: 'TagStatistics',
      label: t('activity_analysis.activity_compare_tag_chart')
    },
    {
      name: 'DetailList',
      label: t('activity_analysis.activity_compare_detail_table')
    },
    {
      name: 'History',
      label: t('activity_analysis.activity_compare_tag_chart')
    }
  ]
})

// 整理所有 component
const componentMap = {
  TagStatistics
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentDetailTab.value] || null
})
</script>
<template>
  <section class="cdp-section-in">
    <el-row class="mb-20">
      <el-col :span="14">
        <Tab
          :tabData="tabData"
          :activeName="currentDetailTab"
          v-model="currentDetailTab"
        ></Tab> </el-col
    ></el-row>
    <keep-alive>
      <component :is="currentTabComponent" :activityId="props.activityId"></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped></style>
