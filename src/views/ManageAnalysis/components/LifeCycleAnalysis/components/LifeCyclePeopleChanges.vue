<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { apiQueryLifeCycleAnalysisOverview } from '@/api/manageAnalysis.js'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import { FormatNumber } from '@/utils/commonUtils.js'
import { date_range_picker_config_4 } from '@/utils/dateConfig.js'
import FilterMemberName from './FilterMemberName.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DotsSM from '@/components/Dots/DotsSM.vue'

const { t, locale: i18nLocale } = useI18n()
const router = useRouter()
const globalStore = useGlobalStore()
const { activeHall } = globalStore
const manageAnalysisStore = useManageAnalysisStore()
const { searchName, fuzzySearch, useCustomList, filterTimestamp } = storeToRefs(manageAnalysisStore)
const { queryDate } = manageAnalysisStore

const emit = defineEmits(['queryStepTrendAnalysis'])

const query_life_cycle_analysis = () => {
  query_life_cycle_analysis_overview_tbl() // 產生會員生命週期階段表格
}

const apiTableResult = ref([]) //會員生命週期階段api資料
const tableData = ref([]) //會員生命週期階段表格
const tableTotalPeopleNum = ref(0) //會員生命週期階段表尾總人數

//處理Message
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

//會員生命週期階段總覽資料config
const tableConfig = computed(() => {
  const config = RFM_NAPL_step_config
  config[1]['step_name'] = t('member_life_cycles.active')
  config[2]['step_name'] = t('member_life_cycles.newBorn')
  config[3]['step_name'] = t('member_life_cycles.growing')
  config[4]['step_name'] = t('member_life_cycles.churning_return')
  config[5]['step_name'] = t('member_life_cycles.churned_return')
  config[6]['step_name'] = t('member_life_cycles.churning')
  config[7]['step_name'] = t('member_life_cycles.churned')
  config[7]['step_name'] = t('member_life_cycles.churned')
  return config
})

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

//tooltip顯示對應日期
const tooltipDate = computed(() => {
  return {
    today: dayjs(date_range_picker_config_4['startDate']).format(t('date.format_date_rule')),
    yesterday: dayjs(date_range_picker_config_4['startDate'])
      .startOf('day')
      .subtract(1, 'day')
      .format(t('date.format_date_rule'))
  }
})

//取得會員階段人數變化api
const query_life_cycle_analysis_overview_tbl = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  console.log('pinia searchName', searchName.value)
  try {
    const result = await apiQueryLifeCycleAnalysisOverview({
      hall_name: activeHall.hall_code,
      query_date: queryDate,
      search_name: searchName.value,
      fuzzy_search: fuzzySearch.value,
      use_custom_list: useCustomList.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true //取得資料成功
      apiTableResult.value = []
      apiTableResult.value = result.data.result //存放取得的api資料
      //資料處理
      transform_life_cycle_analysis_overview_tbl(result.data.result)
      console.log(tableData.value)
    } else if (return_code === '0001') {
      apiSuccess.value = false //取得資料失敗
      messageKey.value = 'noResult' //更改message內容
    } else if (return_code === '9999') {
      apiSuccess.value = false //取得資料失敗
      messageKey.value = 'queryFailed' //更改message內容
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

//轉換會員階段人數變化資料
const transform_life_cycle_analysis_overview_tbl = (data) => {
  const result = data.step_data
  const ary = [] //存放轉換後的資料
  // 階段0不處理，從階段1開始
  for (let i = 1; i < result.length; i++) {
    //產生階段對應文字
    let tempObj = {}
    tempObj['config'] = tableConfig.value[i] //階段名稱的設定
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
    console.log('activeHall.hall_code')
    query_life_cycle_analysis()
  }
)

watch(i18nLocale, () => {
  transform_life_cycle_analysis_overview_tbl(apiTableResult.value)
})

onMounted(() => {
  if (activeHall.hall_code !== '' && activeHall.hall_code !== undefined) {
    query_life_cycle_analysis()
  }
})

const selectRow = ref(null)

const handleClick = (data) => {
  console.log('handleClick', data)
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
  () => filterTimestamp.value,
  () => {
    console.log('filterTimestamp', filterTimestamp)
    query_life_cycle_analysis()
    selectRow.value = null
  }
)
</script>
<template>
  <section class="cdp-section">
    <div class="section-top-filter"><FilterMemberName /></div>
    <SectionTitle class="mb-15" :title="t('manage_analysis.life_cycle_people_changes')">
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
        <div class="step-name cdp-link-box">
          <font-awesome-icon
            class="step-name__icon"
            :icon="scope['row']['config']['step_vue_icon']"
          />
          <div class="step-name__title">{{ scope['row']['config']['step_name'] }}</div>
          <DotsSM class="step-name__dots" :class="scope['row']['config']['step_vue_dot_color']" />
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
            <td width="20%" align="center">{{ t('data_name.total_people_num') }}</td>
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
.step-name {
  display: flex;
  flex-wrap: wrap;
  color: #404040;
  &__icon {
    margin-right: 6px;
    margin-top: 4px;
    flex-shrink: 0;
  }
  &__title {
    margin-right: 6px;
  }
  &__dots {
    flex-shrink: 0;
    margin-top: 6px;
  }
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
}
</style>
