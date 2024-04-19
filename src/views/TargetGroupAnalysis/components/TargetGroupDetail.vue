<script setup>
import { ref, computed, watch, toRefs, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Tab from '@/components/Tab.vue'
import TargetData from '@/views/TargetGroupAnalysis/components/TargetData.vue'

const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  targetId: {
    type: Number
  }
})

const emit = defineEmits(['closeDialog'])

//當前顯示的tab
const currentTabs = ref('TargetData')
const tabList = computed(() => {
  return [
    {
      name: 'TargetData',
      label: t('target_group_analysis.target_group_info')
    },
    {
      name: 'AnalysisResult',
      label: t('target_group_analysis.analysis_result')
    }
  ]
})

//當前的component
const currentTabComponent = computed(() => {
  let result = null
  switch (currentTabs.value) {
    case 'TargetData':
      result = TargetData
      break
    case 'AnalysisResult':
      result = AnalysisResult
      break
  }
  return result
})

//開啟 dialog
const handleOpenDialog = () => {
  console.log('father', props.targetId)
}

// 關閉 dialog
const handleDialogClosed = () => {
  emit('closeDialog')
}
</script>
<template>
  <el-dialog
    :model-value="props.modelValue"
    class="cdp-dialog"
    :append-to-body="true"
    width="1280"
    :destroy-on-close="true"
    @open="handleOpenDialog"
    @closed="handleDialogClosed"
  >
    <template #header>
      <div class="cdp-dialog__header">
        {{ $t('target_group_analysis.target_group_detail') }}
      </div>
    </template>
    <div class="cdp-dialog__content">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="8">
          <Tab
            :tabData="tabList"
            :activeName="currentTabs"
            class="tabs-manage-analysis"
            v-model="currentTabs"
          ></Tab>
        </el-col>
      </el-row>
      <div class="cdp-dialog__component">
        <keep-alive>
          <component :is="currentTabComponent" :targetId="props.targetId"></component>
        </keep-alive>
      </div>
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
</style>
