<script setup>
import { ref } from 'vue'
import LifeCyclePeopleChanges from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/LifeCyclePeopleChanges.vue'
import StepOverview from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/StepOverview.vue'
import MemberDetails from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/MemberDetails.vue'

const step = ref(null)
const member = ref(null)

const callApi = () => {
  step.value.query_life_cycle_analysis_avg_data()
  member.value.query_life_cycle_analysis_detail_tbl()
  member.value.tableGoToFirstPage() //表格頁碼切換到第一頁
}
</script>
<template>
  <!-- 會員階段人數變化 -->
  <LifeCyclePeopleChanges @queryStepTrendAnalysis="callApi" />
  <section class="cdp-section-in">
    <!-- 階段總覽 -->
    <StepOverview ref="step" class="mb-30" />
    <MemberDetails ref="member" />
  </section>
</template>
<style lang="scss" scoped></style>
