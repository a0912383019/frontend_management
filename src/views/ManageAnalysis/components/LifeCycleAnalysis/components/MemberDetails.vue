<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiQueryLifeCycleAnalysisDetailTbl } from '@/api/manageAnalysis.js'
import {
  formatDateDuration,
  FormatNumber,
  addNumberColor,
  getCurrencySignText
} from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { queryDate } = manageAnalysisStore
const { searchName, fuzzySearch, useCustomList, stepType, detailType } =
  storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //會員生明細api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

//會員生命週期階段總覽表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.ag_name'),
      prop: 'ag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.deposit'),
      prop: 'deposit_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.active_days'),
      prop: 'activity_day',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.daily_avg_deposit'),
      prop: 'deposit_amount_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.daily_avg_bet_amount'),
      prop: 'bet_amount_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.daily_avg_payoff'),
      prop: 'payoff_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.life_cycle_step'),
      prop: 'life_cycle_step',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const tableData = ref([])

const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(15) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數

const updateCurrentPage = (data) => {
  //頁碼切換執行的內容
  console.log(data)
  apiDraw.value = data
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value

  query_life_cycle_analysis_detail_tbl()
}

const query_life_cycle_analysis_detail_tbl = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryLifeCycleAnalysisDetailTbl({
      hall_name: activeHall.hall_code,
      life_cycle_analysis_detail_date: formatDateDuration('2023/05/07 ~ 2023/06/04'),
      life_cycle_analysis_step: stepType.value,
      detail_type: detailType.value,
      query_date: queryDate,
      search_name: searchName.value,
      fuzzy_search: fuzzySearch.value,
      use_custom_list: useCustomList.value,
      draw: apiDraw.value,
      start: apiStart.value,
      length: apiLength.value,
      order: [
        {
          column: 2,
          dir: 'desc'
        }
      ], //預設排序欄位
      columns: [
        //列表表頭欄位
        {
          data: {
            hall_id: 'hall_id',
            domain_id: 'domain_id',
            user_id: 'user_id',
            user_name: 'user_name'
          },
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'ag_name',
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'deposit_amount',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'bet_amount',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'payoff',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'activity_day',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'deposit_amount_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'bet_amount_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'payoff_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: {
            hall_id: 'hall_id',
            domain_id: 'domain_id',
            user_id: 'user_id',
            user_name: 'user_name'
          },
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        }
      ]
    })
    console.log(result)
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = []
      tableData.value = result.data.data
      apiRecordsTotal.value = result.data.recordsTotal
    }
  } catch (error) {
    console.log(error)
  }
}

let tt = reactive({})

watch(
  () => activeHall.hall_code,
  () => {
    tt['currency'] = getCurrencySignText('BBIN', activeHall.hall_code)['currency']
    tt['currencySign'] = getCurrencySignText('BBIN', activeHall.hall_code)['currencySign']
    tt['currencySignText'] = getCurrencySignText('BBIN', activeHall.hall_code)['currencySignText']
  }
)

const test = computed(() => {
  return tt['currency']
})

//處理Message
onMounted(() => {
  //顯示 點擊上方總覽表格數值顯示明細 message
  messageKey.value = 'clickNumberAboveToShow'
})

defineExpose({ query_life_cycle_analysis_detail_tbl })
</script>
<template>
  {{ test }}
  <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
  <div v-show="apiSuccess">
    <SectionTitle class="mb-15" :title="t('manage_analysis.member_details')" />
    <CustomTable
      :serverSide="true"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="apiLength"
      :tableTotal="apiRecordsTotal"
      stripe
      class="cdp-life-cycle-member-table"
      @update:currentPage="updateCurrentPage"
    >
      <template #user_name="scope">
        <!-- 存款 -->
        <div class="cdp-link-click">{{ scope.row.user_name }}</div>
      </template>
      <template #deposit_amount="scope">
        <!-- 存款 -->
        <div>
          {{ FormatNumber(scope.row.deposit_amount) }}
        </div>
      </template>
      <template #bet_amount="scope">
        <!-- 貨量 -->
        <div>
          {{ FormatNumber(scope.row.bet_amount) }}
        </div>
      </template>
      <template #payoff="scope">
        <!-- 損益 -->
        <div v-html="addNumberColor(FormatNumber(scope.row.payoff), 'cdp-text-candypink')"></div>
      </template>
      <template #deposit_amount_avg="scope">
        <!-- 日均存款 -->
        <div>
          {{ FormatNumber(scope.row.deposit_amount_avg) }}
        </div>
      </template>
      <template #bet_amount_avg="scope">
        <!-- 日均獲量 -->
        <div>
          {{ FormatNumber(scope.row.bet_amount_avg) }}
        </div>
      </template>
      <template #payoff_avg="scope">
        <!-- 日均損益 -->
        <div
          v-html="addNumberColor(FormatNumber(scope.row.payoff_avg), 'cdp-text-candypink')"
        ></div>
      </template>
    </CustomTable>
  </div>
</template>
<style lang="scss">
.cdp-life-cycle-member-table {
  .el-table {
    th.el-table__cell.is-leaf {
      background-color: #e9eef6;
    }
    th.el-table__cell.is-leaf,
    td.el-table__cell {
      border: none;
    }
    td.el-table__cell {
      height: 54px;
    }
  }
}
</style>
