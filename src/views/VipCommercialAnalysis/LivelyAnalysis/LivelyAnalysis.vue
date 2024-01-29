<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Filter.vue'
import Overview from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Overview.vue'

const refOverview = ref(null)

const handleCallApi = () => {
  refOverview.value.queryLivelyAnalysisOverview()
}
</script>
<template>
  <section class="relative">
    <div class="filter-box"><Filter @update:filter="handleCallApi" /></div>
    <Overview ref="refOverview" />
  </section>
</template>
<style lang="scss" scoped>
.filter-box {
  position: absolute;
  right: 0;
  top: -56px;
}
</style>
