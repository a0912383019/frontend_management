<script setup>
import { useI18n } from 'vue-i18n'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()

const props = defineProps({
  name: {
    type: String,
    default: 'modal.add'
  },
})
</script>
<template>
  <div>
    <ButtonIcon
      icon="plus"
      :isSvg="true"
      size="large"
      :bg="false"
      color="blue"
      :name="$t(props.name)"
    />
  </div>
</template>
<style lang="scss" scoped></style>
