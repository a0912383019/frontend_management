<script setup>
import MemberHealth from './components/MemberHealth.vue'
import MemberInfo from './components/MemberInfo.vue'
import MemberAmount from './components/MemberAmount.vue'
import MemberPeriodBetAmount from './components/MemberPeriodBetAmount.vue'
</script>
<template>
  <div>
    <el-row :gutter="15" class="mb-20">
      <el-col :span="5">
        <MemberHealth />
      </el-col>
      <el-col :span="19">
        <section class="cdp-section">
          <MemberInfo />
          <MemberAmount />
        </section>
      </el-col>
      <el-col :span="24" class="mt-30">
        <MemberPeriodBetAmount />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
