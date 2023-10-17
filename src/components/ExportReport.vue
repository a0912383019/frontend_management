<script setup>
import { useI18n } from 'vue-i18n'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()
</script>
<template>
  <div>
    <ButtonIcon
      icon="download"
      :isSvg="true"
      size="large"
      :bg="false"
      color="blue"
      :name="t('import_export_file.export')"
      class="export__button"
    />
  </div>
</template>
<style lang="scss" scoped></style>
