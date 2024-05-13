<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import AddGroup from '@/components/Button/AddButton.vue'
import CdpMessage from '@/components/CdpMessage.vue'

const { t, locale } = useI18n()

const targetGroup = useTargetGroupStore()
const { tagGroupList } = storeToRefs(targetGroup)

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  },
  newTarget: {
    type: Boolean,
    default: false
  }
})

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
      minWidth: '74%'
    },
    {
      label: t('common.operation'),
      prop: 'delete',
      headerAlign: 'center',
      align: 'center',
      minWidth: '6%'
    }
  ]
})

const addTagGroup = () => {
  // 必須給一個不會重複的唯一值當作列的key，不然刪除會有問題
  const rowKey = Date.now().toString()
  if (tagGroupList.value.length < 10) {
    tagGroupList.value.push({
      custom_tags_id: rowKey,
      custom_tag_str: '',
      custom_tags_name: '',
      groupNameValid: true,
      tagGroupValid: true,
      validType: ''
    })
  }
}

const deleteGroup = (idx) => {
  tagGroupList.value.splice(idx, 1)
}

const validTable = () => {
  let isValid = true // 是否驗證成功
  tagGroupList.value.forEach((ele, idx) => {
    let isError = false
    tagGroupList.value[idx].groupNameValid = true
    tagGroupList.value[idx].validType = ''
    if (ele.custom_tags_name.trim() === '' || ele.custom_tags_name.trim().length > 10) {
      tagGroupList.value[idx].groupNameValid = false
      tagGroupList.value[idx].validType =
        ele.custom_tags_name.trim() === '' ? 'onlySpace' : 'overTen'
      isError = true
      isValid = false
    }
    tagGroupList.value[idx].tagGroupValid = true
    if (ele.custom_tag_str.trim() === '') {
      tagGroupList.value[idx].tagGroupValid = false
      isError = true
      isValid = false
    }

    // 根據語系去變化驗證文字的高度
    const cellsInSecondRow = document.querySelectorAll(`.el-table tr:nth-child(${idx + 1}) .cell`)
    const classType =
      locale.value === 'en' ? (ele.custom_tags_name.trim() === '' ? 'ch-row' : 'en-row') : 'ch-row'

    for (var i = 0; i < cellsInSecondRow.length; ++i) {
      if (isError) {
        cellsInSecondRow[i].classList.add(classType)
      } else {
        cellsInSecondRow[i].classList.remove(classType)
      }
    }
  })

  emit('vertifyPassed', isValid)
}

const emit = defineEmits(['vertifyPassed'])
defineExpose({ validTable })

const renderComplete = ref(false)

watch(
  () => tagGroupList.value,
  () => {
    if (tagGroupList.value.length !== 0) {
      nextTick(() => {
        renderComplete.value = true
      })
    }
  }
)
</script>
<template>
  <section>
    <PageTitle
      class="mb-15"
      icon="menuExport"
      :title="$t('target_group_analysis.tag_groups_setting')"
    />
    <CdpMessage messageKey="loading" v-show="renderComplete === false && !props.newTarget" />
    <CustomTable
      v-show="renderComplete === true || props.newTarget"
      :serverSide="false"
      :tableData="tagGroupList"
      :tableColumns="tableColumns"
      :hasPagination="false"
      :stripe="false"
      rowKey="custom_tags_id"
      class="customTable2 customTagListTable"
    >
      <template #tag_groups_name="scope">
        <el-input
          v-if="props.isDisabled"
          v-model="scope.row.custom_tags_name"
          class="cdp-input cdp-input-disabled"
          readonly
        >
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
        <div v-else style="width: 100%" class="text-left">
          <el-input
            v-model="scope.row.custom_tags_name"
            class="cdp-input"
            :class="{ 'is-error': !scope.row.groupNameValid }"
            :placeholder="$t('target_group_analysis.input_custom_tags_name')"
          ></el-input>
          <div
            v-if="!scope.row.groupNameValid && scope.row.validType === 'onlySpace'"
            class="cdp-text-candypink font-size-12 line-1-5"
          >
            {{ $t('target_group_analysis.blank_custom_tags_name_error_msg') }}
          </div>
          <div
            v-if="!scope.row.groupNameValid && scope.row.validType === 'overTen'"
            class="cdp-text-candypink font-size-12 line-1-5"
          >
            {{ $t('target_group_analysis.custom_tags_name_length_limit_error_msg') }}
          </div>
        </div>
      </template>
      <template #include_tags="scope">
        <SelectTag
          v-if="props.isDisabled"
          v-model="scope.row.originTags"
          class="is-disabled"
          :selectedTags="scope.row.originTags"
          :isDisabled="true"
          color="blue"
        />
        <div
          v-if="!props.isDisabled"
          style="width: 100%"
          class="text-left"
          :class="{ 'is-error': !scope.row.tagGroupValid }"
        >
          <SelectTag
            v-model="scope.row.custom_tag_str"
            :selectedTags="scope.row.custom_tag_str"
            :isDisabled="false"
            color="blue"
          />
          <span v-if="!scope.row.tagGroupValid" class="cdp-text-candypink font-size-12 ml-10">{{
            $t('target_group_analysis.blank_tags_error_msg')
          }}</span>
        </div>
      </template>
      <template #delete="scope">
        <ButtonIcon
          v-if="scope.idx !== 0"
          :disabled="props.isDisabled"
          class="detail-button"
          color="red"
          icon="trash"
          :isSvg="true"
          @click="deleteGroup(scope.idx)"
        />
      </template>
    </CustomTable>
    <AddGroup
      v-if="!props.isDisabled"
      class="mt-5"
      name="target_group_analysis.add_custom_tags"
      size="long"
      :bg="true"
      @click="addTagGroup()"
    />
  </section>
</template>
<style lang="scss" scoped>
:deep(.el-table) {
  .cell {
    overflow: visible !important;
    padding-top: 0;
  }
  .el-table__cell {
    z-index: auto !important;
  }
  td.el-table__cell {
    padding: 0px 0;
    .cell {
      padding: 0;
    }
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: flex-start !important;
      min-height: 50px;
    }
    .ch-row {
      min-height: 65px;
    }
    .en-row {
      min-height: 87px;
    }
  }
  .el-table__header {
    margin-bottom: 10px;
  }
}
.is-disabled.select-tag {
  width: 100%;
}
.select-tag {
  margin: 0 10px;
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
.detail-button {
  min-width: 40px !important;
  width: 100%;
  height: 42px;
  &:disabled {
    background-color: rgba(207, 216, 230, 0.3) !important;
    border-color: rgba(207, 216, 230, 0.3) !important;
    &:deep(.svg-icon) {
      color: rgba(64, 64, 64, 0.3) !important;
    }
  }
}
:deep(.el-input .el-input__wrapper) {
  box-shadow: none;
}
.cdp-input {
  &-disabled {
    :deep(.el-input__wrapper) {
      &:hover {
        box-shadow: none !important;
      }
    }
    :deep(.el-input__inner) {
      cursor: default !important;
    }
  }
}
.is-error {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #f56c6c !important;
    &:hover {
      box-shadow: 0 0 0 1px #f56c6c !important;
    }
  }
  .select-tag {
    border-color: #f56c6c;
  }
}
.line-1-5 {
  line-height: 1.5;
}
</style>
