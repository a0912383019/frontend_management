<script setup>
import { computed } from 'vue'
const props = defineProps({
  color: {
    type: String,
    default: 'grey'
  },
  //sm md lg
  size: {
    type: String,
    default: 'lg'
  }
})

// const colorClass = computed(() => {
//   return props.color
// })
</script>
<template>
  <span class="loader" :class="[props.size, props.color]"></span>
</template>
<style lang="scss" scoped>
.loader {
  &.sm {
    width: 24px;
    height: 24px;
    border: 6px solid;
  }
  &.md {
    width: 36px;
    height: 36px;
    border: 8px solid;
  }
  &.lg {
    width: 48px;
    height: 48px;
    border: 10px solid;
  }
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.25) rgba(255, 255, 255, 0.75)
    rgba(255, 255, 255, 1) !important;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.blue {
  border-color: rgba(79, 132, 207, 0.5) rgba(79, 132, 207, 0.25) rgba(79, 132, 207, 0.75)
    rgba(79, 132, 207, 1) !important;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
