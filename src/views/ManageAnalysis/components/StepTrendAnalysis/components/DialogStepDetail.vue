<script setup>
//開啟 dialog
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global.js'
import { apiQueryStepDetail } from '@/api/manageAnalysis.js'
import {
  addNumberColor,
  FormatNumber,
  getHallCurrencySign,
  errorRespond
} from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import StepConfig from '@/components/StepConfig.vue'
import dayjs from 'dayjs'

const { t } = useI18n()
const router = useRouter()

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
    console.log(result)
    if (return_code === '0000') {
      apiSuccess.value = true //取得資料成功
      transform_step_detail_tbl(result.data.result) //資料處理
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      // 清除所有sessionStorage與localStorage
      sessionStorage.clear()
      localStorage.clear()
      sessionStorage.access_token = '9999' // 9999表示token有誤，需重新登入取得新token
      router.push({ name: 'Login' })
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}
//轉換資料
const transform_step_detail_tbl = (data) => {
  const tempObj = {}
  const hallCurrencySign = getHallCurrencySign('BBIN', activeHall.hall_code)
  tempObj['bet_amount'] = FormatNumber(data.bet_amount, hallCurrencySign)
  tempObj['bet_amount_percent'] = FormatNumber(data.bet_amount_percent) + ' %'
  tempObj['payoff'] = addNumberColor(FormatNumber((0 - data.payoff).toString(), hallCurrencySign))
  tempObj['gross_percent'] = addNumberColor(FormatNumber((0 - data.gross_percent).toString()) + '%')
  tableData.value = []
  tableData.value.push(tempObj)
}

//開啟dialog
const handleOpenDialog = (param) => {
  console.log('handleOpenDialog', param)
  dialogVisible.value = true
  currentTooltipEntity['date'] = dayjs(param.date).format('YYYY-MM-DD')
  currentTooltipEntity['step'] = param.step
  query_step_detail_tbl(param)
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <!-- @close="handleCloseDialog" -->
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog member-step-detail-dialog cdp-w__720"
      :append-to-body="true"
      :title="t('common.detail')"
    >
      <div class="cdp-dialog__content">
        <div class="cdp-dialog__top">
          <div class="cdp-dialog__step">
            <StepConfig :stepIndex="currentTooltipEntity.step" />
          </div>
          <div class="cdp-dialog__date">
            {{ dayjs(currentTooltipEntity.date).format('YYYY/MM/DD') }}
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
