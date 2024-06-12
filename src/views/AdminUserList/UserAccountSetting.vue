<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tab from '@/components/Tab.vue'
import TargetData from '@/views/TargetGroupAnalysis/components/TargetData/TargetData.vue'
import AnalysisResult from '@/views/TargetGroupAnalysis/components/AnalysisResult/AnalysisResult.vue'
import Filter from '@/views/TargetGroupAnalysis/components/AnalysisResult/Filter.vue'
import DialogContent from '@/views/AdminUserList/components/DialogContent.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number
  },
  userName: {
    type: String
  }
})

const emit = defineEmits(['closeDialog'])

// 關閉 dialog
const handleDialogClosed = () => {
  emit('closeDialog')
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog dialog-mt-40"
    :append-to-body="true"
    width="1150"
    :destroy-on-close="true"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('user_detail_info.account_name_with_colon') }}
        <span class="ml-5 underline">{{ props.userName }}</span>
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <DialogContent />
      </section>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cdp-dialog {
    height: 810px;
  &__component {
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px #e6eaf2 solid;
  }
  &__header {
    color: #fff;
  }
}
.underline {
  text-decoration: underline;
}
</style>
