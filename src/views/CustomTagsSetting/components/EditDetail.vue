<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { apiUpdateTagDescription } from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification } from 'element-plus'

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
  },
  tagDescription: {
    type: String,
    required: true
  }
})

const tagForm = reactive({
  tagDescription: ''
})

const validateTrimDescription = (rule, value, callback) => {
  if (value.trim() === '') {
    callback(new Error(t('validator.not_space_error_msg')))
  } else {
    callback()
  }
}

const rules = reactive({
  tagDescription: [
    {
      required: true,
      message: t('custom_tags_setting.blank_tag_description_error_msg'),
      trigger: 'change'
    },
    {
      max: 200,
      message: t('custom_tags_setting.tag_description_length_limit_error_msg'),
      trigger: 'change'
    },
    { validator: validateTrimDescription, trigger: 'change' }
  ]
})

const formRef = ref(null)

const emit = defineEmits(['closeDetail', 'updateSuccess'])

const handleDialogClosed = () => {
  emit('closeDetail')
}

const handleDialogOpen = () => {
  submitBtnDisabled.value = true
  tagForm.tagDescription = props.tagDescription
}

const submitBtnDisabled = ref(true)

const handleSubmit = () => {
  updateTagDescription()
}

const updateTagDescription = async () => {
  try {
    const result = await apiUpdateTagDescription({
      hall_name: activeHall.hall_code,
      tag_code: parseInt(props.tagCode),
      tag_description: tagForm.tagDescription
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.updated_successfully'),
        type: 'success'
      })
      handleDialogClosed()
      emit('updateSuccess')
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

watch(
  () => tagForm.tagDescription,
  () => {
    let tagError = false
    formRef.value
      .validate((valid) => {
        tagError = valid
      })
      .then(() => {
        if (tagForm.tagDescription === props.tagDescription || !tagError) {
          submitBtnDisabled.value = true
        } else {
          submitBtnDisabled.value = false
        }
      })
  }
)
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog"
    :append-to-body="true"
    width="580"
    :destroy-on-close="true"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('tags.tag_description') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <section class="cdp-section">
        <div class="mb-20">
          <div class="cdp-text-blue mb-3">{{ $t('tags.tag_name') }}</div>
          <el-input v-model="props.tagName" class="cdp-input cdp-input-disabled" readonly>
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
        </div>
        <div class="mb-20">
          <div class="cdp-text-blue mb-3">
            {{ $t('tags.tag_description') }}
          </div>
          <el-form ref="formRef" :model="tagForm" :rules="rules">
            <el-form-item prop="tagDescription">
              <el-input
                v-model="tagForm.tagDescription"
                type="textarea"
                :placeholder="$t('custom_tags_setting.input_tag_description')"
                class="cdp-tag-textarea"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="text-right">
          <ButtonIcon
            color="blue"
            :disabled="submitBtnDisabled"
            :name="$t('modal.save')"
            @click="handleSubmit()"
          />
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
:deep(.el-form) {
  .cdp-tag-textarea {
    border: solid 1px #cfd8e6;
    border-radius: 5px;
    .el-textarea {
      &__inner {
        box-shadow: none;
        height: 140px;
        resize: none;
        &:hover {
          box-shadow: 0 0 0 1px #4f84cf !important;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  .is-error {
    .cdp-tag-textarea {
      border: solid 1px #f56c6c;
      .el-textarea {
        &__inner {
          &:hover {
            box-shadow: 0 0 0 1px #f56c6c !important;
          }
        }
      }
    }
  }
}
</style>
