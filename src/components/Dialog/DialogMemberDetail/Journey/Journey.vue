<script setup>
import MemberDetail from './components/MemberDetail.vue'
import MemberLifeCycleHistory from './components/MemberLifeCycleHistory.vue'
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="14"> <MemberDetail /> </el-col>
      <el-col :span="10">
        <MemberLifeCycleHistory />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
