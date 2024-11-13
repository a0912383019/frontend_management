<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'
import Tab from '@/components/Tab.vue'
import ActivityData from '@/views/ActivityAnalysisList/components/activityDetail/activityData/ActivityData.vue'
import Filter from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/Filter.vue'
import ChildAnalysis from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/ChildAnalysis.vue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis, findSelectedOption, initChildData } = activityStore
const { optionChildList, childListData } = storeToRefs(activityStore)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  activityId: {
    type: Number
  }
})

const emit = defineEmits(['closeDialog'])

//tabs列表
const tabData = computed(() => {
  return [
    {
      name: 'ActivityData',
      label: t('activity_analysis.activity_info')
    },
    {
      name: 'ChildAnalysis',
      label: t('activity_analysis.activity_detail_result')
    }
  ]
})

// 當前顯示的tab
const currentTabs = ref('ActivityData')

// 整理所有 component
const componentMap = {
  ActivityData,
  ChildAnalysis
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})

// 子活動分析先 disabled，待活動資料頁面 api 載入完畢，有子活動資料才打開
const disabledTab = ref([1])

// 關閉 dialog
const handleDialogClosed = () => {
  disabledTab.value = [1]
  currentTabs.value = 'ActivityData'
  initChildData()
  emit('closeDialog')
}

// 產生子活動進階篩選選項
const generateChildListOptions = () => {
  optionChildList.value = childListData.value.map((ele) => {
    return {
      value: ele.activity_detail_id,
      label: ele.activity_detail_name
    }
  })
  currentChildAnalysis.id = optionChildList.value[0].value

  findSelectedOption()
}

watch(
  () => childListData.value,
  () => {
    disabledTab.value = [1]
    if (childListData.value.length > 0) {
      // 選項產生完成後再 enable tab
      generateChildListOptions()
      disabledTab.value = []
    }
  }
)
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog overflow-visible dialog-mt-40"
    :append-to-body="true"
    width="1280"
    :destroy-on-close="true"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('activity_analysis.activity_analysis_detail') }}
      </div>
    </template>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <Tab
          :tabData="tabData"
          :activeName="currentTabs"
          v-model="currentTabs"
          :disabledTab="disabledTab"
        ></Tab>
      </el-col>
      <el-col :span="16">
        <div v-if="currentTabs === 'ChildAnalysis'" class="flex items-center justify-end">
          <Filter :activityId="props.activityId" />
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent" :activityId="props.activityId"></component>
    </keep-alive>
  </el-dialog>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__header {
    color: #fff;
  }
}
</style>
