<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import Tab from '@/components/Tab.vue'
import { tabData } from '@/components/Dialog/DialogMemberDetail/tabData.js'
import FilterDate from '@/components/Filter/FilterDate.vue'
import Overview from '@/components/Dialog/DialogMemberDetail/Overview/Overview.vue'
import Profit from '@/components/Dialog/DialogMemberDetail/Profit/Profit.vue'
import Journey from '@/components/Dialog/DialogMemberDetail/Journey/Journey.vue'
import Analysis from '@/components/Dialog/DialogMemberDetail/Analysis/Analysis.vue'

const { t } = useI18n()

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { memberData } = storeToRefs(dialogMemberDetailStore)

memberData.value = JSON.parse(sessionStorage.member_data)

//當前顯示的tab
const currentTabs = ref('Overview')

// tab列表
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

//日期更新後執行的動作
const updateTimestamp = (data) => {
  //將資料寫到pinia
  dialogMemberDetailStore.dialogMemberDetailRangeDate = data['rangeDate']
}

onMounted(() => {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })

  document.addEventListener('selectstart', (event) => {
    event.preventDefault()
  })
})
</script>
<template>
  <div class="content">
    <div class="content__member-title">
      {{ $t('customer_detail_info.member_name') }}
      <div class="underline font-bold">{{ dialogMemberDetailStore.memberData.user_name }}</div>
    </div>
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
            :config="7"
            :rangeDate="dialogMemberDetailStore.dialogMemberDetailRangeDate"
            @update:timestamp="updateTimestamp"
          />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 20px;
  border-left-color: #f4f6f9;
  &__member-title {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    font-size: 20px;
  }
}
</style>
