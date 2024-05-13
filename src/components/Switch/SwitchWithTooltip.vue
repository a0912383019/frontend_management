<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
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
  }
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
      :active-text="props.name"
      class="mr-5"
      :class="switchColor"
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
</style>
