<script setup>
import { ref } from 'vue'
import Filter from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Filter.vue'
import TimePeople from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/TimePeople.vue'

const refTimePeople = ref(null)

const handleCallApi = () => {
  refTimePeople.value.queryActiveTimePeople()
}
</script>
<template>
  <section class="relative">
    <div class="filter-box">
      <Filter @update:filter="handleCallApi" />
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <TimePeople ref="refTimePeople"/>
      </el-col>
    </el-row>
  </section>
</template>
<style lang="scss" scoped></style>
