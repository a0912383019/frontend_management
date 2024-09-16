<script setup>
import { ref, reactive, onMounted } from 'vue'
import { apiQueryProfitWithdrawDepositAmount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const amountData = reactive({
  total_profit: '', //廳主實際總損益
  withdraw_deposit_net_amount: '', //存出款淨額
  total_deposit: '', //總入款金額
  total_withdraw: '' //總出款金額
})
const currencySignText = ref('')

//取得會員時間區間內實際損益與出入款總金額
const queryProfitWithdrawDepositAmount = async () => {
  try {
    const result = await apiQueryProfitWithdrawDepositAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      const { total_deposit, total_profit, total_withdraw, withdraw_deposit_net_amount } =
        result.data.result
      amountData['total_deposit'] = FormatNumber(total_deposit)
      amountData['total_profit'] = FormatNumber(total_profit)
      amountData['total_withdraw'] = FormatNumber(total_withdraw)
      amountData['withdraw_deposit_net_amount'] = FormatNumber(withdraw_deposit_net_amount)
      currencySignText.value = globalStore.currency_sign
    } else {
      let failMsg = errorRespond(result.data.status)
      console.log(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

onMounted(() => {
  queryProfitWithdrawDepositAmount()
})
</script>
<template>
  <el-row :gutter="15">
    <el-col :span="6">
      <div class="cdp-text-blue mb-3">{{ $t('customer_detail_info.net_profit') }}</div>
      <div class="relative">
        <el-input v-model="amountData.total_profit" class="cdp-input cdp-input-disabled" readonly>
          <template #prepend>{{ currencySignText }}</template>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="cdp-text-blue mb-3">
        <span class="mr-8">{{ $t('customer_detail_info.net_amount') }}</span>
        <el-tooltip
          effect="dark"
          :content="$t('customer_detail_info.net_amount_desc')"
          placement="top"
        >
          <font-awesome-icon class="cursor-pointer" icon="fa-solid fa-info-circle" />
        </el-tooltip>
      </div>
      <div class="relative">
        <el-input
          v-model="amountData.withdraw_deposit_net_amount"
          class="cdp-input cdp-input-disabled"
          readonly
        >
          <template #prepend>{{ currencySignText }}</template>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="cdp-text-blue mb-3">{{ $t('customer_detail_info.total_deposit') }}</div>
      <div class="relative">
        <el-input v-model="amountData.total_deposit" class="cdp-input cdp-input-disabled" readonly>
          <template #prepend>{{ currencySignText }}</template>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="cdp-text-blue mb-3">{{ $t('customer_detail_info.total_withdraw') }}</div>
      <div class="relative">
        <el-input v-model="amountData.total_withdraw" class="cdp-input cdp-input-disabled" readonly>
          <template #prepend>{{ currencySignText }}</template>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.cdp-input {
  :deep(.el-input__inner) {
    cursor: default !important;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0 !important;
  }
}
</style>
