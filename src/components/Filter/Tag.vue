<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'purple'
  }
})

const colors = computed(() => {
  return props.color
})
</script>
<template>
  <div class="tag" :class="colors">
    {{ props.title }}
    <slot name="icon"></slot>
  </div>
</template>
<style lang="scss" scoped>
.tag {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  color: #fff;
  font-size: 16px;
  border-radius: 30px;
  .el-icon {
    font-size: 12px;
    margin-left: 5px;
  }
}
.purple {
  background-color: $purple;
}
</style>
