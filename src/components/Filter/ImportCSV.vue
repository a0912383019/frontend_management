<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { apiUploadCsvList } from '@/api/global.js'
import { ElNotification } from 'element-plus'
import UploadFile from '@/components/Filter/UploadFile.vue'

const { t } = useI18n()

const props = defineProps({
  csvType: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:success', 'update:clear'])

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//檔案路徑
const filePath = ref(null)

//UploadFile組件ref
const refUploadFile = ref(null)

//透過emit取得檔案路徑
const handleGetFileName = (data) => {
  filePath.value = data
  uploadCsvFile()
}

// 存放 api 資料
const apiResult = ref([])

//dialog 開啟狀態
const dialogVisible = ref(false)

//dialog close callback
const handleClose = () => {
  refUploadFile.value.dialogClose()
  if (apiResult.value.length === 0) {
    switchValue.value = false
  }
}

const uploadCsvFile = async () => {
  globalStore.isLoading = true // 開啟loading
  try {
    const result = await apiUploadCsvList({
      hall_name: activeHall.hall_code,
      csv_type: props.csvType,
      csv_file: filePath.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.import_success'),
        type: 'success'
      })

      dialogVisible.value = false // 成功後關閉dialog
      globalStore.isLoading = false // 關閉loading

      // 傳遞會員帳號的emit給父層使用
      apiResult.value = result.data.result
      emit('update:success', apiResult.value)
    }
  } catch (error) {
    console.error(error)
    globalStore.isLoading = false // 關閉loading
    apiResult.value = []
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

//switch 狀態
const switchValue = ref(false)

// switch change
const handleUseCustomSwitchChange = (type) => {
  emit('update:modelValue', type)
  dialogVisible.value = type
}

watch(
  () => switchValue.value,
  () => {
    // 關閉手動匯入名單時，emit update:clear
    if (!switchValue.value) {
      emit('update:clear', true)
    }
  }
)
</script>
<template>
  <div class="box">
    <el-switch
      v-model="switchValue"
      @change="handleUseCustomSwitchChange"
      :active-text="$t('import_export_file.import_manually')"
      class="mr-10 cdp-switch"
    />
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="$t('import_export_file.filter_imported_data')"
      placement="top"
    >
      <font-awesome-icon icon="fa-solid fa-circle-info" />
    </el-tooltip>

    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-dialog-filer-file"
      @close="handleClose"
      :title="$t('import_export_file.import')"
    >
      <div class="cdp-dialog-filer-file__example">
        <el-tooltip class="box-item" effect="dark" placement="top">
          <template #content>
            <div class="cdp-dialog-filer-file__example__title">
              {{ $t('import_export_file.example') }}
            </div>
            <img src="@/assets/images/upload-csv-example.png" width="150" alt="" />
          </template>
          <span class="cdp-dialog-filer-file__example__text">{{
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
.cdp-dialog-filer-file {
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
