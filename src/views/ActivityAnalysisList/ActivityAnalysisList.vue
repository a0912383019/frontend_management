<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Overview from '@/views/ActivityAnalysisList/components/Overview.vue'
import AddActivity from '@/components/Button/AddButton.vue'
import Filter from '@/views/ActivityAnalysisList/Filter.vue'
import { useActivityAnalysisStore } from '@/stores'

const activityStore = useActivityAnalysisStore()

const { t } = useI18n()

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'Overview',
      label: t('activity_analysis.overview')
    },
    {
      name: 'GrowthRate',
      label: t('activity_analysis.growth_rate')
    },
    {
      name: 'GrowthGap',
      label: t('activity_analysis.growth_gap')
    },
    {
      name: 'TotalSum',
      label: t('activity_analysis.total')
    }
  ]
})

// 當前顯示的tab
const currentTabs = ref('Overview')

// 整理所有 component
const componentMap = {
  Overview
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})

const openAddDialog = () => {
  console.log('add')
}

onUnmounted(() => {
  activityStore.initFilter()
})
</script>
<template>
  <section class="cdp-section mb-0">
    <PageTitle class="mb-20" icon="menuActivity" :title="$t('sidebar.activity_analysis_list')" />
    <el-row :gutter="20" class="mb-20">
      <el-col :span="15">
        <Tab :tabData="tabData" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
      <el-col :span="9">
        <div v-if="currentTabs === 'Overview'" class="flex items-center justify-end mb-20">
          <AddActivity
            class="mr-10"
            :name="$t('activity_analysis.add_activity')"
            @click="openAddDialog"
          />
          <Filter />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped></style>
