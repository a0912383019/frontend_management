<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fuzzySearch = ref(false)

const emit = defineEmits(['update:modelValue'])

const handleSwitchChange = (data) => {
  emit('update:modelValue', data)
}
</script>
<template>
  <div>
    <el-switch
      v-model="fuzzySearch"
      @change="handleSwitchChange"
      :active-text="t('common.fuzzy_search')"
      class="cdp-switch mr-10"
    />
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('common.return_similar_username')"
      placement="top"
    >
      <font-awesome-icon icon="fa-solid fa-circle-info" />
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped></style>
