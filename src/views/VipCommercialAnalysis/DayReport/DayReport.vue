<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/DayReport/components/Filter.vue'
import Report from '@/views/VipCommercialAnalysis/DayReport/components/Report.vue'

const refReport = ref(null)

const handleCallApi = () => {
  refReport.value.queryDayReport()
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <!-- 日報表 -->
    <Report ref="refReport" />
  </section>
</template>
<style lang="scss" scoped></style>
