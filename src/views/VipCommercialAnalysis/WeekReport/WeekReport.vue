<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/WeekReport/components/Filter.vue'
import Report from '@/views/VipCommercialAnalysis/WeekReport/components/Report.vue'

const refReport = ref(null)

const handleCallApi = () => {
  refReport.value.queryWeekReport()
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <!-- 每週統計報表 -->
    <Report ref="refReport" />
  </section>
</template>
<style lang="scss" scoped></style>
