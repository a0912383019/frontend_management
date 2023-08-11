<script setup>
import TopCard from './components/TopCard.vue'
</script>
<template>
  <!-- <div>This is home page.</div> -->
  <!-- <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"> -->
        <div>
          <TopCard></TopCard>
        </div>
      <!-- </el-col> -->
      <!-- <el-col :span="11"> </el-col> -->
    <!-- </el-row> -->
  <!-- </div> -->
</template>
<style lang="scss" scoped>
.mainArea__container {
    border-radius: 5px;
    border: solid 1px #e6eaf2;
    background-color: #fff;
}
</style>
