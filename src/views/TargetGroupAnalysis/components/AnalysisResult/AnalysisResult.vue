<script setup>
import DailyBetAmountProfit from '@/views/TargetGroupAnalysis/components/AnalysisResult/DailyBetAmountProfit.vue'
import TotalPeople from '@/views/TargetGroupAnalysis/components/AnalysisResult/TotalPeople.vue'

const props = defineProps({
  targetId: {
    type: String
  }
})
</script>
<template>
  <section>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="16">
        <DailyBetAmountProfit :targetId="props.targetId" />
      </el-col>
      <el-col :span="8">
        <TotalPeople :targetId="props.targetId"></TotalPeople>
      </el-col>
    </el-row>
  </section>
</template>
