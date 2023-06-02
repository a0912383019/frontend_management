<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
})
const icon = computed(() => {
  let result = ''
  switch (props.type) {
    case 'loading':
      result = 'fa-solid fa-spinner'
      break
    case 'info':
      result = 'fa-solid fa-circle-info'
      break
    default:
      result = 'fa-solid fa-triangle-exclamation'
      break
  }
  return result
})
</script>
<template>
  <div class="message">
    <div class="message__icon" :class="{ loading: props.type === 'loading' }">
      <font-awesome-icon :icon="icon" />
    </div>
    <div class="message__title">{{ props.title }}</div>
  </div>
</template>
<style lang="scss" scoped>
@keyframes rotate360 {
  100% {
    transform: rotate(360deg);
  }
}
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  padding: 20px;
  margin-bottom: 30px;
  color: #dc3545;
  border-radius: 5px;
  background-color: #f9fafc;
  &__icon {
    margin-right: 8px;
    &.loading {
      svg {
        animation: rotate360 2s infinite linear;
      }
    }
  }
}
</style>
