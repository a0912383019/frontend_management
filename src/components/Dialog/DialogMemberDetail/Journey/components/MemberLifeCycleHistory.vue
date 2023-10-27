<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const refLifeCycleHistory = ref(null)

const chartIsShow = ref(false)

onMounted(() => {
  chartIsShow.value = true
})
</script>
<template>
  <section class="cdp-section-in margin-bottom-0">
    <SectionTitle class="mb-15" :title="$t('customer_detail_info.member_life_cycle_history')">
    </SectionTitle>
    <LifeCycleHistory
      :memberId="dialogMemberDetailStore.state.memberData.user_id"
      :detailDate="dialogMemberDetailRangeDate"
      ref="refLifeCycleHistory"
      v-if="chartIsShow"
    />
  </section>
</template>
<style lang="scss" scoped>
.cdp-section-in {
  min-height: 410px;
}
.margin-bottom-0 {
  margin-bottom: 0;
}
</style>
