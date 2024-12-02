<script setup>
import { ref, watch } from 'vue'
import { useActivityAnalysisStore } from '@/stores'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'
import AnalysisDetails from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisDetails.vue'

const props = defineProps({
  activityId: {
    type: Number
  }
})

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
  <AnalysisTable :key="key" :isRewarded="isRewarded" :activityId="props.activityId" />
  <AnalysisDetails :key="key" :isRewarded="isRewarded" :activityId="props.activityId" />
</template>
