<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useGlobalStore } from '@/stores/global.js'
import { getCurrencySignText } from '@/utils/commonUtils.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const isReady = ref(false)

//幣別i18n資料
const currencyObj = reactive({ currency: '', currencySign: '', currencySignText: '' })

//產生幣別i18n資料
const setCurrencyText = () => {
  const currencyData = getCurrencySignText('BBIN', activeHall.hall_code)
  currencyObj['currency'] = currencyData['currency']
  currencyObj['currencySign'] = currencyData['currencySign']
  currencyObj['currencySignText'] = currencyData['currencySignText']
  isReady.value = true
}

onMounted(() => {
  if (activeHall.hall_code !== '') {
    setCurrencyText()
  }
})

//監聽廳別變化更新幣別
watch(
  () => activeHall.hall_code,
  () => {
    setCurrencyText()
  }
)
</script>
<template>
  <div v-if="isReady">
    ({{ $t(currencyObj['currency']) }} {{ $t(currencyObj['currencySign'])
    }}{{ currencyObj['currencySignText'] }})
  </div>
</template>
<style lang="scss" scoped></style>
