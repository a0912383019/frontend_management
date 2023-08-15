<script setup>
import { ref, reactive } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
const { t } = useI18n()

const manageAnalysisStore = useManageAnalysisStore()
const { deatilRangeDate } = storeToRefs(manageAnalysisStore)

const refLifeCycleHistory = ref(null)
const dialogTableVisible = ref(false) //dialog開啟狀態
let chartParam = reactive({})

//開啟 dialog
const handleOpenDialog = (param) => {
  chartParam = param
  dialogTableVisible.value = true
}

//關閉 dialog
const handleCloseDialog = () => {
  // apiSuccess.value = false
  // chartSetting.data.xLabels = []
  // chartSetting.data.datasets = []
  // chartSetting.options.plugins.title.text = ''
  // legendIndex.value = 0
  // legendArray.value = []
  // refLifeCycleHistory.value.clearChart()
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      class="cdp-dialog member-step-detail-dialog"
      @close="handleCloseDialog"
      :destroy-on-close="true"
      :append-to-body="true"
      :title="t('manage_analysis.member_life_cycle_history')"
    >
      <div class="cdp-dialog__content">
        <LifeCycleHistory
          :memberId="chartParam.user_id"
          :detailDate="deatilRangeDate"
          :userName="chartParam.user_name"
          ref="refLifeCycleHistory"
        />
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__chart {
    width: 100%;
    height: 300px;
  }
}
</style>
<!-- <style lang="scss">
.member-step-detail-dialog {
  &.el-dialog {
    max-width: 720px;
  }
}
</style> -->
