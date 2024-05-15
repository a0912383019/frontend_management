<script setup>
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'modal.add'
  },
  size: {
    type: String,
    default: 'large'
  },
  bg: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <ButtonIcon
    icon="plus"
    :isSvg="true"
    :size="props.size"
    :bg="props.bg"
    color="blue"
    :name="props.name"
  />
</template>
<style lang="scss" scoped></style>
