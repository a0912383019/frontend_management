<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import FilterDate from '@/components/Filter/FilterDate.vue'
import Tab from '@/components/Tab.vue'
import Overview from './Overview/Overview.vue'
import Profit from './Profit/Profit.vue'
import Journey from './Journey/Journey.vue'
import Analysis from './Analysis/Analysis.vue'
import { tabData } from './tabData.js'

const router = useRouter()

const { t } = useI18n()
const dialogVisible = ref(false)

const dialogMemberDetailStore = useDialogMemberDetailStore()

// 另開視窗
const openNewWindow = () => {
  const routeData = router.resolve({ name: 'member-details-popup' })
  window.open(routeData.href, '_blank', 'width=1000,height=800,scrollbars=yes')
}

//當前顯示的tab
const currentTabs = ref('Overview')

//tabs列表
const tabList = computed(() => {
  return tabData.map((item) => {
    return {
      name: item.name,
      label: t(item.label)
    }
  })
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
  headerMemberName.value = dialogMemberDetailStore.memberData.user_name
}

const handleDialogClosed = () => {
  currentTabs.value = 'Overview'
}

//日期更新後執行的動作
const updateTimestamp = (data) => {
  //將資料寫到pinia
  dialogMemberDetailStore.dialogMemberDetailRangeDate = data['rangeDate']
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
      @closed="handleDialogClosed"
    >
      <template #header>
        <div class="cdp-dialog__header">
          {{ $t('customer_detail_info.member_name') }}
          <div class="underline mr-14">{{ headerMemberName }}</div>
          <button class="cdp-dialog__header-button" @click="openNewWindow">
            <font-awesome-icon icon="fa-regular fa-window-restore" />
            {{ $t('customer_detail_info.open_new_window') }}
          </button>
        </div>
      </template>
      <div class="cdp-dialog__content">
        <el-row :gutter="20" class="mb-20">
          <el-col :span="12">
            <Tab
              :tabData="tabList"
              :activeName="currentTabs"
              class="tabs-manage-analysis"
              v-model="currentTabs"
            ></Tab>
          </el-col>
          <el-col :span="12">
            <div class="flex justify-end">
              <FilterDate
                :config="13"
                :rangeDate="dialogMemberDetailStore.dialogMemberDetailRangeDate"
                @update:timestamp="updateTimestamp"
                :rangeEndDate="1"
              />
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
  &__header {
    display: flex;
    align-items: center;
    color: #fff;
    &-button {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      padding: 6px 11px;
      border-radius: 5px;
      border: solid 1px rgba(255, 255, 255, 0.2);
      background-color: rgba(255, 255, 255, 0.1);
      transition: all 0.5s;
      svg {
        margin-right: 4px;
      }
      &:hover {
        border-color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
<style lang="scss">
.cdp-member-detail-dialog {
  margin-top: 55px;
  &.cdp-dialog {
    width: 100%;
    max-width: 90%;
  }
}
</style>
