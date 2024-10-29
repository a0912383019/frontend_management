<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'
import Tab from '@/components/Tab.vue'
import ActivityData from '@/views/ActivityAnalysisList/components/activityDetail/activityData/ActivityData.vue'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { childListData } = activityStore

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  detailId: {
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
  ActivityData
  //   GrowthRate
}

// 當前使用的 component
const currentTabComponent = computed(() => {
  return componentMap[currentTabs.value] || null
})

// 子活動分析先 disabled，待活動資料頁面 api 載入完畢，有子活動資料才打開
const disabledTab = ref([1])

// 關閉 dialog
const handleDialogClosed = () => {
  childListData.value = []
  emit('closeDialog')
}

watch(
  () => childListData.value,
  () => {
    disabledTab.value = [1]
    if (childListData.value.length !== 0) {
      console.log(childListData.value);
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
          <!-- <Filter /> -->
        </div>
      </el-col>
    </el-row>
    <keep-alive>
      <component :is="currentTabComponent" :detailId="props.detailId"></component>
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
