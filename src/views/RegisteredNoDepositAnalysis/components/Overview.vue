<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActionScoreSpan } from '@/api/registeredNoDepositAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { useRegisteredNoDepositAnalysis } from '@/stores/registeredNoDepositAnalysis.js'
import { storeToRefs } from 'pinia'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const deoositStore = useRegisteredNoDepositAnalysis()
const { selectDepositValue, deatilRangeDate, ipDuplicateRange } = storeToRefs(deoositStore)

const { t } = useI18n()

const emit = defineEmits(['update:detail'])

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const tableData = ref([])
const tableColumns = computed(() => {
  return [
    {
      label: t('register_no_deposit_analysis.deposit_prob'),
      prop: 'deposit_prob',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('register_no_deposit_analysis.total_people_num'),
      prop: 'total_people_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('register_no_deposit_analysis.total_deposit_people_num'),
      prop: 'total_deposit_people_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('register_no_deposit_analysis.deposit_ratio'),
      prop: 'deposit_ratio',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('register_no_deposit_analysis.avg_first_deposit_day'),
      prop: 'avg_first_deposit_day',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const queryActionScoreSpan = async () => {
  apiSuccess.value = false
  messageKey.value = 'shortLoading'
  try {
    const result = await apiQueryActionScoreSpan({
      hall_name: activeHall.hall_code,
      deposit_status: selectDepositValue.value,
      action_score_analysis_date: deatilRangeDate.value,
      ip_duplicate_range: ipDuplicateRange.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = []
      tableData.value = transformActionScoreSpan(result.data.result)
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'queryFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformActionScoreSpan = (data) => {
  return data.map((item) => {
    return {
      lower: item.lower,
      upper: item.upper,
      deposit_prob: `${item.lower}${t('common.contain_yes')} ~ ${item.upper}${t(
        `common.contain_${item.upper === '100%' ? 'yes' : 'no'}`
      )}`,
      total_people_num: item.span_count,
      total_deposit_people_num: item.enabled_count,
      deposit_ratio: FormatNumber(item.enabled_ratio) + '%',
      avg_first_deposit_day: FormatNumber(item.enabled_avg_day),
      has_bg: item.enabled_ratio >= 30 ? true : false
    }
  })
}

// 發送存款機率區間會員明細
const handleChangeDetail = (val) => {
  emit('update:detail', val.lower.replace('%', ';') + val.upper.replace('%', ';'))
}

onMounted(() => {
  queryActionScoreSpan()
})
</script>
<template>
  <div class="cdp-section-in">
    <div class="flex justify-between mb-14">
      <SectionTitle :title="$t('register_no_deposit_analysis.action_score_overview')">
      </SectionTitle>
      <div
        class="section-note"
        v-html="
          $t('register_no_deposit_analysis.info_text', {
            percent: `<span class='font-bold underline'>30%</span>`
          })
        "
      ></div>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess === true">
      <CustomTable
        :tableData="tableData"
        :tableColumns="tableColumns"
        :hasPagination="false"
        class="customTable3 action-score-overview-table"
      >
        <template #deposit_prob="scope">
          <div
            class="cell-box deposit_prob"
            :class="{ bg: scope.row.has_bg }"
            @click="handleChangeDetail(scope.row)"
          >
            {{
              $t('register_no_deposit_analysis.span_desc', {
                lower: scope.row.lower,
                contain_yes: $t('common.contain_yes'),
                upper: scope.row.upper,
                contain: $t(`common.contain_${scope.row.upper === '100%' ? 'yes' : 'no'}`)
              })
            }}
          </div>
        </template>
        <template #total_people_num="scope">
          <div class="cell-box total_people_num" :class="{ bg: scope.row.has_bg }">
            {{ scope.row.total_people_num }}
          </div>
        </template>
        <template #total_deposit_people_num="scope">
          <div class="cell-box total_deposit_people_num" :class="{ bg: scope.row.has_bg }">
            {{ scope.row.total_deposit_people_num }}
          </div>
        </template>
        <template #deposit_ratio="scope">
          <div class="cell-box deposit_ratio" :class="{ bg: scope.row.has_bg }">
            {{ scope.row.deposit_ratio }}
          </div>
        </template>
        <template #avg_first_deposit_day="scope">
          <div class="cell-box avg_first_deposit_day" :class="{ bg: scope.row.has_bg }">
            {{ scope.row.avg_first_deposit_day }}
          </div>
        </template>
      </CustomTable>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.section-note {
  display: flex;
  align-items: center;
  color: $blue;
  font-size: 14px;
  &::before {
    content: '';
    width: 18px;
    height: 18px;
    margin-right: 8px;
    border: 1px solid rgba(79, 132, 207, 0.3);
    background: rgba(107, 207, 223, 0.1);
  }
}
.deposit_prob {
  font-size: 14px;
  color: $blue;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    font-weight: 500;
  }
}
.action-score-overview-table {
  .cell-box {
    padding-top: 7px;
    padding-bottom: 7px;
  }
  .bg {
    background-color: rgba(107, 207, 223, 0.1);
  }
}
</style>
<style lang="scss">
.action-score-overview-table {
  .cell {
    padding: 0;
  }
  .el-table {
    td.el-table__cell {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
