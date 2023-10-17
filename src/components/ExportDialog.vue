<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

// dialog 開啟狀態
const visibleValue = computed(() => {
  return props.modelValue
})

// 前往匯出報表清單
const handleGo = () => {
  router.push('/user-export-report')
}

// 關閉dialog
const handleCancel = () => {
  emit('update:modelValue', false)
}
</script>
<template>
  <el-dialog
    v-model="visibleValue"
    width="300"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="cdp-confirm-dialog"
  >
    <div class="inner-dialog">
      <div class="inner-dialog__icon"><img src="@/assets/images/alert-2.png" alt="" /></div>
      <div class="inner-dialog__title cdp-text-light-blue">
        {{ $t('import_export_file.dialog_export_report_title') }}
      </div>
      <div class="inner-dialog__text">
        {{
          $t('import_export_file.dialog_export_report_text', {
            sidebar: t('sidebar.user_export_report')
          })
        }}
      </div>
      <div class="inner-dialog__button">
        <ButtonIcon color="gray" :name="t('modal.cancel')" @click="handleCancel" />
        <ButtonIcon color="blue" :name="t('common.redirect_to_page')" @click="handleGo" />
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
