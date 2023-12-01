<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useGlobalStore } from '@/stores/global.js'
import LifeCycleStepProfitOverview from './components/LifeCycleStepProfitOverview.vue'
import DailyLifeCycleStepPeople from './components/DailyLifeCycleStepPeople.vue'

const life = ref(null)
const daily = ref(null)
const globalStore = useGlobalStore()
const { activeHall } = globalStore

onMounted(() => {
  if (activeHall.hall_code !== '' && activeHall.hall_code !== undefined) {
    nextTick(() => {
      life.value.query_step_trend_analysis_overview_tbl()
      daily.value.query_step_total_people()
    })
  }
})

watch(
  () => activeHall.hall_code,
  () => {
    life.value.query_step_trend_analysis_overview_tbl()
    daily.value.query_step_total_people()
  }
)
</script>
<template>
  <LifeCycleStepProfitOverview ref="life" />
  <DailyLifeCycleStepPeople ref="daily" />
</template>
<style lang="scss" scoped></style>
