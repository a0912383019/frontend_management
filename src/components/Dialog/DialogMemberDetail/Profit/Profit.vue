<script setup>
import MemberPayoffHallProfit from './components/MemberPayoffHallProfit.vue'
import DepositAndWithdraw from './components/DepositAndWithdraw.vue'
import TotalBetPlatforms from './components/TotalBetPlatforms.vue'
import TotalPayoffPlatforms from './components/TotalPayoffPlatforms.vue'
</script>
<template>
  <div>
    <MemberPayoffHallProfit />
    <DepositAndWithdraw />
    <el-row :gutter="20">
      <el-col :span="12">
        <TotalBetPlatforms />
      </el-col>
      <el-col :span="12">
        <TotalPayoffPlatforms />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
