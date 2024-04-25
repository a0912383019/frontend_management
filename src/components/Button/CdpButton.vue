<script setup>
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm'
  }
})

const buttonClass = computed(() => {
  return `cdp-btn__${props.size}`
})
</script>
<template>
  <button class="cdp-btn" :class="buttonClass">
    {{ props.name }}
  </button>
</template>
<style lang="scss" scoped>
.cdp-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  border-radius: 5px;
  padding: 7px 8px;
  outline: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &__sm-60 {
    width: 60px;
    height: 34px;
  }
  &__sm {
    width: 100px;
    height: 34px;
  }
  &__sm-120 {
    width: 120px;
    height: 34px;
  }
  &__sm-130 {
    width: 130px;
    height: 34px;
  }
  &__sm-140 {
    width: 140px;
    height: 40px;
  }
}
</style>
