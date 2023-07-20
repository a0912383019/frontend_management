<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryProfitWithdrawDepositAmount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { getHallCurrencySign, FormatNumber } from '@/utils/commonUtils.js'
import BoxLoading from '@/components/Loading/BoxLoading.vue'

const { t } = useI18n()

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
const boxIsLoading = ref(true)

//取得會員時間區間內實際損益與出入款總金額
const queryProfitWithdrawDepositAmount = async () => {
  boxIsLoading.value = true //顯示loading
  try {
    const result = await apiQueryProfitWithdrawDepositAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    // console.log('queryProfitWithdrawDepositAmount', result)
    const { return_code } = result.data.status
    if (return_code === '0000') {
      const { total_deposit, total_profit, total_withdraw, withdraw_deposit_net_amount } =
        result.data.result
      amountData['total_deposit'] = FormatNumber(total_deposit)
      amountData['total_profit'] = FormatNumber(total_profit)
      amountData['total_withdraw'] = FormatNumber(total_withdraw)
      amountData['withdraw_deposit_net_amount'] = FormatNumber(withdraw_deposit_net_amount)
      currencySignText.value = getHallCurrencySign('BBIN', activeHall.hall_code)
      boxIsLoading.value = false //載入完成 移除loading
    }
  } catch (error) {
    console.log(error)
    boxIsLoading.value = true //顯示loading
    amountData['total_deposit'] = ''
    amountData['total_profit'] = ''
    amountData['total_withdraw'] = ''
    amountData['withdraw_deposit_net_amount'] = ''
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

onMounted(() => {
  queryProfitWithdrawDepositAmount()
})

watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryProfitWithdrawDepositAmount()
  }
)
</script>
<template>
  <div>
    <el-row :gutter="15" class="mb-20">
      <el-col :span="6">
        <div class="cdp-text-blue mb-5">{{ $t('customer_detail_info.net_profit') }}</div>
        <div class="relative">
          <transition>
            <BoxLoading v-show="boxIsLoading" />
          </transition>
          <el-input v-model="amountData.total_profit" class="cdp-input" readonly>
            <template #prepend>{{ currencySignText }}</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cdp-text-blue mb-5">
          <span class="mr-8">{{ $t('customer_detail_info.net_amount') }}</span>
          <el-tooltip
            effect="dark"
            :content="t('customer_detail_info.net_amount_desc')"
            placement="top"
          >
            <font-awesome-icon class="cursor-pointer" icon="fa-solid fa-info-circle" />
          </el-tooltip>
        </div>
        <div class="relative">
          <transition>
            <BoxLoading v-show="boxIsLoading" />
          </transition>
          <el-input
            v-model="amountData.withdraw_deposit_net_amount"
            class="cdp-input"
            readonly
            v-show="!boxIsLoading"
          >
            <template #prepend>{{ currencySignText }}</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cdp-text-blue mb-5">{{ $t('customer_detail_info.total_deposit') }}</div>
        <div class="relative">
          <transition>
            <BoxLoading v-show="boxIsLoading" />
          </transition>
          <el-input
            v-model="amountData.total_deposit"
            class="cdp-input"
            readonly
            v-show="!boxIsLoading"
          >
            <template #prepend>{{ currencySignText }}</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="cdp-text-blue mb-5">{{ $t('customer_detail_info.total_withdraw') }}</div>
        <div class="relative">
          <transition>
            <BoxLoading v-show="boxIsLoading" />
          </transition>
          <el-input
            v-model="amountData.total_withdraw"
            class="cdp-input"
            readonly
            v-show="!boxIsLoading"
          >
            <template #prepend>{{ currencySignText }}</template>
          </el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped></style>
