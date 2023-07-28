<script setup>
import { useI18n } from 'vue-i18n'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import LifeCycleHistory from '@/components/Highcharts/LifeCycleHistory.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.member_life_cycle_history')">
    </SectionTitle>
    <LifeCycleHistory
      :memberId="dialogMemberDetailStore.memberData.user_id"
      :detailDate="dialogMemberDetailRangeDate"
    />
  </section>
</template>
<style lang="scss" scoped></style>
