<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="title">
    <font-awesome-icon class="title__icon" :icon="props.icon" v-if="props.icon" />
    <div class="title__name">{{ props.title }}</div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  color: $blue;
  font-size: 16px;
  &__icon {
    margin-right: 6px;
  }
  &__name {
    font-weight: 500;
  }
}
</style>
