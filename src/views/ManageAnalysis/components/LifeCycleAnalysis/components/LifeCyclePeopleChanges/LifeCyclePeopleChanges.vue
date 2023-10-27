<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { apiQueryLifeCycleAnalysisOverview } from '@/api/manageAnalysis.js'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import FilterMemberName from './components/FilterMemberName.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import StepConfig from '@/components/StepConfig.vue'

const { date_range_picker_config_4 } = useDateStore()

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore
const manageAnalysisStore = useManageAnalysisStore()
const { searchName, fuzzySearch, useCustomList, filterTimestamp, filterCustomUserList } =
  storeToRefs(manageAnalysisStore)
const { queryDate } = manageAnalysisStore

const emit = defineEmits(['queryStepTrendAnalysis'])

const apiTableResult = ref([]) //會員生命週期階段api資料
const tableData = ref([]) //會員生命週期階段表格
const tableTotalPeopleNum = ref(0) //會員生命週期階段表尾總人數

const apiSuccess = ref(false) //會員生命週期階段api是否成功

//會員生命週期階段總覽表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('manage_analysis.life_cycle_step_name'),
      prop: 'step_name',
      headerAlign: 'center',
      align: 'left',
      minWidth: '20%'
    },
    {
      label: t('manage_analysis.today_num'),
      prop: 'total_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.people_percent'),
      prop: 'people_percent',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.diff_pre_day'),
      prop: 'diff_pre_day',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.today_add'),
      prop: 'increase_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('manage_analysis.today_minus'),
      prop: 'decrease_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    }
  ]
})

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const activeFile = ref('')

//tooltip顯示對應日期
const tooltipDate = computed(() => {
  return {
    today: dayjs(date_range_picker_config_4['endDate']).format(t('date.format_date_rule')),
    yesterday: dayjs(date_range_picker_config_4['endDate'])
      .startOf('day')
      .subtract(1, 'day')
      .format(t('date.format_date_rule'))
  }
})

//取得會員階段人數變化api
const queryLifeCycleAnalysisOverviewTbl = async (customUserList) => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiQueryLifeCycleAnalysisOverview({
      hall_name: activeHall.hall_code,
      query_date: queryDate,
      search_name: searchName.value,
      fuzzy_search: fuzzySearch.value,
      custom_user_list: customUserList
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true //取得資料成功
      apiTableResult.value = []
      apiTableResult.value = result.data.result //存放取得的api資料
      //資料處理
      transformLifeCycleAnalysisOverviewTbl(result.data.result)
    } else if (return_code === '9999') {
      apiTableResult.value = []
      tableData.value = []
      tableTotalPeopleNum.value = 0
      apiSuccess.value = false //取得資料失敗
      messageKey.value = 'queryFailed' //更改message內容
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    apiTableResult.value = []
    tableData.value = []
    tableTotalPeopleNum.value = 0
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//轉換會員階段人數變化資料
const transformLifeCycleAnalysisOverviewTbl = (data) => {
  const result = data.step_data
  const ary = [] //存放轉換後的資料
  // 階段0不處理，從階段1開始
  for (let i = 1; i < result.length; i++) {
    //產生階段對應文字
    let tempObj = {}
    tempObj['step_index'] = i //階段名稱的設定
    tempObj['total_num'] = {
      data: FormatNumber(result[i].total_num),
      id: i + '0',
      step: i,
      detail: 0
    } //本日人數
    tempObj['people_percent'] = FormatNumber(result[i].people_percent) + ' %' //人數佔比
    //對比前日差異
    tempObj['diff_pre_day'] = {
      class: '',
      num: ''
    }
    if (result[i].increase_num - result[i].decrease_num > 0) {
      tempObj['diff_pre_day']['class'] = 'cdp-text-lightgreen'
      tempObj['diff_pre_day']['num'] =
        '+' + FormatNumber(result[i].increase_num - result[i].decrease_num)
    } else {
      tempObj['diff_pre_day']['class'] = 'cdp-text-candypink'
      tempObj['diff_pre_day']['num'] = FormatNumber(result[i].increase_num - result[i].decrease_num)
    }
    tempObj['increase_num'] = {
      data: FormatNumber(result[i].increase_num),
      id: i + '1',
      step: i,
      detail: 1
    } //本日新增
    tempObj['decrease_num'] = {
      data: FormatNumber(result[i].decrease_num),
      id: i + '2',
      step: i,
      detail: 2
    } //本日減少
    ary.push(tempObj)
  }
  tableData.value = []
  tableData.value = ary

  tableTotalPeopleNum.value = FormatNumber(data.total_people_num)
}
watch(
  () => activeHall.hall_code,
  () => {
    queryLifeCycleAnalysisOverviewTbl()
  }
)

watch(i18nLocale, () => {
  transformLifeCycleAnalysisOverviewTbl(apiTableResult.value)
})

onMounted(() => {
  if (activeHall.hall_code !== '' && activeHall.hall_code !== undefined) {
    queryLifeCycleAnalysisOverviewTbl()
  }
})

const selectRow = ref(null)

const handleClick = (data) => {
  selectRow.value = data.id
  manageAnalysisStore.stepType = data.step
  manageAnalysisStore.detailType = data.detail
  emit('queryStepTrendAnalysis')
}

//按了進階篩選內的篩選按鈕
// const handleQueryFilter = () => {
//   query_life_cycle_analysis()
//   selectRow.value = null
// }

watch(
  () => activeFile.value,
  () => {
    /*-- 
      備註：
      目前FilterMemberName.vue有更新updateFilterTimestamp
      使階段總覽及會員明細更動狀態，所以監聽檔名異動後去搜尋資料，會發生資料被覆蓋
    --*/
    filterCustomUserList.value = activeFile.value
  }
)

watch(
  () => filterTimestamp.value,
  () => {
    let customUserList = []
    if (activeFile.value !== '' && useCustomList.value === true) {
      customUserList = activeFile.value
    }
    queryLifeCycleAnalysisOverviewTbl(customUserList)
    selectRow.value = null
  }
)
</script>
<template>
  <section class="cdp-section">
    <div class="section-top-filter"><FilterMemberName v-model="activeFile" /></div>
    <SectionTitle class="mb-15" :title="$t('manage_analysis.life_cycle_people_changes')">
      <template #tooltip>
        <div class="tooltip-date">
          <div>{{ $t('date.yesterday') }}：{{ tooltipDate['yesterday'] }}</div>
          <div>{{ $t('date.today') }}：{{ tooltipDate['today'] }}</div>
        </div>
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      border
      class="cdp-life-cycle-people-changes-table"
      v-if="apiSuccess === true"
    >
      <template #step_name="scope">
        <!-- 階段名稱內容 -->
        <div class="cdp-link-box">
          <StepConfig :stepIndex="scope.row.step_index" />
        </div>
      </template>
      <template #total_num="scope">
        <!-- 本日人數 -->
        <div
          class="cdp-link-box cursor-pointer"
          :class="{ selected: scope.row.total_num.id === selectRow }"
          @click="handleClick(scope.row.total_num)"
        >
          <div class="cdp-link-click">
            {{ scope['row']['total_num']['data'] }}
          </div>
        </div>
      </template>
      <template #diff_pre_day="scope">
        <!-- 對比前日差異 -->
        <div :class="scope['row']['diff_pre_day']['class']" class="cdp-link-box">
          {{ scope['row']['diff_pre_day']['num'] }}
        </div>
      </template>
      <template #increase_num="scope">
        <!-- 本日新增 -->
        <div
          class="cdp-link-box cursor-pointer"
          :class="{ selected: scope.row.increase_num.id === selectRow }"
          @click="handleClick(scope.row.increase_num)"
        >
          <div class="cdp-link-click">
            {{ scope['row']['increase_num']['data'] }}
          </div>
        </div>
      </template>
      <template #decrease_num="scope">
        <!-- 本日減少 -->
        <div
          class="cdp-link-box cursor-pointer"
          :class="{ selected: scope.row.decrease_num.id === selectRow }"
          @click="handleClick(scope.row.decrease_num)"
        >
          <div class="cdp-link-click">
            {{ scope['row']['decrease_num']['data'] }}
          </div>
        </div>
      </template>

      <template #append>
        <table class="table-total">
          <tr>
            <td width="20%" align="center">{{ $t('data_name.total_people_num') }}</td>
            <td width="80%" align="center">{{ tableTotalPeopleNum }}</td>
          </tr>
        </table>
      </template>
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  position: relative;
}
.section-top-filter {
  position: absolute;
  right: 0;
  top: -67px;
}
.tooltip-date {
  font-size: 14px;
}

.table-total {
  width: 100%;
  td {
    height: 40px;
    background-color: rgba(250, 248, 244, 0.5);
    border-right: 1px solid #e6eaf2;
    font-size: 14px;
    color: #404040;
    font-weight: 700;
  }
}

.cdp-link-box {
  padding: 8px 12px;
  &.selected {
    background-color: rgba(107, 207, 223, 0.1);
  }
}
</style>
<style lang="scss">
.cdp-life-cycle-people-changes-table {
  td.el-table__cell {
    padding: 0;
    .cell {
      padding: 0;
    }
  }
  //遇到表尾總人數第一欄總是會不對齊，目前想不到比較好的解決方式，先將第一欄右邊線隱藏，使用after製作第一欄的右邊線
  .el-table {
    &__header-wrapper,
    &__body-wrapper {
      position: relative;
      z-index: 1;
      &::after {
        content: '';
        position: absolute;
        left: 20%;
        top: 0;
        z-index: 3;
        width: 1px;
        height: 100%;
        background-color: #e6eaf2;
      }
    }
    &__header-wrapper {
      .el-table {
        &__header {
          tr {
            th {
              &:nth-child(1) {
                border-right: none;
              }
            }
          }
        }
      }
    }
    &__body-wrapper {
      .el-table {
        &__body {
          tr {
            td {
              &:nth-child(1) {
                border-right: none;
              }
            }
          }
        }
      }
    }
    &__append-wrapper {
      table {
        tr {
          td {
            &:nth-child(1) {
              border-right: none;
            }
          }
        }
      }
    }
  }
}
</style>
