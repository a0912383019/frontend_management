<script setup>
import MemberHealth from './components/MemberHealth.vue'
import MemberInfo from './components/MemberInfo.vue'
import MemberAmount from './components/MemberAmount.vue'
import MemberPeriodBetAmount from './components/MemberPeriodBetAmount.vue'
import LobbyGroup from './components/LobbyGroup.vue'
import Lobby from './components/Lobby.vue'
import LobbyGame from './components/LobbyGame.vue'
</script>
<template>
  <div>
    <el-row :gutter="15" class="mb-20">
      <el-col :xs="24" :sm="24" :lg="5">
        <MemberHealth />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="19">
        <section class="cdp-section">
          <MemberInfo />
          <MemberAmount />
        </section>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" class="mt-30">
        <MemberPeriodBetAmount />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" class="mt-30">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :lg="8"> <LobbyGroup /> </el-col>
          <el-col :xs="24" :sm="24" :lg="8"> <Lobby /> </el-col>
          <el-col :xs="24" :sm="24" :lg="8"> <LobbyGame /> </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
