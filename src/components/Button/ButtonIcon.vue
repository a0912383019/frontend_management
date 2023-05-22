<script setup>
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <button class="btn-reset">
    <font-awesome-icon :icon="`fa-solid fa-${props.icon}`" v-if="props.icon" />
    {{ props.name }}
  </button>
</template>
<style lang="scss" scoped>
button {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  line-height: 1.5;
  border-radius: 0.15rem;
  background-color: $green;
  color: #fff;
}
</style>
