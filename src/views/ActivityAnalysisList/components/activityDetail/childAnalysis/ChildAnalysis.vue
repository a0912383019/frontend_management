<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import RewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/RewardComponents.vue'
import NotRewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/NotRewardComponents.vue'

const { locale } = useI18n()

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const props = defineProps({
  activityId: {
    type: Number
  }
})

const isRewarded = ref(true)

const activeView = ref('RewardComponents')

// 整理所有 component
const componentMap = {
  RewardComponents,
  NotRewardComponents
}

// 當前使用的 component
const currentActiveComponent = computed(() => {
  return componentMap[activeView.value] || null
})

const switchRewarded = (val) => {
  activeView.value = val ? 'RewardComponents' : 'NotRewardComponents'
}

const switchBtnWidth = ref(72)

onMounted(() => {
  switchBtnWidth.value = locale.value === 'en' ? 93 : 72
})
</script>
<template>
  <section class="cdp-section mb-0">
    <div class="flex justify-between items-center mb-15">
      <div class="flex items-center">
        <span class="mr-20 cdp-text-blue">{{ currentChildAnalysis.name }}</span>
        <SwitchWithTooltip
          v-model="isRewarded"
          :inlinePrompt="true"
          :activeText="$t('activity_analysis.rewarded')"
          :inactiveText="$t('activity_analysis.rewarded')"
          :width="switchBtnWidth"
          :isDisabled="false"
          @update:modelValue="switchRewarded(isRewarded)"
        />
      </div>
      <CurrencySignText />
    </div>
    <keep-alive>
      <component
        :is="currentActiveComponent"
        :currentView="activeView"
        :isChildFiltered="activityStore.isChildFiltered"
        :activityId="props.activityId"
        :detailId="currentChildAnalysis.id"
      ></component>
    </keep-alive>
  </section>
</template>
<style lang="scss" scoped></style>
