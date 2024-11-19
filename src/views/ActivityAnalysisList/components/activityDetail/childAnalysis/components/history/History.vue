<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberStepChanges } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import StepConfig from '@/components/StepConfig.vue'

const { t } = useI18n()

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  },
  activityId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const apiSuccess = ref(false) // 會員生命週期階段api是否成功
const messageKey = ref('loading') // 依照不同的messageKey產生不同的message

const tableData = ref([]) // 會員生命週期階段表格
const tableColumns = computed(() => {
  return [
    {
      label: t('manage_analysis.life_cycle_step_name'),
      prop: 'step_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '40%'
    },
    {
      label: t('activity_analysis.activity_before'),
      prop: 'activity_before',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('activity_analysis.activity_now'),
      prop: 'activity_now',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('activity_analysis.activity_after'),
      prop: 'activity_after',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    }
  ]
})

// 取得會員階段人數變化 api
const queryMemberStepChanges = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryMemberStepChanges({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformMemberStepChanges(result.data.result)
      apiSuccess.value = true
    } else {
      messageKey.value = 'queryFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      messageKey.value = 'noPermission'
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed'
    }
  }
}

const transformMemberStepChanges = (data) => {
  const stepDatas = data.not_reward
  const result = [] // 存放轉換後的資料
  // 階段0不處理，從階段1開始
  for (let i = 1; i < stepDatas.length; i++) {
    // 產生階段對應文字
    let tempObj = {}
    tempObj.step_index = i // 階段名稱的設定
    tempObj.activity_before = FormatNumber(stepDatas[i].before_num)
    tempObj.activity_now = FormatNumber(stepDatas[i].current_num)
    tempObj.activity_after = FormatNumber(stepDatas[i].after_num)

    result.push(tempObj)
  }

  tableData.value = result
}

onMounted(() => {
  queryMemberStepChanges()
})
</script>
<template>
  <section class="">
    <SectionTitle class="mb-15" :title="$t('manage_analysis.life_cycle_people_changes')" />
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      v-else
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      border
      class="customTable5"
    >
      <template #step_name="scope">
        <div class="cdp-link-box">
          <StepConfig :stepIndex="scope.row.step_index" />
        </div>
      </template>
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped></style>
