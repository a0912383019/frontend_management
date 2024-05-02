<script setup>
import { ref, reactive } from 'vue'
import { useTargetGroupStore } from '@/stores'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TagGroupSetting.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/Button/ConfirmBox.vue'

const targetGroup = useTargetGroupStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  targetId: {
    type: Number
  }
})

const emit = defineEmits(['closeDialog'])

const tagGroups = ref(null)
const isOpen = ref(false)

const formRef = ref(null)
const validateForm = reactive({
  newTargetName: ''
})

// 關閉 dialog
const handleDialogClosed = () => {
  validateForm.newTargetName = ''
  emit('closeDialog')
}

const tagsGroupsValid = ref(false)

const handleTagGroupAdd = () => {
  formRef.value.validate((valid) => {
    if (valid && tagsGroupsValid.value) {
      confirmSaveBox.value = true
    } else {
      return false
    }
  })
  tagGroups.value.validTable()
}

const vertifyPassed = (valid) => {
  tagsGroupsValid.value = valid
}

const confirmSaveBox = ref(false)

const cancelSaved = () => {
  confirmSaveBox.value = false
}

const confirmSaved = () => {
  confirmSaveBox.value = false
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
          <el-form ref="formRef" :model="validateForm">
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
            name="target_group_analysis.is_open"
            content="target_group_analysis.is_open_reminder"
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
    title="modal.confirm_correct_desc"
    class="top15per"
    @cancelExecute="cancelSaved"
    @confirmExecute="confirmSaved"
  >
    <template v-slot:text-body>
      <table class="table-total">
        <tr class="align-baseline">
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
  .align-baseline {
    vertical-align: baseline;
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
