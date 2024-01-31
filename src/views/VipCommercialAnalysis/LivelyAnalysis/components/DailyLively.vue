<script setup>
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { apiQueryMemberRecentLively } from '@/api/global.js'
</script>
<template>
  <div>
    <SectionTitle :title="$t('member_active_level.daily_active_level')"></SectionTitle>
  </div>
</template>
<style lang="scss" scoped></style>
