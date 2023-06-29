<script setup>
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import DotsSM from '@/components/Dots/DotsSM.vue'

const globalStore = useGlobalStore()
const { tableConfig } = storeToRefs(globalStore)

const props = defineProps({
  stepIndex: {
    type: Number,
    default: 1
  }
})
</script>
<template>
  <div class="step-name-box">
    <!-- 階段名稱內容 -->
    <font-awesome-icon
      class="step-name-box__icon"
      :icon="tableConfig[props.stepIndex]['step_vue_icon']"
    />
    <div class="step-name-box__title">{{ tableConfig[props.stepIndex]['step_name'] }}</div>
    <DotsSM
      class="step-name-box__dots"
      :class="tableConfig[props.stepIndex]['step_vue_dot_color']"
    />
  </div>
</template>
<style lang="scss" scoped>
.step-name-box {
  display: flex;
  flex-wrap: wrap;
  color: #404040;
  &__icon {
    margin-right: 6px;
    margin-top: 4px;
    flex-shrink: 0;
  }
  &__title {
    margin-right: 6px;
  }
  &__dots {
    flex-shrink: 0;
    margin-top: 6px;
  }
}
</style>
