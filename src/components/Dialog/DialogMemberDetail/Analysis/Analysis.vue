<script setup>
import { ref, watch } from 'vue'
import GADetail from './components/GADetail.vue'
import GALoginCount from './components/GALoginCount.vue'
import PeriodOfferAmount from './components/PeriodOfferAmount.vue'
import PeriodDayOffer from './components/PeriodDayOffer.vue'
import GADataPage from './components/GADataPage.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

const dialogMemberDetailStore = useDialogMemberDetailStore()

const key = ref('')

watch([() => dialogMemberDetailStore.nowTag, () => dialogMemberDetailStore.timeStamp], () => {
  if (dialogMemberDetailStore.nowTag === 'Analysis') {
    key.value = dialogMemberDetailStore.timeStamp
  }
})
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <GADetail :key="key" />
      </el-col>
      <el-col :span="16">
        <GALoginCount :key="key" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <PeriodOfferAmount :key="key" />
      </el-col>
      <el-col :span="16">
        <PeriodDayOffer :key="key" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" class="mb-20">
        <GADataPage :key="key" />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
