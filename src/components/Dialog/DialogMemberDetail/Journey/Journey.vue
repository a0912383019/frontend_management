<script setup>
import { ref, watch } from 'vue'
import MemberJourney from './components/MemberJourney.vue'
import MemberDetail from './components/MemberDetail.vue'
import MemberLifeCycleHistory from './components/MemberLifeCycleHistory.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

const dialogMemberDetailStore = useDialogMemberDetailStore()

const key = ref('')

watch([() => dialogMemberDetailStore.nowTag, () => dialogMemberDetailStore.timeStamp], () => {
  if (dialogMemberDetailStore.nowTag === 'Journey') {
    key.value = dialogMemberDetailStore.timeStamp
  }
})
</script>
<template>
  <div>
    <MemberJourney :key="key" />
    <el-row :gutter="20">
      <el-col :span="14" class="mb-20"><MemberDetail :key="key" /></el-col>
      <el-col :span="10" class="mb-20">
        <MemberLifeCycleHistory :key="key" />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
