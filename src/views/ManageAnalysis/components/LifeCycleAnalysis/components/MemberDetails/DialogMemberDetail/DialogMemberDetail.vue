<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import FilterDate from '@/views/ManageAnalysis/components/FilterDate.vue'
import Tab from '@/components/Tab.vue'
import Overview from './Overview/Overview.vue'
import Profit from './Profit/Profit.vue'
import Journey from './Journey/Journey.vue'
import Analysis from './Analysis/Analysis.vue'

const { t } = useI18n()
const dialogVisible = ref(false)

const manageAnalysisStore = useManageAnalysisStore()

//當前顯示的tab
const currentTabs = ref('Overview')

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'Overview',
      label: t('customer_detail_info.tab_overview')
    },
    {
      name: 'Profit',
      label: t('customer_detail_info.tab_profit')
    },
    {
      name: 'Journey',
      label: t('customer_detail_info.tab_journey')
    },
    {
      name: 'Analysis',
      label: t('customer_detail_info.tab_behaviour')
    }
  ]
})

//當前的component
const currentTabComponent = computed(() => {
  let result = null
  switch (currentTabs.value) {
    case 'Overview':
      result = Overview
      break
    case 'Profit':
      result = Profit
      break
    case 'Journey':
      result = Journey
      break
    case 'Analysis':
      result = Analysis
      break
  }
  return result
})

//會員名稱
const headerMemberName = ref('')
//組合Dialog Title & 會員名稱
const headerTitle = computed(() => {
  return t('customer_detail_info.member_name') + headerMemberName.value
})

//開啟 dialog
const handleOpenDialog = () => {
  dialogVisible.value = true
  headerMemberName.value = ''
  headerMemberName.value = manageAnalysisStore.memberData.user_name
}

//日期更新後執行的動作
const updateTimestamp = (data) => {
  //將資料寫到pinia
  manageAnalysisStore.filterDateDialogMemberDetailTimestamp = data['timestamp']
  manageAnalysisStore.dialogMemberDetailRangeDate = data['rangeDate']
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-member-detail-dialog"
      :append-to-body="true"
      :title="headerTitle"
      :destroy-on-close="true"
    >
      <div class="cdp-dialog__content">
        <el-row :gutter="20" class="mb-20">
          <el-col :span="12">
            <Tab
              :tabData="tabData"
              :activeName="currentTabs"
              class="tabs-manage-analysis"
              v-model="currentTabs"
            ></Tab>
          </el-col>
          <el-col :span="12">
            <div class="flex justify-end">
              <FilterDate :config="13" @update:timestamp="updateTimestamp" />
            </div>
          </el-col>
        </el-row>
        <div class="cdp-dialog__component">
          <keep-alive>
            <component :is="currentTabComponent"></component>
          </keep-alive>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    background-color: #fff;
  }
}
</style>
<style lang="scss">
.cdp-member-detail-dialog {
  &.cdp-dialog {
    width: 100%;
    max-width: 90%;
  }
}
</style>
