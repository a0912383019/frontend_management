<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentData: {
    type: String,
    default: '--'
  },
  hasColor: {
    type: Boolean,
    default: true
  },
  iconSize: {
    type: String,
    default: '14'
  },
  fontWeight: {
    type: String,
    default: 'black'
  },
  fontSize: {
    type: String,
    default: '16'
  }
})

const iconSizeClass = 'font-size-' + props.iconSize
const fontSizeClass = 'font-size-' + props.fontSize
const fontWeightClass = 'font-' + props.fontWeight
const color = computed(() => {
  if (!props.hasColor || props.percentData === '0' || props.percentData === '--') {
    return 'cdp-text-light__slate__gray'
  } else if (props.hasColor && props.percentData.indexOf('-') !== -1) {
    return 'text-danger'
  } else {
    return 'text-success'
  }
})

const icon = computed(() => {
  if (props.percentData === '0' || props.percentData === '--') {
    return 'fa-caret-left'
  } else if (props.percentData.indexOf('-') !== -1) {
    return 'fa-caret-down'
  } else {
    return 'fa-caret-up'
  }
})
</script>
<template>
  <span :class="color" v-if="percentData === '--'">
    <span :class="[fontSizeClass, fontWeightClass]">{{ percentData }}</span>
  </span>
  <span class="flex items-center" :class="color" v-else>
    <font-awesome-icon class="mr-3" :class="iconSizeClass" :icon="icon" />
    <span :class="[fontSizeClass, fontWeightClass]">{{ percentData.replace('-', '') + '%' }}</span>
  </span>
</template>
<style lang="scss" scoped></style>
