<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import { useGlobalStore } from '@/stores'
import { apiQueryMemberRecentWeekLively } from '@/api/global.js'
import { errorRespond } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { iconStep } from '@/../public/js/system_config.js'

const { t } = useI18n()

const props = defineProps({
  data: Object
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

// 表格
const tableData = ref([])

// api是否成功
const apiSuccess = ref(false)

// 依照不同的messageKey產生不同的message
const messageKey = ref('loading')

// 表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('date.date_duration'),
      prop: 'duration',
      align: 'center',
      minWidth: '67%'
    },
    {
      label: t('member_active_level.avg_activity_level'),
      prop: 'icon',
      align: 'center',
      minWidth: '33%'
    }
  ]
})

// 取得api資料
const queryMemberRecentWeekLively = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiQueryMemberRecentWeekLively({
      hall_name: activeHall.hall_code,
      user_id: props.data.user_id,
      start_date: props.data.startDate,
      end_date: props.data.endDate
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformMemberRecentWeekLively(result.data.result)
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
const transformMemberRecentWeekLively = (data) => {
  let transformData = data.map((item) => {
    return {
      duration: item.analysis_date,
      avgLevel: item.analysis_level,
      score: item.avg_action_score,
      icon: iconStep(item.analysis_level),
      iconStepName: t('member_active_level.active_level_' + item.analysis_level)
    }
  })

  let result = []
  let dataIndex = null
  for (let i = 0; i < transformData.length; i++) {
    // 以四筆資料為一個陣列
    if (i % 4 === 0) {
      result.push([])
      dataIndex = dataIndex === null ? 0 : (dataIndex = dataIndex + 1)
    }
    result[dataIndex].push(transformData[i])
  }
  tableData.value = result
}

onMounted(() => {
  queryMemberRecentWeekLively()
})
</script>
<template>
  <div>
    <SectionTitle
      :title="$t('member_active_level.weekly_active_level')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <el-row :gutter="20" v-else>
      <el-col :span="8" v-for="(item, index) in tableData" :key="index">
        <CustomTable
          :hasPagination="false"
          :tableData="item"
          :tableColumns="tableColumns"
          class="vip-week-lively-table"
          border
          :serverSide="false"
        >
          <template #icon="scope">
            <el-tooltip effect="dark" placement="top" :hide-after="0">
              <template #content>
                <div class="font-size-14">
                  {{ scope.row.iconStepName }}
                </div>
              </template>
              <font-awesome-icon
                :class="['font-size-28', 'mt-6', 'ml-1', scope.row.icon.color]"
                :icon="['fa-regular', scope.row.icon.icon]"
              />
            </el-tooltip>
          </template>
        </CustomTable>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
:deep(.vip-week-lively-table) {
  .el-table__row .el-table__cell {
    padding: 1px 0;
  }
}
</style>
