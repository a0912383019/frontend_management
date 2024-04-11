<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryUserExportList } from '@/api'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { findRootHall } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import DeleteBox from '@/views/ExportReportList/components/DeleteBox.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const tableData = ref([])
const apiLength = ref(10) //一頁幾筆

const tableColumns = computed(() => {
  return [
    {
      label: t('user_export_report.source_page'),
      prop: 'source_page',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    },
    {
      label: t('user_export_report.export_date'),
      prop: 'export_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '21%',
      sortable: true
    },
    {
      label: t('common.detail'),
      prop: 'detail',
      headerAlign: 'center',
      align: 'center',
      minWidth: '19%'
    },
    {
      label: t('data_name.status'),
      prop: 'status',
      headerAlign: 'center',
      align: 'left',
      minWidth: '15%',
      sortable: true
    },
    {
      label: t('user_export_report.download_link'),
      prop: 'download_link',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    }
  ]
})

// 取得資料
const queryUserExportList = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []
  allLinkList.value = []
  try {
    const result = await apiQueryUserExportList({
      hall_name: activeHall.hall_code
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = transformExportList(result.data.result)
      upadteCurrentSort({ prop: 'export_date', order: 'descending' })
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
      }
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

let beforeSort

// 不包含處理中
const allLinkList = ref([])

// 轉換資料
const transformExportList = (data) => {
  let result = []

  data.map((item) => {
    let tempObj = {
      ...item,
      source_page: getSourceName(item.type),
      status: item.is_expired ? 'expired' : item.export_progress ? 'completed' : 'processing',
      is_disabled: !item.export_progress,
      export_date: dayjs(item.created_time).format(t('date.format_datetime_rule'))
    }

    console.log(JSON.parse(item.search_content))
    if (item.export_download_link) {
      allLinkList.value.push(item.export_download_link)
    }

    result.push(tempObj)
  })

  //複製原始data
  beforeSort = result.slice(0)

  return result
}

const getSourceName = (type) => {
  let sourceName = ''
  switch (type) {
    case 1:
      sourceName =
        'sidebar.' + findRootHall(activeHall.hall_code).toLowerCase() + '_manage_analysis'
      break
    case 2:
      sourceName =
        'sidebar.' + findRootHall(activeHall.hall_code).toLowerCase() + '_customer_tag_list'
      break
    case 3:
    case 4:
    case 5:
      sourceName =
        'sidebar.' + findRootHall(activeHall.hall_code).toLowerCase() + '_vip_commercial_analysis'
      break
    case 6:
    case 7:
      sourceName =
        'sidebar.' + findRootHall(activeHall.hall_code).toLowerCase() + '_offer_analysis_list'
      break
    case 8:
    case 9:
      sourceName = 'sidebar.activity_analysis_list'
      break
  }

  return sourceName
}

// 日期或狀態排序
const upadteCurrentSort = ({ prop, order }) => {
  if (order === 'descending') {
    tableData.value.sort((a, b) => {
      let valueA = a[prop]
      let valueB = b[prop]
      if (prop === 'export_date') {
        valueA = new Date(a[prop]).getTime()
        valueB = new Date(b[prop]).getTime()
      }
      return valueB - valueA
    })
  } else if (order === 'ascending') {
    tableData.value.sort((a, b) => {
      let valueA = a[prop]
      let valueB = b[prop]
      if (prop === 'export_date') {
        valueA = new Date(a[prop]).getTime()
        valueB = new Date(b[prop]).getTime()
      }
      return valueA - valueB
    })
  } else {
    //複製回去，要用複製的不然會改變到beforeSort的值
    tableData.value = beforeSort.slice(0)
  }
}

// 打開下載鏈結
const downloadReport = (link) => {
  window.open(link, '_blank')
}

// 顯示刪除彈框
const confirmBoxVisible = ref(false)
const confirmBoxTopVisible = ref(false)

// 刪除彈框資訊
const confirmInfo = reactive({
  sourcePage: '',
  exportDate: ''
})

const deleteLinkList = ref([])

// 要刪除的資訊整理
const confirmDelete = (data) => {
  confirmInfo.sourcePage = getSourceName(data.type)
  confirmInfo.exportDate = dayjs(data.created_time).format(t('date.format_datetime_rule'))
  deleteLinkList.value = []
  deleteLinkList.value.push(data.export_download_link)
  confirmBoxVisible.value = true
}

const confirmDeleteAll = () => {
  deleteLinkList.value = []
  deleteLinkList.value = allLinkList.value
  confirmBoxTopVisible.value = true
}

const deleteSuccess = () => {
  queryUserExportList()
}

const deleteBoxClose = () => {
  confirmBoxVisible.value = false
  confirmBoxTopVisible.value = false
}

const key = ref(systemConfigIsOk.value)
watch(
  () => systemConfigIsOk.value,
  () => {
    key.value = Math.floor(Math.random() * 100)
  }
)

onMounted(() => {
  queryUserExportList()
})
</script>
<template>
  <section class="cdp-section mb-0">
    <div class="flex items-center justify-between mb-20" ref="refContent">
      <PageTitle icon="menuExport" :title="$t('sidebar.user_export_report')" />
      <a v-if="allLinkList.length !== 0" class="cdp-pink-link-click" @click="confirmDeleteAll">{{
        $t('user_export_report.delete_all')
      }}</a>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess === true">
      <CustomTable
        :defaultSort="{ prop: 'export_date', order: 'descending' }"
        :serverSide="false"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="apiLength"
        :stripe="true"
        class="customTable2 customTagListTable"
        @sort="upadteCurrentSort"
      >
        <template #source_page="scope">
          <div class="font-size-14">
            <span>{{ $t(scope.row.source_page) }}</span>
          </div>
        </template>
        <template #detail="scope">
          <div>
            <ButtonIcon
              class="detail-button"
              icon="magnifier"
              :isSvg="true"
              :name="$t('user_export_report.export_condition')"
              @click="opendetail(scope.row)"
            />
          </div>
        </template>
        <template #status="scope">
          <div class="font-size-14">
            <span class="cdp-text-celticblue" v-show="scope.row.status === 'processing'">{{
              $t('common.processing')
            }}</span>
            <span class="cdp-text-harvestgold" v-show="scope.row.status === 'completed'">{{
              $t('common.completed')
            }}</span>
            <span class="cdp-text-candypink" v-show="scope.row.status === 'expired'">{{
              $t('common.expired')
            }}</span>
          </div>
        </template>
        <template #download_link="scope">
          <div v-if="scope.row.status === 'processing'">
            <LoadingBox color="blue" size="sm" />
          </div>
          <div v-else-if="scope.row.status === 'completed'">
            <ButtonIcon
              class="detail-button"
              color="blue"
              icon="download"
              :isSvg="true"
              :name="$t('user_export_report.download')"
              @click="downloadReport(scope.row.export_download_link)"
            />
          </div>
          <div v-else>---</div>
        </template>
        <template #operation="scope">
          <div>
            <ButtonIcon
              :disabled="scope.row.is_disabled"
              class="detail-button"
              color="red"
              icon="trash"
              :isSvg="true"
              :name="$t('common.delete')"
              @click="confirmDelete(scope.row)"
            />
          </div>
        </template>
      </CustomTable>
    </div>
    <DeleteBox
      :confirmBoxVisible="confirmBoxVisible"
      :confirmBoxTopVisible="confirmBoxTopVisible"
      :confirmInfo="confirmInfo"
      :deleteLinkList="deleteLinkList"
      @deleteBoxClose="deleteBoxClose"
      @deleteSuccess="deleteSuccess"
    ></DeleteBox>
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">

.customTagListTable {
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
