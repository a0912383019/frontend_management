<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryTargetGroups } from '@/api'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { findRootHall, getSessionStorageEntity } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import DeleteBox from '@/views/ExportReportList/components/DeleteBox.vue'
import AddTarget from '@/components/button/AddButton.vue'
import Filter from '@/views/TargetGroupAnalysis/components/Filter.vue'
import TargetGroupDetail from '@/views/TargetGroupAnalysis/components/TargetGroupDetail.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()

const apiSuccess = ref(false)
const messageKey = ref('loading')

const tableColumns = computed(() => {
  return [
    {
      label: t('target_group_analysis.target_group_name'),
      prop: 'target_group_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '30%'
    },
    {
      label: t('data_name.uploader'),
      prop: 'member_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    },
    {
      label: t('data_name.created_time'),
      prop: 'createTime',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%',
      sortable: true
    },
    {
      label: t('target_group_analysis.is_open_or_not'),
      prop: 'is_open',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
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
const searchTargetGroupName = ref('')

// 取得資料
const queryTargetGroups = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []

  try {
    const result = await apiQueryTargetGroups({
      hall_name: activeHall.hall_code,
      target_group_name: searchTargetGroupName.value
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        tableData.value = transformTargetGroups(result.data.result)
        // upadteCurrentSort({ prop: 'export_date', order: 'descending' })
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

const transformTargetGroups = (data) => {
  let result = []

  data.map((item) => {
    let tempObj = {
      ...item,
      createTime: dayjs(item.create_time).format(t('date.format_datetime_rule'))
    }

    result.push(tempObj)
  })

  return result
}

const dialogVisible = ref(false)
const targetId = ref(0)

const openTargetDetail = (data) => {
  targetId.value = data
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  targetGroup.tagGroupList = []
}

const searchWithTargetName = (targetName) => {
  searchTargetGroupName.value = targetName
  queryTargetGroups()
}

onMounted(() => {
  queryTargetGroups()
})
</script>
<template>
  <section class="cdp-section mb-0">
    <div class="flex items-center justify-between mb-20" ref="refContent">
      <PageTitle icon="menuExport" :title="$t('sidebar.target_group_analysis_list')" />
      <div class="flex">
        <AddTarget class="mr-10" name="target_group_analysis.add_target_group" />
        <Filter @searchWithTargetName="searchWithTargetName" />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div class="cdp-section-in" v-else>
      <SectionTitle
        class="mb-16"
        :title="$t('target_group_analysis.analysis_overview')"
      ></SectionTitle>
      <CustomTable
        :defaultSort="{ prop: 'created_time', order: 'descending' }"
        :serverSide="false"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="10"
        :stripe="true"
        class="customTable2 customTagListTable"
      >
        <template #is_open="scope">
          <span class="cdp-text-shamrockgreen" v-if="scope.row.is_open === true">{{
            $t('target_group_analysis.is_open_true')
          }}</span>
          <span class="cdp-text-candypink" v-else>{{
            $t('target_group_analysis.is_open_false')
          }}</span>
        </template>
        <template #operation="scope">
          <div>
            <ButtonIcon
              :disabled="!scope.row.can_operate"
              class="detail-button mr-5"
              icon="magnifier"
              :isSvg="true"
              :name="$t('common.detail_short')"
              @click="openTargetDetail(scope.row.target_group_id)"
            />
            <ButtonIcon
              :disabled="!scope.row.can_operate"
              class="detail-button ml-5"
              color="red"
              icon="trash"
              :isSvg="true"
              :name="$t('common.delete')"
              @click="bbb(scope.row)"
            />
          </div>
        </template>
      </CustomTable>
      <TargetGroupDetail v-model="dialogVisible" :targetId="targetId" @closeDialog="closeDialog" />
    </div>
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
