<script setup>
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()

const handleClick = () => {
  ElMessage({
    message: '匯出報表清單單元時，再回來補上',
    type: 'warning'
  })
}
</script>
<template>
  <div>
    <ButtonIcon
      icon="download"
      size="large"
      :bg="false"
      color="blue"
      :name="t('import_export_file.export')"
      class="export__button"
      @click="handleClick"
    />
  </div>
</template>
<style lang="scss" scoped>
// .export__button {
//   background-color: transparent;
//   border: 1px solid $blue;
//   color: $blue;
//   &:hover {
//     border-color: #214c89;
//   }
// }
</style>
