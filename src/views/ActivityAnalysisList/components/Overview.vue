<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryListActivity, apiDeleteActivity } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import ActivityDetail from '@/views/ActivityAnalysisList/components/activityDetail/ActivityDetail.vue'
import { ElNotification } from 'element-plus'
import { sortTableDate } from '@/utils/commonUtils.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()

const apiSuccess = ref(false)
const messageKey = ref('loading')

const tableColumns = computed(() => {
  return [
    {
      label: t('activity_analysis.activity_name'),
      prop: 'activityName',
      headerAlign: 'center',
      align: 'center',
      minWidth: '40%'
    },
    {
      label: t('custom_tags_setting.operator'),
      prop: 'operator',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('data_name.created_time'),
      prop: 'createdTime',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%',
      sortable: 'custom'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    }
  ]
})

const tableData = ref([])

// 取得資料
const queryListActivity = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []

  try {
    const result = await apiQueryListActivity({
      hall_name: activeHall.hall_code,
      activity_name: activityStore.searchActivity,
      search_date: '2024-01-01 ~ 2024-08-02'
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        tableData.value = transformActivityList(result.data.result)
        upadteCurrentSort({ prop: 'createdTime', order: 'descending' })
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformActivityList = (data) => {
  let activityList = []
  data.forEach((ele) => {
    activityList.push({
      activityName: ele.activity_name,
      operator: ele.operator_name,
      createdTime: dayjs(ele.created_time).format(t('date.format_datetime_rule')),
      activityId: ele.activity_id,
      canOperate: ele.can_operate
    })
  })
  return activityList
}

const showDetail = ref(false)
const detailActivityId = ref(null)
const openActivityDetail = (activityId) => {
  showDetail.value = true
  detailActivityId.value = activityId
}

const closeDetail = () => {
  showDetail.value = false
  detailActivityId.value = null
}

const deleteBox = ref(false) // 刪除彈窗
const deleteActivityName = ref('')
const deleteId = ref('') // 要刪除的id

const openDeleteBox = (activityName, activityId) => {
  deleteActivityName.value = activityName
  deleteId.value = activityId
  deleteBox.value = true
}

const cancelDelete = () => {
  deleteBox.value = false
}

const confirmDelete = () => {
  queryDeleteActivity(deleteId.value)
  deleteBox.value = false
}

// 刪除活動
const queryDeleteActivity = async (activityId) => {
  try {
    const result = await apiDeleteActivity({
      hall_name: activeHall.hall_code,
      delete_activity_id: activityId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.delete_successful'),
        type: 'success'
      })
      queryListActivity()
    } else {
      ElNotification({
        title: t('msg.delete_failed'),
        type: 'error'
      })
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
        title: t('msg.delete_failed'),
        type: 'error'
      })
    }
  }
}

// 自定義排序執行的內容
const upadteCurrentSort = ({ prop, order }) => {
  sortTableDate({ prop, order, tableData: tableData.value })
}

watch(
  () => activityStore.islistFiltered,
  () => {
    queryListActivity()
  }
)

watch(
  () => activityStore.activityAddChange,
  () => {
    queryListActivity()
  }
)

onMounted(() => {
  queryListActivity()
})
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle
      class="mb-16"
      :title="$t('activity_analysis.activity_list_overview')"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      v-else
      :serverSide="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="10"
      :stripe="true"
      @sort="upadteCurrentSort"
      class="customTable2 customActivityListTable"
    >
      <template #operation="scope">
        <div>
          <ButtonIcon
            class="detail-button mr-5"
            icon="magnifier"
            :isSvg="true"
            :name="$t('common.detail_short')"
            @click="openActivityDetail(scope.row.activityId)"
          />
          <ButtonIcon
            :disabled="!scope.row.canOperate"
            class="detail-button ml-5"
            color="red"
            icon="trash"
            :isSvg="true"
            :name="$t('common.delete')"
            @click="openDeleteBox(scope.row.activityName, scope.row.activityId)"
          />
        </div>
      </template>
    </CustomTable>
    <ConfirmBox
      color="red"
      v-model="deleteBox"
      class="top15per"
      :title="$t('modal.delete')"
      @cancelExecute="cancelDelete"
      @confirmExecute="confirmDelete"
    >
      <template v-slot:text-body>
        {{ $t('modal.are_you_sure_to_delete') + '「' + deleteActivityName + '」?' }}
      </template>
    </ConfirmBox>
    <ActivityDetail v-model="showDetail" @closeDialog="closeDetail" :activityId="detailActivityId" />
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.customActivityListTable {
  button.detail-button {
    min-width: 80px;
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 62px;
    }
  }
}
</style>
