<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiDeleteUserExportList } from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification } from 'element-plus'
import ConfirmBox from '@/components/ConfirmBox.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  apiTagGroupData: {
    type: Array,
    default: []
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const maxLength = ref(10)
const newTagGroupData = ref(...props.apiTagGroupData)
const tableColumns = computed(() => {
  return [
    {
      label: t('target_group_analysis.tag_groups_name'),
      prop: 'tag_groups_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    },
    {
      label: t('common.include_tags'),
      prop: 'include_tags',
      headerAlign: 'center',
      align: 'center',
      minWidth: '70%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const tableData = computed(() => {
  let result = []
  props.apiTagGroupData.forEach((ele) => {
    let newpp = {
      ...ele,
      don: ''
    }
    result.push(newpp)
  })
  return result
})
</script>
<template>
  <section>
    <PageTitle
      class="mb-15"
      icon="menuExport"
      :title="$t('target_group_analysis.tag_groups_setting')"
    />
    <CustomTable
      :serverSide="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="maxLength"
      :hasPagination="false"
      :stripe="false"
      class="customTable2 customTagListTable"
    >
      <template #tag_groups_name="scope">
        <el-input
          v-if="!isDisabled"
          v-model="scope.row.custom_tags_name"
          class="cdp-input cdp-input-disabled"
          readonly
        >
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
        <el-input v-else v-model="scope.row.custom_tags_name" class="cdp-input"></el-input>
      </template>
      <template #include_tags="scope">
        <SelectTag v-model="scope.row.don" :selectedTags="scope.row.custom_tag_str" />
      </template>
      <!-- <template #status="scope"> </template> -->
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
:deep(.el-table td.el-table__cell) {
  padding: 0px 0;
  .cell {
    padding: 0;
  }
}
:deep(.el-table .el-table__header) {
  margin-bottom: 5px;
}
:deep(.el-table tr.el-table__row) {
  .cell {
    min-height: 50px;
  }
}
.select-tag {
    width: 100%;
    margin: 0 10px;
}
:deep(.el-table .cell) {
  overflow: visible !important;
}
:deep(.el-table .el-table__cell) {
  z-index: auto !important;
}
:deep(.el-scrollbar__wrap) {
  overflow: visible !important;
}
:deep(.el-table--fit) {
    overflow: visible !important;
}
:deep(.el-table__body-wrapper) {
    overflow: visible !important;
    .el-scrollbar {
        overflow: visible !important;
    }
}
// :deep(.cdp-dialog.el-dialog) {
//     overflow: visible !important;
// }
// :deep(.drop) {
//     z-index: 50;
// }
// .table-total {
//   width: 100%;
//   td {
//     font-size: 14px;
//     color: #404040;
//     font-weight: normal;
//   }
// }
</style>
