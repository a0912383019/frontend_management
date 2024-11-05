<script setup>
import { ref, computed } from 'vue'
import { useActivityAnalysisStore } from '@/stores'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'

const props = defineProps({
  activityId: {
    type: Number
  },
  detailId: {
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
const {isChildFiltered } = activityStore

const isRewarded = ref(false)

const key = computed(() => {
  let newKey = 0
  if (props.currentView === 'NotRewardComponents' && props.isChildFiltered !== isChildFiltered) {
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
    :detailId="props.detailId"
  />
</template>
<style lang="scss" scoped></style>
