<script setup>
import { ref, reactive, computed } from 'vue'
import { useVipCommercialAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'
import WeekLively from './WeekLively.vue'
import DailyLively from './DailyLively.vue'

const dialogVisible = ref(false)

const userName = ref('')

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const endDate = computed(() => {
  return dayjs(livelyAnalysisFilter.searchDate).format('YYYY-MM-DD')
})

let paramsData = reactive({})

//開啟 dialog
const handleOpenDialog = (user) => {
  userName.value = user.user_name
  paramsData = {
    ...user,
    startDate: dayjs(endDate.value).subtract(89, 'day').format('YYYY-MM-DD'),
    endDate: endDate.value
  }
  dialogVisible.value = true
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-vip-activity-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      :alignCenter="true"
    >
      <template #header>
        <span class="cdp-dialog__header">
          {{ $t('member_active_level.active_level_breakdown') }}
          <span class="underline ml-10">
            {{ userName }}
          </span>
        </span>
      </template>
      <div class="cdp-section">
        <div class="cdp-section-in">
          <WeekLively :data="paramsData" />
        </div>
        <div class="cdp-section-in">
          <DailyLively :data="paramsData" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    background-color: #fff;
  }
  &__header {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
.cdp-vip-activity-dialog {
  width: 1170px;
  max-width: 90%;
}
</style>
