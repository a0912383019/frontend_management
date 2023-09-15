<script setup>
import { ref, watch } from 'vue'
import MemberHealth from './components/MemberHealth.vue'
import MemberInfo from './components/MemberInfo.vue'
import MemberAmount from './components/MemberAmount.vue'
import MemberPeriodBetAmount from './components/MemberPeriodBetAmount.vue'
import LobbyGroup from './components/LobbyGroup.vue'
import Lobby from './components/Lobby.vue'
import LobbyGame from './components/LobbyGame.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

const dialogMemberDetailStore = useDialogMemberDetailStore()

const key = ref('')

watch([() => dialogMemberDetailStore.nowTag, () => dialogMemberDetailStore.timeStamp], () => {
  if (dialogMemberDetailStore.nowTag === 'Overview') {
    key.value = dialogMemberDetailStore.timeStamp
  }
})
</script>
<template>
  <div>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="5">
        <MemberHealth />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="19">
        <section class="cdp-section">
          <MemberInfo />
          <MemberAmount :key="key" />
        </section>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <MemberPeriodBetAmount :key="key" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :lg="8"><LobbyGroup :key="key" /></el-col>
          <el-col :xs="24" :sm="24" :lg="8"><Lobby :key="key" /></el-col>
          <el-col :xs="24" :sm="24" :lg="8"><LobbyGame :key="key" /></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
