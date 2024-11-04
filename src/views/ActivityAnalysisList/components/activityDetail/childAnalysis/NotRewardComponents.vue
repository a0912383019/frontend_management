<script setup>
import { ref } from 'vue'
import { useActivityAnalysisStore } from '@/stores'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'

const props = defineProps({
  activityId: {
    type: Number
  },
  detailId: {
    type: Number
  }
})

const activityStore = useActivityAnalysisStore()

const isRewarded = ref(false)
</script>
<template>
  <AnalysisTable
    :key="activityStore.isChildFiltered"
    :isRewarded="isRewarded"
    :activityId="props.activityId"
    :detailId="props.detailId"
  />
</template>
<style lang="scss" scoped></style>
