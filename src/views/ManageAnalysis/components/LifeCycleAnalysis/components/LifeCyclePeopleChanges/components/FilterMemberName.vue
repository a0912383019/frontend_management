<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiUploadCsvList } from '@/api/global.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { ElNotification } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import UploadFile from '@/components/UploadFile.vue'

const { t } = useI18n()

// const emit = defineEmits(['query:filter'])
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { filterCustomUserList } = storeToRefs(manageAnalysisStore)
const searchName = ref('') //搜尋的名稱
const useCustomList = ref(manageAnalysisStore.useCustomList) //手動匯入名單
const fuzzySearch = ref(manageAnalysisStore.fuzzySearch) //模糊搜尋

//UploadFile組件ref
const refUploadFile = ref(null)

//dialog 開啟狀態
const dialogVisible = ref(false)

//popover 開啟狀態
const popoverVisible = ref(false)

//檔案路徑
const filePath = ref(null)

const emit = defineEmits(['update:modelValue'])

// const activeTabName = ref(props.activeName)
const handleFileUpload = (data) => {
  emit('update:modelValue', data)
}

//透過emit取得檔案路徑
const handleGetFileName = (data) => {
  filePath.value = data
  // upload_and_import_file()
  uploadCsvFile()
}

const uploadCsvFile = async () => {
  globalStore.isLoading = true // 開啟loading
  try {
    const result = await apiUploadCsvList({
      hall_name: activeHall.hall_code,
      csv_type: 1,
      csv_file: filePath.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.import_success'),
        type: 'success'
      })
      handleBeforeSubmit()
      handleFileUpload(result.data.result)
      updateFilterTimestamp() //更新timestamp已更新資料
      dialogVisible.value = false // 成功後關閉dialog
      popoverVisible.value = false // 成功後關閉popover
      globalStore.isLoading = false // 關閉loading
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

const updateFilterTimestamp = () => {
  manageAnalysisStore.filterTimestamp = new Date().getTime()
}

//使用手動匯入switch change
const handleUseCustomSwitchChange = (type) => {
  //type = true, false
  dialogVisible.value = type
}

// 資料送出前的欄位檢查
const handleBeforeSubmit = () => {
  /*
    api的search_name欄位權重會比custom_user_list大
  */
  if (useCustomList.value) {
    //如果useCustomList為true，須將search_name清空，不然會影響到搜尋結果，會以search_name得值去拿資料
    searchName.value = ''
    manageAnalysisStore.searchName = ''
  } else {
    //如果useCustomList為false，清空上傳csv檔後回傳的名單資料
    filterCustomUserList.value = []
  }
}

//確認篩選
const handleClick = () => {
  //將資料寫到pinia
  handleBeforeSubmit()
  manageAnalysisStore.searchName = searchName.value
  manageAnalysisStore.useCustomList = useCustomList.value
  manageAnalysisStore.fuzzySearch = fuzzySearch.value
  popoverVisible.value = false
  updateFilterTimestamp()
}

//dialog close callback
const handleClose = () => {
  refUploadFile.value.dialogClose()
  //關閉dialog，如果沒有上傳檔案則關閉使用者匯入名單switch
  if (filePath.value === null) {
    useCustomList.value = false
  }
}
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-dialog-filer-file"
      @close="handleClose"
      :title="t('import_export_file.import')"
    >
      <div class="cdp-dialog-filer-file__example">
        <el-tooltip class="box-item" effect="dark" placement="top">
          <template #content>
            <div class="cdp-dialog-filer-file__example__title">
              {{ $t('import_export_file.example') }}
            </div>
            <img src="@/assets/images/use_upload_tag_list_example.png" width="150" alt="" />
          </template>
          <span class="cdp-dialog-filer-file__example__text">{{
            $t('import_export_file.example')
          }}</span>
        </el-tooltip>
      </div>
      <UploadFile @update:files="handleGetFileName" ref="refUploadFile" />
    </el-dialog>
    <el-popover
      placement="bottom-end"
      :visible="popoverVisible"
      :title="t('data_name.member_name')"
      :width="320"
      trigger="click"
      popper-class="cdp-popover"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="t('common.advanced_filter')"
          @click="popoverVisible = !popoverVisible"
        />
      </template>
      <div class="drop">
        <div class="drop__search">
          <el-input v-model="searchName" :placeholder="t('common.input_member_name_search')" />
        </div>
        <div class="drop__item">
          <el-switch
            v-model="useCustomList"
            @change="handleUseCustomSwitchChange"
            :active-text="t('import_export_file.import_manually')"
            class="mr-10"
          />
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('import_export_file.filter_imported_data')"
            placement="top"
          >
            <font-awesome-icon icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </div>
        <div class="drop__item">
          <el-switch v-model="fuzzySearch" :active-text="t('common.fuzzy_search')" class="mr-10" />
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('common.return_similar_username')"
            placement="top"
          >
            <font-awesome-icon icon="fa-solid fa-circle-info" />
          </el-tooltip>
        </div>
        <div class="drop__footer">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleClick"
            :name="t('common.filter')"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  &__search {
    margin-bottom: 12px;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
  }
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
