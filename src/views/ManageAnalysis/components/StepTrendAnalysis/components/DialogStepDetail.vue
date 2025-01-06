<script setup>
//開啟 dialog
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { apiQueryStepDetail } from '@/api/manageAnalysis.js'
import { addNumberColor, FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import StepConfig from '@/components/StepConfig.vue'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

//dialog 開啟狀態
const dialogVisible = ref(false)

const tableData = ref([]) //表格資料

//表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '25%'
    },
    {
      label: t('manage_analysis.bet_amount_ratio'),
      prop: 'bet_amount_percent',
      headerAlign: 'center',
      align: 'center',
      minWidth: '25%'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '25%'
    },
    {
      label: t('manage_analysis.profit_ratio'),
      prop: 'gross_percent',
      headerAlign: 'center',
      align: 'center',
      minWidth: '25%'
    }
  ]
})

const currentTooltipEntity = reactive({
  date: '',
  step: null
})

//呼叫api取得資料
const query_step_detail_tbl = async (param) => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryStepDetail({
      hall_name: activeHall.hall_code,
      query_date: dayjs(param.date).format('YYYY-MM-DD'),
      step: param.step
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true //取得資料成功
      transform_step_detail_tbl(result.data.result) //資料處理'
      return
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//轉換資料
const transform_step_detail_tbl = (data) => {
  const tempObj = {}
  const hallCurrencySign = globalStore.currencySign
  tempObj['bet_amount'] = FormatNumber(data.bet_amount, hallCurrencySign)
  tempObj['bet_amount_percent'] =
    data.bet_amount_percent === null ? '--' : FormatNumber(data.bet_amount_percent) + ' %'
  tempObj['payoff'] = addNumberColor(FormatNumber(data.payoff.toString(), hallCurrencySign))
  tempObj['gross_percent'] =
    data.gross_percent === null
      ? '--'
      : addNumberColor(FormatNumber(data.gross_percent.toString()) + '%')
  tableData.value = []
  tableData.value.push(tempObj)
}

//開啟dialog
const handleOpenDialog = (param) => {
  dialogVisible.value = true
  currentTooltipEntity['date'] = dayjs(param.date).format(t('date.format_date_rule'))
  currentTooltipEntity['step'] = param.step
  query_step_detail_tbl(param)
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog member-step-detail-dialog cdp-w__720"
      :append-to-body="true"
      :title="$t('common.detail')"
    >
      <div class="cdp-dialog__content">
        <div class="cdp-dialog__top">
          <div class="cdp-dialog__step">
            <StepConfig :stepIndex="currentTooltipEntity.step" />
          </div>
          <div class="cdp-dialog__date">
            {{ currentTooltipEntity.date }}
          </div>
        </div>
        <CdpMessage :messageKey="messageKey" class="cdp-bg-white" v-show="apiSuccess === false" />
        <CustomTable
          :tableData="tableData"
          :tableColumns="tableColumns"
          :hasPagination="false"
          border
          v-if="apiSuccess === true"
        >
          <template #payoff="scope">
            <div v-html="scope.row.payoff"></div>
          </template>
          <template #gross_percent="scope">
            <div v-html="scope.row.gross_percent"></div>
          </template>
        </CustomTable>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__content {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
  }
  &__date {
    font-size: 16px;
  }
}
</style>
