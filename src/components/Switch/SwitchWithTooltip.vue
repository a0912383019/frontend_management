<script setup>
const props = defineProps({
  activeText: {
    type: String,
    default: ''
  },
  inactiveText: {
    type: String,
    default: ''
  },
  tooltipContent: {
    type: String,
    default: ''
  },
  // only blue and purple
  color: {
    type: String,
    default: 'blue'
  },
  isDisabled: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  inlinePrompt: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 50
  },
})

const switchColor = 'cdp-switch-' + props.color

const emit = defineEmits(['update:modelValue'])

const handleSwitchChange = (data) => {
  emit('update:modelValue', data)
}
</script>
<template>
  <div>
    <el-switch
      :model-value="props.modelValue"
      @change="handleSwitchChange"
      :inline-prompt="props.inlinePrompt"
      :active-text="props.activeText"
      :inactive-text="props.inactiveText"
      :width="props.width"
      class="mr-5"
      :class="[switchColor, {'off-class': props.inlinePrompt && !props.modelValue}]"
      :disabled="props.isDisabled"
    />
    <el-tooltip
      v-if="props.tooltipContent !== ''"
      class="box-item"
      effect="dark"
      :content="props.tooltipContent"
      placement="top"
    >
      <font-awesome-icon :class="{'dilute': props.isDisabled}" icon="fa-solid fa-circle-info" />
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-switch__label--right) {
  margin-left: 5px;
}
// 淡化
.dilute {
  opacity: 0.5;
}
:deep(.el-switch.off-class) {
  .el-switch__inner .is-text {
    color: rgb(133, 133, 133);
  }
}
</style>
