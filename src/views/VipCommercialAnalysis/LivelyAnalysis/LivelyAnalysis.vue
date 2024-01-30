<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Filter.vue'
import Overview from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Overview.vue'
import Detail from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Detail.vue'

const refOverview = ref(null)
const refDetail = ref(null)

const handleCallApi = () => {
  refOverview.value.queryLivelyAnalysisOverview()
  refDetail.value.apiSuccess = false
  refDetail.value.messageKey = 'clickNumberAboveToShow'
}

// 呼叫明細表格 api
const handleCallDetailApi = (data) => {
  refDetail.value.queryMemberLivelyList(data)
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <Overview ref="refOverview" @update:detail_api="handleCallDetailApi" />
    <Detail ref="refDetail" />
  </section>
</template>
<style lang="scss" scoped>
.filter-box {
  position: absolute;
  right: 0;
  top: -56px;
}
</style>
