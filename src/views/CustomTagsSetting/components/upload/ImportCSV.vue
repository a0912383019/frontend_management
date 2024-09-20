<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { apiUploadCustomTagsList } from '@/api'
import { ElNotification } from 'element-plus'
import UploadFile from '@/views/CustomTagsSetting/components/upload/UploadFile.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tagCode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:success', 'closeImportCsv'])

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//UploadFile組件ref
const refUploadFile = ref(null)

//透過emit取得檔案路徑
const handleGetFileName = (fileName) => {
  uploadCustomTagsList(fileName)
}

//dialog close callback
const handleClose = () => {
  refUploadFile.value.dialogClose()
  emit('closeImportCsv')
}

const uploadCustomTagsList = async (fileName) => {
  globalStore.isLoading = true // 開啟loading
  try {
    const result = await apiUploadCustomTagsList({
      hall_name: activeHall.hall_code,
      tag_code: props.tagCode,
      upload_users_file: fileName
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.import_success'),
        type: 'success'
      })

      globalStore.isLoading = false // 關閉loading
      handleClose()
      emit('update:success')
    } else {
      ElNotification({
        title: t('msg.import_failed'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    globalStore.isLoading = false // 關閉loading
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.import_failed'),
        type: 'Error'
      })
    }
  }
}
</script>
<template>
  <div class="box">
    <el-dialog
      :model-value="props.modelValue"
      class="cdp-dialog cdp-custom-tag-import-dialog"
      @close="handleClose"
      :title="$t('import_export_file.import')"
    >
      <div class="cdp-custom-tag-import-dialog__example">
        <el-tooltip class="box-item" effect="dark" placement="top">
          <template #content>
            <div class="cdp-custom-tag-import-dialog__example__title">
              {{ $t('import_export_file.example') }}
            </div>
            <img src="@/assets/images/upload-csv-example-2.png" width="280" alt="" />
          </template>
          <span class="cdp-custom-tag-import-dialog__example__text">{{
            $t('import_export_file.example')
          }}</span>
        </el-tooltip>
      </div>
      <UploadFile @update:files="handleGetFileName" ref="refUploadFile" />
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
}
</style>
<style lang="scss">
.cdp-custom-tag-import-dialog {
  &.el-dialog {
    max-width: 400px;
  }
  &__example {
    text-align: right;
    color: #4f84cf;
    text-decoration: underline;
    &__title {
      text-align: center;
      text-decoration: underline;
      margin-bottom: 4px;
      font-style: italic;
      color: #ffc107;
    }
    &__text {
      cursor: pointer;
    }
  }
}
</style>
