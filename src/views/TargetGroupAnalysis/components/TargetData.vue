<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { apiQueryTargetGroupsWithId } from '@/api'
import { dayjs } from 'element-plus'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TagGroupSetting.vue'
import ConfirmBox from '@/components/Button/ConfirmBox.vue'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { targetNameRule } = storeToRefs(targetGroup)

const props = defineProps({
  targetId: {
    type: Number
  }
})

const apiSuccess = ref(false)
const messageKey = ref('loading')

const validateForm = reactive({
  newTargetName: ''
})
const apiTargetData = reactive({}) // 存放api資料

const queryTargetGroupsId = async () => {
  try {
    const result = await apiQueryTargetGroupsWithId({
      hall_name: activeHall.hall_code,
      target_id: props.targetId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        transformTargetDetails(result.data.result)
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

// 是否公開
const isOpen = ref(false)

// 預設都是disabled
const edit = ref(false)

let copiedObject

const transformTargetDetails = (data) => {
  copiedObject = JSON.parse(JSON.stringify(data))

  apiTargetData.targetName = data.target_group_name
  apiTargetData.memberName = data.member_name
  apiTargetData.createdTime = dayjs(data.created_time).format(t('date.format_datetime_rule'))
  apiTargetData.updaterName = data.updater_name
  apiTargetData.updatedTime = dayjs(data.updated_time).format(t('date.format_datetime_rule'))

  validateForm.newTargetName = data.target_group_name

  targetGroup.tagGroupList = generateTagGroupData(data.custom_tags_data)

  isOpen.value = data.is_open
}

const generateTagGroupData = (data) => {
  let result = []
  data.forEach((ele) => {
    let newObj = {
      ...ele,
      originTags: ele.custom_tag_str,
      groupNameValid: true,
      tagGroupValid: true
    }
    result.push(newObj)
  })
  return result
}

const cancelEditBox = ref(false)
const formRef = ref(null)

const handleTagIsEdit = () => {
  edit.value = true
}

// 取消編輯
const handleEditCancel = () => {
  cancelEditBox.value = true
}

// 取消編輯->取消
const cancelExecute = () => {
  cancelEditBox.value = false
}

// 取消編輯->確認
const confirmExecute = () => {
  edit.value = false
  cancelEditBox.value = false
  validateForm.newTargetName = apiTargetData.targetName
  isOpen.value = copiedObject.is_open

  targetGroup.tagGroupList = generateTagGroupData(copiedObject.custom_tags_data)
  const cellsInSecondRow = document.querySelectorAll(`.el-table tr .cell`)
  const classType = locale.value === 'en' ? 'en-row' : 'ch-row'
  for (var i = 0; i < cellsInSecondRow.length; ++i) {
    cellsInSecondRow[i].classList.remove(classType)
  }
}

const confirmEditBox = ref(false)

const cancelSaved = () => {
  confirmEditBox.value = false
}

const confirmSaved = () => {
  confirmEditBox.value = false
}

const tagGroups = ref(null)

const handleEditConfirm = () => {
  formRef.value.validate((valid) => {
    if (valid && tagsGroupsValid.value) {
      confirmEditBox.value = true
    } else {
      return false
    }
  })
  tagGroups.value.validTable()
}

const tagsGroupsValid = ref(false)

const vertifyPassed = (valid) => {
  tagsGroupsValid.value = valid
}

onMounted(() => {
  queryTargetGroupsId()
})
</script>
<template>
  <section>
    <div class="flex mb-20 justify-between">
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('target_group_analysis.target_group_name') }}</div>
        <div>
          <el-input
            v-if="!edit"
            v-model="apiTargetData.targetName"
            class="cdp-input cdp-input-disabled"
            readonly
          >
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
          <el-form v-else ref="formRef" :model="validateForm">
            <el-form-item prop="newTargetName" :rules="targetNameRule">
              <el-input
                v-model="validateForm.newTargetName"
                class="cdp-input is-open"
                :placeholder="$t('target_group_analysis.input_target_group_name')"
                :validate-event="false"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.uploader') }}</div>
        <el-input v-model="apiTargetData.memberName" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
        <el-input v-model="apiTargetData.createdTime" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.updater') }}</div>
        <el-input v-model="apiTargetData.updaterName" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.updated_time') }}</div>
        <el-input v-model="apiTargetData.updatedTime" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
    </div>
    <section class="cdp-section-in mb-20">
      <TagGroupSetting ref="tagGroups" :isDisabled="!edit" @vertifyPassed="vertifyPassed" />
    </section>
    <div class="mb-20 flex justify-end">
      <span v-if="!edit" class="mr-10 pt-5 font-size-13 cdp-text-blue"
        >*{{ $t('data_name.click_to_edit') }}</span
      >
      <SwitchWithTooltip
        name="target_group_analysis.is_open"
        content="target_group_analysis.is_open_reminder"
        v-model="isOpen"
        :isDisabled="!edit"
      />
      <div v-if="!edit">
        <CdpButton
          class="custom-bg-dark__blue ml-20"
          :name="$t('common.edit')"
          size="sm-130"
          @click="handleTagIsEdit()"
        />
      </div>
      <div v-else>
        <CdpButton
          class="custom-bg-white ml-15"
          :name="$t('common.cancel_edit')"
          size="sm-130"
          @click="handleEditCancel()"
        />
        <CdpButton
          class="custom-bg-dark__blue ml-10"
          :name="$t('common.confirm_update')"
          size="sm-130"
          @click="handleEditConfirm()"
        />
      </div>
    </div>
    <ConfirmBox
      color="blue"
      v-model="cancelEditBox"
      class="top15per"
      @cancelExecute="cancelExecute"
      @confirmExecute="confirmExecute"
    >
    </ConfirmBox>
    <ConfirmBox
      color="blue"
      v-model="confirmEditBox"
      :width="350"
      title="modal.confirm_correct_desc"
      class="top15per"
      @cancelExecute="cancelSaved"
      @confirmExecute="confirmSaved"
    >
      <template v-slot:text-body>
        <table class="table-total">
          <tr>
            <td width="35%" class="text-right">
              {{ $t('target_group_analysis.target_group_name') }}
            </td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">{{ validateForm.newTargetName }}</td>
          </tr>
          <tr>
            <td width="35%" class="text-right">{{ $t('target_group_analysis.is_open') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">
              {{
                isOpen
                  ? $t('target_group_analysis.is_open_true')
                  : $t('target_group_analysis.is_open_false')
              }}
            </td>
          </tr>
          <tr class="align-baseline">
            <td width="35%" class="text-right">{{ $t('target_group_analysis.custom_tags') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">
              <div v-for="(item, idx) in targetGroup.tagGroupList" :key="idx">
                {{ item.custom_tags_name }}
              </div>
            </td>
          </tr>
        </table>
      </template>
    </ConfirmBox>
  </section>
</template>
<style lang="scss" scoped>
// 5等分，設定19％是為了可以產生間距。因為首尾無間距，所以需要客製
.el-col-5 {
  width: 19%;
  flex: 0 0 19%;
}
.cdp-input {
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0 !important;
  }
}
.is-open {
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #4f84cf !important;
  }
}
:deep(.el-form) {
  .el-form-item {
    margin-bottom: 0;
  }
  .is-error {
    margin-bottom: 22px;
    .is-open {
      &:hover {
        box-shadow: none;
      }
    }
    .cdp-input {
      border: none;
      .el-input__wrapper:hover {
        box-shadow: 0 0 0 1px #f56c6c !important;
      }
    }
  }
}
.table-total {
  width: 100%;
  td {
    font-size: 14px;
    color: #404040;
    font-weight: normal;
  }
  .align-baseline {
    vertical-align: baseline;
  }
}
:deep(.el-form-item__error) {
  line-height: 1.5;
  padding-top: 0px;
}
</style>
