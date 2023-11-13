<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CdpButton from '@/components/Button/CdpButton.vue'

const { t } = useI18n()

const props = defineProps({
  //目前只有兩種 delete(刪除)跟 notSaved(尚未儲存)
  name: {
    type: String,
    default: 'delete'
  },
  confirmBoxVisible: {
    type: Boolean,
    default: false
  }
})

const modalText = computed(() => {
  if (props.name === 'delete') {
    return {
      title: t('modal.delete'),
      text: t('modal.are_you_sure_to_delete'),
      leftBtn: t('modal.cancel')
    }
  } else if (props.name === 'notSaved') {
    return {
      title: t('modal.not_yet_saved'),
      text: t('modal.do_you_want_to_save_changes'),
      leftBtn: t('modal.restore_data')
    }
  }
})

const emit = defineEmits(['cancel', 'confirm'])
const handleCancel = () => {
  emit('cancel')
}

const handleComfirm = () => {
  emit('confirm')
}
</script>
<template>
  <el-dialog
    v-model="props.confirmBoxVisible"
    width="300"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="cdp-confirm-dialog"
  >
    <div class="inner-dialog">
      <div class="inner-dialog__icon">
        <img v-if="props.name === 'delete'" src="@/assets/images/alert-1.png" alt="" />
        <img v-else src="@/assets/images/alert-2.png" alt="" />
      </div>
      <div
        class="inner-dialog__title cdp-text-light-blue"
        :class="{ 'delete-color': props.name === 'delete' }"
      >
        {{ modalText.title }}
      </div>
      <div class="inner-dialog__list__text">
        {{ modalText.text }}
      </div>
      <div class="inner-dialog__button">
        <CdpButton
          class="cdp__modal-btn__cancel"
          :name="modalText.leftBtn"
          @click="handleCancel()"
        />
        <CdpButton
          class="cdp__modal-btn__submit"
          :class="{ 'delete-bg': props.name === 'delete' }"
          :name="$t('modal.confirm')"
          @click="handleComfirm()"
        />
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.delete-color {
  color: rgba(241, 101, 101, 1) !important;
}
.delete-bg {
  background-color: rgba(241, 101, 101, 1) !important;
}
.delete-bg:hover {
  background-color: rgba(238, 83, 83, 1) !important;
}
.inner-dialog {
  position: relative;
  color: #404040;
  &__icon {
    position: absolute;
    left: -45px;
    top: -55px;
    width: 94px;
    height: 94px;
    img {
      display: block;
      width: 100%;
    }
  }
  &__list__text {
    min-height: 50px;
    width: 100%;
    text-align: center;
  }
}
</style>
