<script setup>
import GADetail from './components/GADetail.vue'
import GALoginCount from './components/GALoginCount.vue'
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <GADetail />
      </el-col>
      <el-col :span="16">
        <GALoginCount />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
