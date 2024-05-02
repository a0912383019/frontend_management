<script setup>
import { useI18n } from 'vue-i18n'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()

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
    :name="$t(props.name)"
  />
</template>
<style lang="scss" scoped></style>
