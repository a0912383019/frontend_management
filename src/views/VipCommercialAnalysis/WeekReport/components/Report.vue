<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore, useDialogMemberDetailStore } from '@/stores'
import { apiWeekReport } from '@/api'
import { addNumberColor, FormatNumber, errorRespond, sortTableData } from '@/utils/commonUtils.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import PercentWithIcon from '@/components/PercentWithIcon.vue'
import ExportCSV from './ExportCSV.vue'

const vipStore = useVipCommercialAnalysisStore()
const { weekReportFilter } = vipStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const { t } = useI18n()

// api是否取得成功
const apiSuccess = ref(false)

// 依照不同的 messageKey 產生不同的 message
const messageKey = ref('loading')

// 表格資料
const tableData = ref([])

// 表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.deposit'),
      prop: 'deposit_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bonus'),
      prop: 'offer_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.profit_and_loss'),
      prop: 'profit_loss',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.net_amount'),
      prop: 'net_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.ga_num'),
      prop: 'ga_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.login_num'),
      prop: 'login_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    }
  ]
})

// call api
const queryWeekReport = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  const { financialMonth, financialWeek, financialYear, vipTag } = weekReportFilter
  try {
    const result = await apiWeekReport({
      hall_name: activeHall.hall_code,
      financial_month: financialMonth,
      financial_week: financialWeek,
      financial_year: financialYear,
      vip_tag: vipTag.split(',')
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformWeekReport(result.data.result)
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed'
    }
  }
}

// 轉換資料
const transformWeekReport = (data) => {
  tableData.value = data.map((item) => {
    return {
      ...item,
      user: {
        user_name: item.user_name,
        user_id: item.user_id
      },
      user_name: item.user_name,
      deposit_amount: FormatNumber(item.deposit_amount),
      bet_amount: FormatNumber(item.bet_amount),
      payoff: addNumberColor(FormatNumber(item.payoff)),
      offer_amount: FormatNumber(item.offer_amount),
      profit_loss: addNumberColor(FormatNumber(item.profit_loss)),
      net_amount: addNumberColor(FormatNumber(item.net_amount)),
      ga_num: FormatNumber(item.ga_num),
      login_num: FormatNumber(item.login_num)
    }
  })
}

// 自定義排序執行的內容
const upadteCurrentSort = ({ prop, order }) => {
  sortTableData({ prop, order, tableData: tableData.value })
}

defineExpose({ queryWeekReport })
</script>
<template>
  <section class="cdp-section-in">
    <div class="detail-top-box">
      <SectionTitle :title="$t('vip_commercial_analysis.week_report')"> </SectionTitle>
      <div class="detail-top-box__right">
        <CurrencySignText class="mr-20" />
        <ExportCSV />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      v-else
      :tableData="tableData"
      :tableColumns="tableColumns"
      :stripe="true"
      class="customTable2"
      @sort="upadteCurrentSort"
    >
      <template #bet_amount-header>
        <span class="mr-5">{{ $t('data_name.bet_amount') }}</span>
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <div class="font-size-14">
              {{ $t('vip_commercial_analysis.compare_percent_desc') }}
            </div>
          </template>
          <font-awesome-icon class="title__icon activeStepBtn" icon="fa-solid fa-circle-info" />
        </el-tooltip>
      </template>

      <!-- 會員名稱 -->
      <template #user_name="scope">
        <span class="cdp-link-click" @click="updateMemberData(scope.row.user)">
          {{ scope.row.user_name }}
        </span>
      </template>

      <!-- 貨量 -->
      <template #bet_amount="scope">
        <div v-html="scope.row.bet_amount"></div>
        <PercentWithIcon
          :percentData="scope.row.compare_bet_amount_percent"
          fontSize="14"
          fontWeight="normal"
          iconSize="13"
        />
      </template>

      <!-- 損益 -->
      <template #payoff="scope">
        <div v-html="scope.row.payoff"></div>
      </template>

      <!-- 優惠獎金 -->
      <template #offer_amount="scope">
        <div v-html="scope.row.offer_amount"></div>
      </template>

      <!-- 實際損益 -->
      <template #profit_loss="scope">
        <div v-html="scope.row.profit_loss"></div>
      </template>

      <!-- 淨額 -->
      <template #net_amount="scope">
        <div v-html="scope.row.net_amount"></div>
      </template>
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
.detail-top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  &__right {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
}
:deep(.cdp-text-light__slate__gray) {
  color: #6c757d !important;
}
</style>
