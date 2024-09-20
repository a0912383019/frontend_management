<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useSystemStore } from '@/stores'
import PageTitle from '@/components/Title/PageTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import EditDetail from '@/views/CustomTagsSetting/components/EditDetail.vue'
import History from '@/views/CustomTagsSetting/components/History.vue'
import ImportCSV from '@/views/CustomTagsSetting/components/upload/ImportCSV.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { apiListCustomTagsSetting, apiUpdateTagConfig, apiDeleteCustomTags } from '@/api'
import { ElNotification, dayjs } from 'element-plus'
import { getSessionStorageEntity, errorRespond } from '@/utils/commonUtils'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const systemStore = useSystemStore()
const { storeGetSystemConfig } = systemStore

const tableData = ref([])
const apiLength = ref(10) //一頁幾筆

const tableColumns = computed(() => {
  return [
    {
      label: t('tags.tag_name'),
      prop: 'tag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '14%'
    },
    {
      label: t('data_name.total_people_num'),
      prop: 'total_people_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '9%',
      sortable: true
    },
    {
      label: t('data_name.status'),
      prop: 'status',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    },
    {
      label: t('data_name.updated_time'),
      prop: 'updated_time',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%',
      sortable: true
    },
    {
      label: t('common.enabled_and_disabled'),
      prop: 'enabled_and_disabled',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('common.manage'),
      prop: 'manage',
      headerAlign: 'center',
      align: 'center',
      minWidth: '23%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '21%'
    }
  ]
})

// 呼叫 api
const queryListCustomTagsSetting = async () => {
  try {
    const result = await apiListCustomTagsSetting({
      hall_name: activeHall.hall_code
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      tableData.value = transformCustomTagData(result.data.result)
      tableRef.value.sortByFather(sortData.value)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

const transformCustomTagData = (data) => {
  let result = []
  let tagCofig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

  data.map((item) => {
    let tempObj = {
      tag_code: item.tag_code,
      tag_name: tagCofig[item.tag_code].tag_name,
      tag_description: tagCofig[item.tag_code].tag_description,
      total_people_num: item.row_count,
      updated_time:
        item.updated_time === ''
          ? '-'
          : dayjs(item.updated_time).format(t('date.format_datetime_rule')),
      status: item.status,
      enabled_and_disabled: tagCofig[item.tag_code].tag_enabled
    }

    result.push(tempObj)
  })

  return result
}

const updateTagConfig = async (enabled, tagCode) => {
  try {
    const result = await apiUpdateTagConfig({
      hall_name: activeHall.hall_code,
      tag_code: tagCode,
      enabled: enabled
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.updated_successfully'),
        type: 'success'
      })
      reloadPage()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
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
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

const tagDetailOpen = ref(false)
const tagHistoryOpen = ref(false)

const tagDetail = reactive({
  tagCode: '',
  tagName: '',
  tagDescription: ''
})

const initTagDetail = () => {
  tagDetail.tagCode = ''
  tagDetail.tagName = ''
  tagDetail.tagDescription = ''
}

const closeDetail = () => {
  initTagDetail()
  tagDetailOpen.value = false
}

const closeHistory = () => {
  initTagDetail()
  tagHistoryOpen.value = false
}

const openDetail = (data) => {
  tagDetail.tagCode = data.tag_code.toString()
  tagDetail.tagName = data.tag_name
  tagDetail.tagDescription = data.tag_description
  tagDetailOpen.value = true
}

const openHistory = (data) => {
  tagDetail.tagCode = data.tag_code.toString()
  tagDetail.tagName = data.tag_name
  tagHistoryOpen.value = true
}

const reloadPage = async () => {
  globalStore.isLoading = true
  await storeGetSystemConfig()
  // queryListCustomTagsSetting 的transformCustomTagData 會有短暫的資料延遲
  await queryListCustomTagsSetting()
  globalStore.isLoading = false
}

const tableRef = ref(null)
const sortData = ref(null)

const storeSortData = (data) => {
  sortData.value = data
}

const importCsvBox = ref(false)

const openImportCsv = (data) => {
  tagDetail.tagCode = data.tag_code.toString()
  importCsvBox.value = true
}

const closeImportCsv = () => {
  initTagDetail()
  importCsvBox.value = false
}

const deleteBox = ref(false)

const openDeleteBox = (data) => {
  tagDetail.tagCode = data.tag_code.toString()
  tagDetail.tagName = data.tag_name
  deleteBox.value = true
}

const closeDelete = () => {
  initTagDetail()
  deleteBox.value = false
}

const confirmDelete = async () => {
  globalStore.isLoading = true
  await deleteCustomTags()
  globalStore.isLoading = false
}

const deleteCustomTags = async () => {
  try {
    const result = await apiDeleteCustomTags({
      hall_name: activeHall.hall_code,
      tag_code: tagDetail.tagCode
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.delete_successful'),
        type: 'success'
      })
      closeDelete()
      reloadPage()
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

onMounted(() => {
  queryListCustomTagsSetting()
})
</script>
<template>
  <section class="cdp-section">
    <div class="mb-20">
      <PageTitle icon="menuLabel" :title="$t('sidebar.custom_tags_setting')" />
    </div>
    <CustomTable
      ref="tableRef"
      :serverSide="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="apiLength"
      :stripe="true"
      @sort="storeSortData"
      class="customTable2 customTagSettingTable"
    >
      <template #status="scope">
        <div class="font-size-14">
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
        </div>
      </template>
      <template #enabled_and_disabled="scope">
        <SwitchWithTooltip
          v-model="scope.row.enabled_and_disabled"
          :isDisabled="false"
          @update:modelValue="updateTagConfig($event, scope.row.tag_code)"
        />
      </template>
      <template #manage="scope">
        <ButtonIcon
          class="detail-button mr-5 op-btn"
          color="blue"
          icon="union"
          :disabled="scope.row.status === 3"
          :isSvg="true"
          :name="$t('custom_tags_setting.update_list')"
          @click="openImportCsv(scope.row)"
        />
        <ButtonIcon
          class="detail-button ml-5 op-btn"
          icon="edit"
          :isSvg="true"
          :name="$t('common.edit') + $t('common.detail_short')"
          @click="openDetail(scope.row)"
        />
      </template>
      <template #operation="scope">
        <ButtonIcon
          class="detail-button mr-5 ot-btn"
          color="slateblue"
          size="small"
          icon="history"
          :isSvg="true"
          :name="$t('custom_tags_setting.history')"
          @click="openHistory(scope.row)"
        />
        <ButtonIcon
          class="detail-button ml-5 ot-btn"
          color="red"
          size="small"
          icon="trash"
          :disabled="scope.row.status === 3"
          :isSvg="true"
          :name="$t('common.delete')"
          @click="openDeleteBox(scope.row)"
        />
      </template>
    </CustomTable>
    <ImportCSV
      v-model="importCsvBox"
      :tagCode="tagDetail.tagCode"
      @closeImportCsv="closeImportCsv"
      @update:success="reloadPage"
    />
    <EditDetail
      v-model="tagDetailOpen"
      :tagCode="tagDetail.tagCode"
      :tagName="tagDetail.tagName"
      :tagDescription="tagDetail.tagDescription"
      @closeDetail="closeDetail"
      @updateSuccess="reloadPage"
    />
    <History
      v-model="tagHistoryOpen"
      :tagCode="tagDetail.tagCode"
      :tagName="tagDetail.tagName"
      @closeHistory="closeHistory"
    />
    <ConfirmBox
      color="red"
      v-model="deleteBox"
      :title="$t('modal.delete')"
      class="top15per"
      @cancelExecute="closeDelete"
      @confirmExecute="confirmDelete"
    >
      <template v-slot:text-body>
        {{ $t('modal.are_you_sure_to_delete') + '「' + tagDetail.tagName + '」?' }}
      </template>
    </ConfirmBox>
  </section>
</template>
<style lang="scss" scoped>
:deep(.op-btn.button__medium) {
  min-width: 106px !important;
}
:deep(.ot-btn.button__small) {
  min-height: 36px !important;
  font-size: 13px;
}
:deep(.customTagSettingTable) {
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
