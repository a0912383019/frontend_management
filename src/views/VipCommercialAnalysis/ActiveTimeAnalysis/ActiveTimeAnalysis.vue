<script setup>
import Filter from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Filter.vue'
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <!-- <Overview ref="refOverview" @update:detail_api="handleCallDetailApi" />
    <Detail ref="refDetail" /> -->
  </section>
</template>
<style lang="scss" scoped></style>
