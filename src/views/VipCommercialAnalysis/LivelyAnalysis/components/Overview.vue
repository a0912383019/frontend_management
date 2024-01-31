<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { dayjs, ElNotification } from 'element-plus'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiQueryLivelyAnalysisOverview } from '@/api/vipCommercialAnalysis.js'
import { addNumberColor, FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { activityStep } = storeToRefs(globalStore)

const { t } = useI18n()

const emit = defineEmits(['update:detail_api'])

// 反轉活躍度資料
const reverseActivityStep = computed(() => {
  return activityStep.value.slice().reverse()
})

const apiTableResult = ref([]) // 活躍度總覽api資料
const tableData = ref([]) // 活躍度總覽表格
const tableTotalPeopleNum = ref(0) // 活躍度總覽表尾總人數

const apiSuccess = ref(false) // 活躍度總覽api是否成功

// 活躍度總覽表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('member_active_level.active_level'),
      prop: 'lively_level',
      headerAlign: 'center',
      align: 'left',
      minWidth: '20%'
    },
    {
      label: t('vip_commercial_analysis.this_week_people_num'),
      prop: 'total_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('vip_commercial_analysis.compare_last_week_people_num'),
      prop: 'weekDiff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('vip_commercial_analysis.this_week_increase_people_num'),
      prop: 'increase_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('vip_commercial_analysis.this_week_decrease_people_num'),
      prop: 'decrease_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    }
  ]
})

// 依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const today = computed(() => {
  return dayjs(livelyAnalysisFilter['date']).format(t('date.format_date_rule'))
})

// tooltip顯示對應日期
const tooltipDate = computed(() => {
  return {
    lastWeekData: `
    ${dayjs(today.value).subtract(13, 'day').format(t('date.format_date_rule'))} ~
    ${dayjs(today.value).subtract(7, 'day').format(t('date.format_date_rule'))}`,
    thisWeekData: `
      ${dayjs(today.value).subtract(6, 'day').format(t('date.format_date_rule'))} ~
      ${today.value}`
  }
})

// 取得活躍度總覽
const queryLivelyAnalysisOverview = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiQueryLivelyAnalysisOverview({
      hall_name: activeHall.hall_code,
      lively_analysis_end_date: dayjs(livelyAnalysisFilter['date']).format('YYYY-MM-DD'),
      lively_analysis_vip_tag: livelyAnalysisFilter['searchTag'],
      search_name: livelyAnalysisFilter['member'],
      fuzzy_search: livelyAnalysisFilter['fuzzySearch'],
      use_custom_list: livelyAnalysisFilter['use_custom_list']
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      apiTableResult.value = result.data.result
      transformLivelyAnalysisOverview(result.data.result)
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
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

// 整理資料
const transformLivelyAnalysisOverview = (data) => {
  let total = 0
  const mapData = data.map((item) => {
    // 對比上週差異
    const diffNumber = FormatNumber(item['increase_num'] - item['decrease_num'])
    const diffAddColor =
      diffNumber > 0
        ? addNumberColor('+' + diffNumber, 'cdp-text-lightgreen')
        : addNumberColor(diffNumber, 'cdp-text-candypink')

    // 計算總人數
    total += item['total_num']

    return {
      lively_level: item['lively_level'],
      total_num: FormatNumber(item['total_num']),
      weekDiff: diffAddColor,
      increase_num: FormatNumber(item['increase_num']),
      decrease_num: FormatNumber(item['decrease_num'])
    }
  })
  tableTotalPeopleNum.value = FormatNumber(total)
  tableData.value = []
  tableData.value = mapData.reverse()
}

// 傳遞呼叫活躍度明細的 api 參數
const handleCallDeatilApi = (data) => {
  emit('update:detail_api', data)
}

onMounted(() => {
  queryLivelyAnalysisOverview()
})

defineExpose({ queryLivelyAnalysisOverview })
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle class="mb-15" :title="$t('vip_commercial_analysis.lively_analysis_overview')">
      <template #tooltip>
        <div class="tooltip-date">
          <div>{{ $t('date.last_week') }}：{{ tooltipDate['lastWeekData'] }}</div>
          <div>{{ $t('date.this_week') }}：{{ tooltipDate['thisWeekData'] }}</div>
        </div>
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      border
      class="customTable4"
      v-if="apiSuccess === true"
    >
      <!-- 活躍度 -->
      <template #lively_level="scope">
        <div class="cdp-link-box flex justify-center">
          <el-tooltip
            effect="dark"
            placement="top"
            :content="reverseActivityStep[scope.row.lively_level]['title']"
          >
            <font-awesome-icon
              :class="['font-size-30', reverseActivityStep[scope.row.lively_level]['iconColor']]"
              :icon="['fa-regular', reverseActivityStep[scope.row.lively_level]['icon']]"
            />
          </el-tooltip>
        </div>
      </template>

      <!-- 本週人數 -->
      <template #total_num="scope">
        <div
          class="cdp-link-box cursor-pointer"
          @click="handleCallDeatilApi({ level: scope.row.lively_level, type: 0 })"
        >
          <div class="cdp-link-click">
            {{ scope.row['total_num'] }}
          </div>
        </div>
      </template>

      <!-- 對比上週差異 -->
      <template #weekDiff="scope">
        <div class="cdp-link-box" v-html="scope.row.weekDiff"></div>
      </template>

      <!-- 本週新鞥 -->
      <template #increase_num="scope">
        <div
          class="cdp-link-box cursor-pointer"
          @click="handleCallDeatilApi({ level: scope.row.lively_level, type: 1 })"
        >
          <div class="cdp-link-click">
            {{ scope.row['increase_num'] }}
          </div>
        </div>
      </template>

      <!-- 本週減少 -->
      <template #decrease_num="scope">
        <div
          class="cdp-link-box cursor-pointer"
          @click="handleCallDeatilApi({ level: scope.row.lively_level, type: 2 })"
        >
          <div class="cdp-link-click">
            {{ scope.row['decrease_num'] }}
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
.cdp-link-box {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
