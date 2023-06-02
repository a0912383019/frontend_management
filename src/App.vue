<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useGlobalStore } from '@/stores/global.js'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useI18n } from 'vue-i18n'
import Loading from '@/components/Loading.vue'

const stores = useGlobalStore()
const { locale } = useI18n()

//設定element-plus語系檔
const lang = {
  en,
  'zh-TW': zhTw,
  'zh-CN': zhCn
}

//根據i18n切換的語系，對應element-plus語系
const language = computed(() => {
  return lang[locale.value]
})
</script>

<template>
  <el-config-provider :locale="language">
    <RouterView />
  </el-config-provider>
  <Loading :isLoading="stores.isLoading" />
</template>
