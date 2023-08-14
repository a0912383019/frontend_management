<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentData: {
    type: String,
    default: '-'
  },
  hasColor: {
    type: Boolean,
    default: true
  },
  iconSize: {
    type: String,
    default: '14'
  },
  fontSize: {
    type: String,
    default: '16'
  }
})

const iconSizeClass = 'font-size-' + props.iconSize
const fontSizeClass = 'font-size-' + props.fontSize
const color = computed(() => {
  if (!props.hasColor || props.percentData === '0') {
    return 'cdp-text-light__slate__gray'
  } else if (props.hasColor && props.percentData.indexOf('-') !== -1) {
    return 'text-danger'
  } else {
    return 'text-success'
  }
})

const icon = computed(() => {
  if (props.percentData === '0') {
    return 'fas fa-caret-left'
  } else if (props.percentData.indexOf('-') !== -1) {
    return 'fas fa-caret-down'
  } else {
    return 'fas fa-caret-up'
  }
})
</script>
<template>
  <span :class="color" v-if="percentData === '-'">
    <span class="font-black" :class="fontSizeClass">{{ percentData }}</span>
  </span>
  <span :class="color" v-else>
    <font-awesome-icon class="mr-3" :class="iconSizeClass" :icon="icon" />
    <span class="font-black" :class="fontSizeClass">{{ percentData.replace('-', '') + '%' }}</span>
  </span>
</template>
<style lang="scss" scoped>
</style>
