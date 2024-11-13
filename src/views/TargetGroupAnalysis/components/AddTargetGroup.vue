<script setup>
import { ref, reactive } from 'vue'
import { useTargetGroupStore, useGlobalStore } from '@/stores'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TargetData/TagGroupSetting.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { apiAddTargetGroups } from '@/api'
import { storeToRefs } from 'pinia'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { tagGroupList } = storeToRefs(targetGroup)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['closeDialog', 'addSuccess'])

const tagGroups = ref(null)
const isOpen = ref(false)

const formRef = ref(null)
const validateForm = reactive({
  newTargetName: ''
})

// 關閉 dialog
const handleDialogClosed = () => {
  validateForm.newTargetName = ''
  tagGroupList.value = []
  emit('closeDialog')
}

// 新增族群
const addTargetGroups = async () => {
  try {
    const result = await apiAddTargetGroups({
      hall_name: activeHall.hall_code,
      custom_tags: customTags.value,
      is_open: isOpen.value,
      target_group_name: validateForm.newTargetName
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.add_successful'),
        type: 'success'
      })
      confirmSaveBox.value = false
      handleDialogClosed()
      emit('addSuccess')
    } else {
      ElNotification({
        title: t('msg.add_failed'),
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
        title: t('msg.add_failed'),
        type: 'error'
      })
    }
  }
}

const tagsGroupsValid = ref(false)

const handleTagGroupAdd = () => {
  tagGroups.value.validTable()
  formRef.value.validate((valid) => {
    if (valid && tagsGroupsValid.value) {
      confirmSaveBox.value = true
    } else {
      return false
    }
  })
}

const vertifyPassed = (valid) => {
  tagsGroupsValid.value = valid
}

const confirmSaveBox = ref(false)

const cancelSaved = () => {
  confirmSaveBox.value = false
}

const confirmSaved = () => {
  transformCustomTags()
  addTargetGroups()
}

const customTags = ref([])

const transformCustomTags = () => {
  customTags.value = []
  tagGroupList.value.forEach((ele, idx) => {
    let newGroup = {}
    newGroup.tags_name = ele.custom_tags_name
    newGroup.tags_str = ele.custom_tag_str
    newGroup.sort = idx + 1
    customTags.value.push(newGroup)
  })
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog overflow-visible"
    :append-to-body="true"
    width="1280"
    :destroy-on-close="true"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('target_group_analysis.add_target_group') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <div class="mb-20">
          <div class="cdp-text-blue mb-3">{{ $t('target_group_analysis.target_group_name') }}</div>
          <el-form ref="formRef" :model="validateForm" @submit.prevent>
            <el-form-item prop="newTargetName" :rules="targetGroup.targetNameRule">
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
        <section class="cdp-section-in">
          <TagGroupSetting
            ref="tagGroups"
            :isDisabled="false"
            :newTarget="true"
            @vertifyPassed="vertifyPassed"
          />
        </section>
        <div class="flex justify-end">
          <SwitchWithTooltip
            :activeText="$t('target_group_analysis.is_open')"
            :tooltipContent="$t('target_group_analysis.is_open_reminder')"
            v-model="isOpen"
            :isDisabled="false"
          />
          <div>
            <CdpButton
              class="custom-bg-dark__blue ml-20"
              :name="$t('modal.add')"
              size="sm-130"
              @click="handleTagGroupAdd()"
            />
          </div>
        </div>
      </section>
    </div>
  </el-dialog>
  <ConfirmBox
    color="blue"
    v-model="confirmSaveBox"
    :width="350"
    :title="$t('modal.confirm_correct_desc')"
    class="top15per"
    @cancelExecute="cancelSaved"
    @confirmExecute="confirmSaved"
  >
    <template v-slot:text-body>
      <table class="table-total">
        <tr class="vertical-baseline">
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
        <tr class="vertical-baseline">
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
</template>
<style lang="scss" scoped>
.cdp-dialog {
  border-radius: 10px !important;
  .overflow-visible {
    overflow: visible;
  }
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
.table-total {
  width: 100%;
  td {
    font-size: 14px;
    color: #404040;
    font-weight: normal;
  }
}
:deep(.el-form) {
  .is-error {
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
</style>
