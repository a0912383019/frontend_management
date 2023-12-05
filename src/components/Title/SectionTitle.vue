<script setup>
import { useSlots } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  }
})

//檢查tootlip是否有內容，沒有的話隱藏tooltip
const hasSlotContent = !!useSlots().tooltip
</script>
<template>
  <div class="title" :class="props.size">
    <div class="title__name">{{ props.title }}</div>
    <el-tooltip effect="dark" placement="top" v-if="hasSlotContent">
      <template #content><slot name="tooltip"></slot></template>
      <font-awesome-icon class="title__icon" icon="fa-circle-info" />
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  color: $text-spacecadet;
  &__name {
    font-size: 16px;
    font-weight: 500;
    margin-right: 5px;
  }
  &__icon {
    font-size: 18px;
    cursor: pointer;
  }
  &.small {
    .title {
      &__name {
        font-size: 14px;
      }
    }
  }
}
</style>
