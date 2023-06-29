<script setup>
import MemberHealth from './components/MemberHealth.vue'
import MemberInfo from './components/MemberInfo.vue'
import MemberAmount from './components/MemberAmount.vue'
</script>
<template>
  <div>
    <el-row :gutter="15" class="mb-20">
      <el-col :span="5">
        <div class="cdp-shadow-light-sm padding-20">
          <MemberHealth />
        </div>
      </el-col>
      <el-col :span="19">
        <div class="cdp-shadow-light-sm padding-20">
          <MemberInfo />
          <MemberAmount />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
