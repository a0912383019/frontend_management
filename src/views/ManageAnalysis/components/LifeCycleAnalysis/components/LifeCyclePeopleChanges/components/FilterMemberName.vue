<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

import ImportCSV from '@/components/Filter/ImportCSV.vue'

const { t } = useI18n()

const route = useRoute()

const manageAnalysisStore = useManageAnalysisStore()
const { filterCustomUserList } = storeToRefs(manageAnalysisStore)
const searchName = ref('') //搜尋的名稱
const useCustomList = ref(manageAnalysisStore.useCustomList) //手動匯入名單
const fuzzySearch = ref(manageAnalysisStore.fuzzySearch) //模糊搜尋

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const emit = defineEmits(['update:modelValue'])

const handleFileUpload = (data) => {
  emit('update:modelValue', data)
}

const updateFilterTimestamp = () => {
  manageAnalysisStore.filterTimestamp = new Date().getTime()
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

// csv 上傳成功
const handleCsvSuccess = (result) => {
  handleBeforeSubmit()
  handleFileUpload(result)
  updateFilterTimestamp() //更新timestamp已更新資料
  manageAnalysisStore.useCustomList = true
  closePopover()
}

//確認篩選
const handleClick = () => {
  //將資料寫到pinia
  handleBeforeSubmit()
  manageAnalysisStore.searchName = searchName.value
  manageAnalysisStore.useCustomList = useCustomList.value
  manageAnalysisStore.fuzzySearch = fuzzySearch.value
  closePopover()
  updateFilterTimestamp()
}

// 初始化設定
const initSetting = () => {
  searchName.value = ''
  manageAnalysisStore.searchName = ''
  fuzzySearch.value = false
  manageAnalysisStore.fuzzySearch = fuzzySearch.value
}

// 頁面切換，清空搜尋關鍵字
watch(route, () => {
  initSetting()
})
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :title="t('data_name.member_name')"
      :width="320"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="t('common.advanced_filter')"
        />
      </template>
      <div class="drop">
        <div class="drop__search">
          <el-input v-model="searchName" :placeholder="t('common.input_member_name_search')" />
        </div>
        <div class="drop__item">
          <ImportCSV v-model="useCustomList" :csvType="1" @update:success="handleCsvSuccess" />
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
