<script setup>
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium'
  }
})

const buttonClass = computed(() => {
  return `button__${props.size}`
})
</script>
<template>
  <button class="btn-reset" :class="buttonClass">
    <font-awesome-icon class="mr-6" :icon="`fa-solid fa-${props.icon}`" v-if="props.icon" />
    {{ props.name }}
  </button>
</template>
<style lang="scss" scoped>
button {
  color: #fff;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.button {
  &__small {
    background-color: $green;
    padding: 0.125rem 0.25rem;
    font-size: 0.75rem;
    line-height: 1.5;
    border-radius: 0.15rem;
  }
  &__medium {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    background-color: #17a2b8;
    &:hover {
      background-color: #138496;
    }
  }
  &__large {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    padding: 10px 15px;
    background-color: #56419f;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    &.large-120 {
      min-width: 120px;
      padding-top: 7px;
      padding-bottom: 7px;
    }
  }
}
</style>
