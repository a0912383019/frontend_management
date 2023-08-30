<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import FilterTag from '@/components/Filter/FilterTag.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'

const { t } = useI18n()

const gameTagAnalysisStore = useGameTagAnalysis()

//popover 開啟狀態
const popoverVisible = ref(false)

// 資料
const form = reactive({
  date: '', // 日期
  searchTag: '', //包含標籤
  excludeTag: '' //排除標籤
})

const updateFilterTimestamp = () => {
  gameTagAnalysisStore.filterTimestamp = new Date().getTime()
}

// 篩選
const handleSubmitClick = () => {
  updateFilterTimestamp()
  popoverVisible.value = false
  gameTagAnalysisStore['filterFormData']['date'] = form['date']
  gameTagAnalysisStore['filterFormData']['searchTag'] = form['searchTag']
  gameTagAnalysisStore['filterFormData']['excludeTag'] = form['excludeTag']
}

onMounted(() => {
  nextTick(() => {
    gameTagAnalysisStore['filterFormData']['date'] = form['date']
    gameTagAnalysisStore['filterFormData']['searchTag'] = form['searchTag']
    gameTagAnalysisStore['filterFormData']['excludeTag'] = form['excludeTag']
  })
})

defineExpose({ popoverVisible })
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      placement="bottom-end"
      :visible="popoverVisible"
      :width="600"
      trigger="manual"
      :teleported="false"
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
      <el-row>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('date.date')"> </SectionTitle>
          <DatepickerRange
            v-model="form.date"
            :config="1"
            :shortcutsConfig="4"
            :enabledThreeMonth="false"
            :rangeEndDate="1"
            class="game-tag-analysis-datepicker"
          />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('common.include_tags')">
          </SectionTitle>
          <FilterTag v-model="form.searchTag" />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('common.exclude_tags')">
          </SectionTitle>
          <FilterTag v-model="form.excludeTag" />
        </el-col>
        <el-col class="flex justify-end">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleSubmitClick"
            :name="t('common.filter')"
          />
        </el-col>
      </el-row>
    </el-popover>
  </div>
</template>
<style lang="scss">
.game-tag-analysis-datepicker {
  .el-date-editor {
    width: 100%;
    height: 36px;
  }
}
</style>
