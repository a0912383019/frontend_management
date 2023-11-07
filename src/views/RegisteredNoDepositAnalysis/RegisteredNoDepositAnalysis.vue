<script setup>
import { ref } from 'vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Overview from './components/Overview.vue'
import Detail from './components/Detail.vue'
import Filter from './components/Filter.vue'

const keyOverview = ref(0)

const refDetail = ref()

// 送出篩選取得存款機率區間總覽
const handleSubmit = () => {
  keyOverview.value = new Date().getTime()
  refDetail.value.queryActionScoreDetail()
}

// 存款機率區間會員明細
const handleGetDetail = (val) => {
  refDetail.value.queryActionScoreDetail(val)
}
</script>
<template>
  <section class="cdp-section">
    <div class="flex justify-between items-center mb-20">
      <PageTitle icon="menuDeposit" :title="$t('sidebar.bbin_registered_no_deposit_analysis')" />
      <Filter @update:filter-submit="handleSubmit" />
    </div>
    <Overview :key="keyOverview" @update:detail="handleGetDetail" />
    <Detail ref="refDetail" />
  </section>
</template>
<style lang="scss" scoped></style>
