<script setup>
import { ref, watch } from 'vue'
import MemberPayoffHallProfit from './components/MemberPayoffHallProfit.vue'
import DepositAndWithdraw from './components/DepositAndWithdraw.vue'
import TotalBetPlatforms from './components/TotalBetPlatforms.vue'
import TotalPayoffPlatforms from './components/TotalPayoffPlatforms.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

const dialogMemberDetailStore = useDialogMemberDetailStore()

const key = ref('')

watch([() => dialogMemberDetailStore.nowTag, () => dialogMemberDetailStore.timeStamp], () => {
  if (dialogMemberDetailStore.nowTag === 'Profit') {
    key.value = dialogMemberDetailStore.timeStamp
  }
})
</script>
<template>
  <div>
    <MemberPayoffHallProfit :key="key" />
    <DepositAndWithdraw :key="key" />
    <el-row :gutter="20">
      <el-col :span="12" class="mb-20">
        <TotalBetPlatforms :key="key" />
      </el-col>
      <el-col :span="12" class="mb-20">
        <TotalPayoffPlatforms :key="key" />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
