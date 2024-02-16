<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Filter.vue'
import Total from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Total.vue'
import Profit from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Profit.vue'

const refTotal = ref(null)
const refProfit = ref(null)

const handleCallApi = () => {
  refTotal.value.queryWeekTotalReport()
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <!-- 每週統計報表 -->
    <Total ref="refTotal" />

    <!-- 損益區間統計 -->
    <Profit ref="refProfit" />
  </section>
</template>
<style lang="scss" scoped></style>
