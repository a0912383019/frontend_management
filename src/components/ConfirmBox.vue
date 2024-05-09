<script setup>
import { useI18n } from 'vue-i18n'
import CdpButton from '@/components/Button/CdpButton.vue'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
  //目前只有兩種 red 跟 blue
  color: {
    type: String,
    default: 'blue'
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  leftBtn: {
    type: String,
    default: ''
  },
  rightBtn: {
    type: String,
    default: ''
  }
})

const leftBtnName = computed(() => {
  let name = t('modal.cancel')
  if (props.leftBtn !== '') {
    name = props.leftBtn
  }
  return name
})

const rightBtnName = computed(() => {
  let name = t('modal.confirm')
  if (props.rightBtn !== '') {
    name = props.rightBtn
  }
  return name
})

const emit = defineEmits(['confirmExecute', 'cancelExecute'])

const handleCancel = () => {
  emit('cancelExecute')
}

const handleComfirm = () => {
  emit('confirmExecute')
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    :width="props.width"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="cdp-confirm-dialog"
  >
    <div class="inner-dialog">
      <div class="inner-dialog__icon">
        <img v-if="props.color === 'red'" src="@/assets/images/alert-1.png" alt="" />
        <img v-else src="@/assets/images/alert-2.png" alt="" />
      </div>
      <div
        class="inner-dialog__title cdp-text-light-blue"
        :class="{ 'red-color': props.color === 'red' }"
      >
        {{ props.title }}
      </div>
      <div class="inner-dialog__list__text mb-35">
        <slot name="text-body">{{ props.content }}</slot>
      </div>
      <div class="inner-dialog__button">
        <CdpButton class="cdp__modal-btn__cancel" :name="leftBtnName" @click="handleCancel" />
        <CdpButton
          class="cdp__modal-btn__submit"
          :class="{ 'red-bg': props.color === 'red' }"
          :name="rightBtnName"
          @click="handleComfirm"
        />
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.red-color {
  color: rgba(241, 101, 101, 1) !important;
}
.red-bg {
  background-color: rgba(241, 101, 101, 1) !important;
}
.red-bg:hover {
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
    width: 100%;
    text-align: center;
  }
}
</style>
