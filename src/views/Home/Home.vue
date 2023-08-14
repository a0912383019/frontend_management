<script setup>
import { watch, ref } from 'vue'
import { useGlobalStore } from '@/stores/global.js'

import TopCard from './components/TopCard.vue'

const globalStore = useGlobalStore()
const key = ref(0)
watch(
  () => globalStore.activeHall.hall_code,
  () => {
    key.value ++
  }
)
</script>
<template>
  <section class="cdp-section">
    <TopCard :key="key"></TopCard>
  </section>
</template>
<style lang="scss" scoped>
.mainArea__container {
  border-radius: 5px;
  border: solid 1px #e6eaf2;
  background-color: #fff;
}
</style>
