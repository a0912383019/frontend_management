<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiCustomTagsHistory, apiDownloadHistoryFile } from '@/api'
import { useGlobalStore } from '@/stores'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tagCode: {
    type: String,
    required: true
  },
  tagName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['closeHistory'])

const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(10) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數
const tableData = ref([])

const tableColumns = computed(() => {
  return [
    {
      label: t('custom_tags_setting.file'),
      prop: 'file',
      headerAlign: 'center',
      align: 'center',
      minWidth: '21%'
    },
    {
      label: t('data_name.updated_time'),
      prop: 'updated_time',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },

    {
      label: t('custom_tags_setting.operator'),
      prop: 'operator',
      headerAlign: 'center',
      align: 'center',
      colClass: 'break-work',
      minWidth: '20%'
    },
    {
      label: t('custom_tags_setting.add_member_num'),
      prop: 'add_member_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('custom_tags_setting.delete_member_num'),
      prop: 'delete_member_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.status'),
      prop: 'status',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    }
  ]
})

const refCustomTable = ref(null) //table ref

const apiSuccess = ref(false)
const messageKey = ref('loading')

// 呼叫 api
const queryCustomTagsHistory = async (searchType = '') => {
  tableData.value = []
  if (searchType !== 'page') {
    apiSuccess.value = false
    messageKey.value = 'loading'
  } else {
    refCustomTable.value.showTableLoading = true
  }
  try {
    const result = await apiCustomTagsHistory({
      hall_name: activeHall.hall_code,
      tag_code: props.tagCode,
      length: apiLength.value,
      start: apiStart.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (searchType !== 'page') {
        apiSuccess.value = true
      } else {
        refCustomTable.value.showTableLoading = false
      }
      apiSuccess.value = true
      tableData.value = transformHistoryData(result.data.result)
      apiRecordsTotal.value = result.data.result.records_total
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiRecordsTotal.value = 0
        messageKey.value = 'noResult'
      } else {
        apiRecordsTotal.value = 0
        messageKey.value = 'queryFailed'
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

const transformHistoryData = (data) => {
  let result = []

  data.map((item) => {
    let tempObj = {
      file: item.file_name,
      updated_time:
        item.updated_time === ''
          ? '-'
          : dayjs(item.updated_time).format(t('date.format_datetime_rule')),
      operator: item.operator_name,
      add_member_num: Number.isInteger(item.add_count) ? item.add_count : '-',
      delete_member_num: Number.isInteger(item.remove_count) ? item.remove_count : '-',
      status: item.status
    }

    result.push(tempObj)
  })

  return result
}

const updateCurrentPage = (data) => {
  apiDraw.value = data
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value
  queryCustomTagsHistory('page')
}

const handleDialogClosed = () => {
  emit('closeHistory')
}

const handleDialogOpen = () => {
  queryCustomTagsHistory()
}

const downloadCsv = (file) => {
  queryDownloadHistoryFile(file)
}

const queryDownloadHistoryFile = async (file) => {
  try {
    const result = await apiDownloadHistoryFile({
      hall_name: activeHall.hall_code,
      tag_code: props.tagCode,
      file_name: file
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      downloadFile(result.data.download_url)
    } else {
      ElNotification({
        title: t('msg.download_failed'),
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
        title: t('msg.download_failed'),
        type: 'error'
      })
    }
  }
}

// 打開連結直接下載，不會彈出新視窗
const downloadFile = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog dialog-mt-50"
    :append-to-body="true"
    width="1150"
    :destroy-on-close="true"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('custom_tags_setting.header_history') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <div class="mb-10 flex font-size-15">
          <div class="cdp-text-spacecadet mb-3 mr-5">{{ $t('tags.tag_name') + '：' }}</div>
          <div class="cdp-text-blue mb-3">{{ props.tagName }}</div>
        </div>
        <div>
          <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
          <CustomTable
            v-show="apiSuccess === true"
            :serverSide="true"
            :tableData="tableData"
            :tableColumns="tableColumns"
            :pageSize="apiLength"
            :stripe="true"
            :tableTotal="apiRecordsTotal"
            ref="refCustomTable"
            @update:currentPage="updateCurrentPage"
            class="customTable2 customTagSettingTable"
          >
            <template #file="scope">
              <a class="cdp-link-click" @click="downloadCsv(scope.row.file)">{{
                scope.row.file
              }}</a>
            </template>
            <template #status="scope">
              <span class="cdp-text-shamrockgreen" v-show="scope.row.status === 0"
                >{{ $t('common.pending') }}
              </span>
              <span class="cdp-text-harvestgold" v-show="scope.row.status === 1"
                >{{ $t('common.completed') }}
              </span>
              <span class="cdp-text-candypink" v-show="scope.row.status === 2"
                >{{ $t('common.failed') }}
              </span>
              <span class="cdp-text-celticblue" v-show="scope.row.status === 3"
                >{{ $t('common.processing') }}
              </span>
            </template>
          </CustomTable>
        </div>
      </section>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px #e6eaf2 solid;
  }
  &__header {
    color: #fff;
  }
}
:deep(.customTagSettingTable) {
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
    }
  }
}
.dialog-mt-50 {
  margin-top: 50px !important;
}
:deep(.break-work) {
  .cell {
    word-break: break-all;
  }
}
</style>
