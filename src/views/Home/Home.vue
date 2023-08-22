<script setup>
import { watch, ref } from 'vue'
import { useGlobalStore } from '@/stores/global.js'
import TopCard from './components/TopCard.vue'
import NotificationTables from './components/NotificationTables.vue'
import LifeStep from './components/LifeStep.vue'

const globalStore = useGlobalStore()
const key = ref('')
watch(
  () => globalStore.activeHall.hall_code,
  () => {
    key.value = globalStore.activeHall.hall_code
  }
)
</script>
<template>
  <section class="cdp-section">
    <TopCard :key="key"></TopCard>
  </section>
  <el-row :gutter="20" class="mb-20">
    <el-col :span="15">
      <NotificationTables :key="key"></NotificationTables>
    </el-col>
    <el-col :span="9">
      <LifeStep :key="key"></LifeStep>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.mainArea__container {
  border-radius: 5px;
  border: solid 1px #e6eaf2;
  background-color: #fff;
}
</style>
