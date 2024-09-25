<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGlobalStore } from '@/stores/global.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const isReady = ref(false)

//幣別i18n資料
const currencyObj = reactive({ currency: '', currencySign: '', currencySignText: '' })

//產生幣別i18n資料
const setCurrencyText = () => {
  currencyObj.currency = 'currency.currency'
  currencyObj.currencySign = `currency.currency_${globalStore.currencySign}`
  currencyObj.currencySignText = globalStore.currencySign
  isReady.value = true
}

onMounted(() => {
  if (activeHall.hall_code !== '') {
    setCurrencyText()
  }
})
</script>
<template>
  <div v-if="isReady" class="font-size-14 cdp-text-onyx">
    ({{ $t(currencyObj.currency) }} {{ $t(currencyObj.currencySign)
    }}{{ currencyObj.currencySignText }})
  </div>
</template>
<style lang="scss" scoped></style>
