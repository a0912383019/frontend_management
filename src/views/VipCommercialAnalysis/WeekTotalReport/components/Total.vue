<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiWeekTotalReport } from '@/api'
import {
  addNumberColor,
  FormatNumber,
  errorRespond,
  extractNumberValue
} from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'

const vipStore = useVipCommercialAnalysisStore()
const { weekTotalReportFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const { t } = useI18n()

// api是否取得成功
const apiSuccess = ref(false)

// 依照不同的 messageKey 產生不同的 message
const messageKey = ref('loading')

// 表格 api 資料
const apiTableResult = ref([])

// 表格資料
const tableData = ref([])

// 表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('date.date_duration'),
      prop: 'date_duration',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.active_member'),
      prop: 'active_people',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.deposit'),
      prop: 'deposit_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bonus'),
      prop: 'premium_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.profit_and_loss'),
      prop: 'profit_loss',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.net_amount'),
      prop: 'net_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.ga_num'),
      prop: 'ga_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.login_num'),
      prop: 'login_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    }
  ]
})

// 呼叫 api
const queryWeekTotalReport = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiWeekTotalReport({
      hall_name: activeHall.hall_code,
      start_date: weekTotalReportFilter['start_date'],
      end_date: weekTotalReportFilter['end_date'],
      vip_tag: weekTotalReportFilter['vip_tag'].split(',')
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformWeekTotalReport(result.data.result)
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

const transformWeekTotalReport = (data) => {
  tableData.value = data.map((item) => {
    return {
      date_duration:
        dayjs(item.financial_week_start).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(item.financial_week_end).format(t('date.format_date_rule')),
      date_duration_start: dayjs(item.financial_week_start).format(t('date.format_date_rule')),
      date_duration_end: dayjs(item.financial_week_end).format(t('date.format_date_rule')),
      active_people: FormatNumber(item.active_people),
      deposit_amount: FormatNumber(item.deposit_amount),
      bet_amount: FormatNumber(item.bet_amount),
      payoff: addNumberColor(FormatNumber(item.payoff)),
      premium_amount: addNumberColor(FormatNumber(item.premium_amount)),
      profit_loss: addNumberColor(FormatNumber(item.profit_loss)),
      net_amount: addNumberColor(FormatNumber(item.net_amount)),
      ga_num: FormatNumber(item.ga_num),
      login_num: FormatNumber(item.login_num)
    }
  })
  apiTableResult.value = tableData.value.slice(0)
}

// 自定義排序執行的內容
const upadteCurrentSort = ({ prop, order }) => {
  tableData.value.sort((a, b) => {
    const valueA = extractNumberValue(a[prop])
    const valueB = extractNumberValue(b[prop])

    if (isNaN(valueA)) return 1
    if (isNaN(valueB)) return -1

    return order === 'descending' ? valueB - valueA : valueA - valueB
  })
}

onMounted(() => {
  queryWeekTotalReport()
})

defineExpose({ queryWeekTotalReport })
</script>
<template>
  <section class="cdp-section-in">
    <div class="top-box">
      <SectionTitle
        :title="$t('vip_commercial_analysis.week_total_report_table')"
        class="mb-15"
      ></SectionTitle>
      <CurrencySignText v-show="apiSuccess" />
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="true"
      :stripe="true"
      class="customTable2"
      @sort="upadteCurrentSort"
      v-if="apiSuccess === true"
    >
      <!-- 日期區間 -->
      <template #date_duration="scope">
        <div class="date">
          <span class="date__start">{{ scope.row['date_duration_start'] }}</span>
          <span class="date__end">{{ scope.row['date_duration_end'] }}</span>
        </div>
      </template>

      <!-- 損益 -->
      <template #payoff="scope">
        <div v-html="scope.row['payoff']"></div>
      </template>

      <!-- 優惠獎金 -->
      <template #premium_amount="scope">
        <div v-html="scope.row['premium_amount']"></div>
      </template>

      <!-- 實際損益 -->
      <template #profit_loss="scope">
        <div v-html="scope.row['profit_loss']"></div>
      </template>

      <!-- 淨額 -->
      <template #net_amount="scope">
        <div v-html="scope.row['net_amount']"></div>
      </template>
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
.top-box {
  display: flex;
  justify-content: space-between;
}

.date {
  &__start {
    position: relative;
    display: inline-block;
    &::after {
      content: '~';
      position: absolute;
      right: -13px;
      top: 1px;
    }
  }
  &__end {
    display: block;
  }
}
</style>
