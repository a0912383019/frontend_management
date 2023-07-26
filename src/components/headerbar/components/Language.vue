<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const options = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zh-TW',
    label: '繁體'
  },
  {
    value: 'zh-CN',
    label: '简体'
  }
]

watch(locale, (newlocale) => {
  //將目前語系存到sessionStorage
  sessionStorage.setItem('languageType', newlocale)
})
</script>
<template>
  <el-select v-model="locale" class="cdp-select" placeholder="Select">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<style lang="scss" scoped></style>
