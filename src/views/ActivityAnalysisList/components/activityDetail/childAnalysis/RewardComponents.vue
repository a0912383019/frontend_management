<script setup>
import { computed, ref } from 'vue'
import { useActivityAnalysisStore } from '@/stores'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'

const props = defineProps({
  activityId: {
    type: Number
  },
  currentView: {
    type: String
  },
  isChildFiltered: {
    type: Number
  }
})

const activityStore = useActivityAnalysisStore()
const { isChildFiltered } = activityStore

const isRewarded = ref(true)

const key = computed(() => {
  let newKey = 0
  if (props.currentView === 'RewardComponents' && props.isChildFiltered !== isChildFiltered) {
    newKey = props.isChildFiltered
  }

  return newKey
})
</script>
<template>
  <AnalysisTable
    :key="key"
    :isRewarded="isRewarded"
    :activityId="props.activityId"
  />
</template>
