<script setup>
import { useGlobalStore } from '@/stores'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const handelCancel = () => {
  emit('update:modelValue', false)
}
</script>
<template>
  <div>
    <el-dialog
      v-model="props.modelValue"
      width="300"
      :alignCenter="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      class="cdp-confirm-dialog"
    >
      <div class="inner-dialog">
        <div class="inner-dialog__icon">
          <cdp-icon name="dialogNotice" />
        </div>
        <div class="inner-dialog__title">{{ $t('vip_commercial_analysis.not_set') }}</div>
        <div class="inner-dialog__text">
          {{ $t('vip_commercial_analysis.no_vip_warning2', { hall_name: activeHall.hall_name }) }}
        </div>

        <div class="inner-dialog__button">
          <ButtonIcon color="gray" :name="$t('modal.cancel')" @click="handelCancel" />
          <ButtonIcon color="red" :name="$t('modal.confirm')" @click="handelCancel" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.inner-dialog__title) {
  color: $red;
}
:deep(.inner-dialog__icon) {
  color: $red;
}
</style>
