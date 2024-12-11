<script setup>
import { ref, watch } from 'vue'
import { useActivityAnalysisStore } from '@/stores'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'
import AnalysisDetails from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisDetails.vue'

const activityStore = useActivityAnalysisStore()

const key = ref(0)
const isRewarded = ref(false)

watch([() => activityStore.childActiveView, () => activityStore.isChildFiltered], () => {
  if (activityStore.childActiveView === 'NotRewardComponents') {
    key.value = activityStore.isChildFiltered
  }
})
</script>
<template>
  <AnalysisTable :key="key" :isRewarded="isRewarded" />
  <AnalysisDetails :key="key" :isRewarded="isRewarded" />
</template>
