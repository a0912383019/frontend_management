<script setup>
import { ref } from 'vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Overview from './components/Overview.vue'
import Detail from './components/Detail.vue'
import Filter from './components/Filter.vue'

const keyOverview = ref(0)

const handleSubmit = () => {
  keyOverview.value = new Date().getTime()
}
</script>
<template>
  <section class="cdp-section">
    <div class="flex justify-between items-center mb-20">
      <PageTitle icon="menuDeposit" :title="$t('sidebar.bbin_registered_no_deposit_analysis')" />
      <Filter @update:filter-submit="handleSubmit" />
    </div>
    <Overview :key="keyOverview" />
    <Detail />
  </section>
</template>
<style lang="scss" scoped></style>
