<script setup>
import { watch, ref } from 'vue'
import { useGlobalStore } from '@/stores/global.js'
import TopCard from './components/TopCard.vue'
import NotificationTables from './components/NotificationTables.vue'
import LifeStep from './components/LifeStep.vue'
import MemberActive from './components/MemberActive.vue'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { systemConfigIsOk } = storeToRefs(globalStore)

const key = ref(systemConfigIsOk.value)

watch(
  () => systemConfigIsOk.value,
  () => {
    // if (systemConfigIsOk.value !== 0 && !globalStore.hallChange) {
    if (systemConfigIsOk.value !== 0) {
      key.value = systemConfigIsOk.value
    }
  }
)
</script>
<template>
  <div>
    <section class="cdp-section">
      <TopCard :key="key"></TopCard>
    </section>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="14">
        <NotificationTables :key="key"></NotificationTables>
      </el-col>
      <el-col :span="10">
        <LifeStep :key="key"></LifeStep>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <MemberActive :key="key"></MemberActive>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.mainArea__container {
  border-radius: 5px;
  border: solid 1px #e6eaf2;
  background-color: #fff;
}
</style>
