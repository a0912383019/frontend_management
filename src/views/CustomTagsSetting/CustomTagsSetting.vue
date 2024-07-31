<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useSystemStore } from '@/stores'
import PageTitle from '@/components/Title/PageTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import EditDetail from '@/views/CustomTagsSetting/components/EditDetail.vue'
import { apiListCustomTagsSetting, apiUpdateTagConfig } from '@/api'
import { ElNotification, dayjs } from 'element-plus'
import { getSessionStorageEntity } from '@/utils/commonUtils'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const systemStore = useSystemStore()
const { storeGetSystemConfig } = systemStore

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

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
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiListCustomTagsSetting({
      hall_name: activeHall.hall_code
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = transformCustomTagData(result.data.result)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
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

  globalStore.isLoading = false

  return result
}

const tagEnableClick = (event, tagCode) => {
  updateTagConfig(tagCode, event)
}

const updateTagConfig = async (tagCode, enabled) => {
  try {
    const result = await apiUpdateTagConfig({
      hall_name: activeHall.hall_code,
      tag_code: tagCode,
      tag_enabled: enabled
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
const tagDetail = reactive({
  tagCode: '',
  tagName: '',
  tagDescription: ''
})

const closeDetail = () => {
  tagDetailOpen.value = false
}

const openDetail = (data) => {
  tagDetail.tagCode = data.tag_code.toString()
  tagDetail.tagName = data.tag_name
  tagDetail.tagDescription = data.tag_description
  tagDetailOpen.value = true
}

const reloadPage = async () => {
  await storeGetSystemConfig()
  // queryListCustomTagsSetting 的transformCustomTagData 會有短暫的資料延遲
  globalStore.isLoading = true
  queryListCustomTagsSetting()
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
      :serverSide="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="apiLength"
      :stripe="true"
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
          @update:modelValue="tagEnableClick($event, scope.row.tag_code)"
        />
      </template>
      <template #manage="scope">
        <ButtonIcon
          class="detail-button mr-5 op-btn"
          color="blue"
          icon="union"
          :isSvg="true"
          :name="$t('custom_tags_setting.update_list')"
          @click="openUpdateBox(scope.row)"
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
          class="detail-button mr-5 ot-btn"
          color="red"
          size="small"
          icon="trash"
          :isSvg="true"
          :name="$t('common.delete')"
          @click="openDeleteBox(scope.row)"
        />
      </template>
    </CustomTable>
    <EditDetail
      v-model="tagDetailOpen"
      :tagCode="tagDetail.tagCode"
      :tagName="tagDetail.tagName"
      :tagDescription="tagDetail.tagDescription"
      @closeDetail="closeDetail"
      @updateSuccess="reloadPage"
    />
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
