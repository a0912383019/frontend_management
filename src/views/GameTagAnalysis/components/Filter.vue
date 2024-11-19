<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import { storeToRefs } from 'pinia'

const gameTagAnalysisStore = useGameTagAnalysis()
const { filterFormData, filterTimestamp } = storeToRefs(gameTagAnalysisStore)

// 資料
const form = reactive({
  date: '', // 日期
  searchTag: '', //包含標籤
  excludeTag: '' //排除標籤
})

const updateFilterTimestamp = () => {
  filterTimestamp.value = new Date().getTime()
}

// 篩選
const handleSubmitClick = () => {
  updateFilterTimestamp()
  filterFormData.value.date = form['date']
  filterFormData.value.searchTag = form['searchTag']
  filterFormData.value.excludeTag = form['excludeTag']
  closePopover()
}

onMounted(() => {
  nextTick(() => {
    filterFormData.value.date = form['date']
    filterFormData.value.searchTag = form['searchTag']
    filterFormData.value.excludeTag = form['excludeTag']
  })
})

const popover = ref(null) //活躍度明細

const closePopover = () => {
  popover.value.hide()
}
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="600"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <el-row>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-4" :title="$t('date.date')"></SectionTitle>
          <DatepickerRange
            v-model="form.date"
            class="game-tag-analysis-datepicker"
            classColor="purple"
          />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-4" :title="$t('common.include_tags')">
          </SectionTitle>
          <SelectTag v-model="form.searchTag" />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-4" :title="$t('common.exclude_tags')">
          </SectionTitle>
          <SelectTag v-model="form.excludeTag" />
        </el-col>
        <el-col class="flex justify-end">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleSubmitClick"
            :name="$t('common.filter')"
          />
        </el-col>
      </el-row>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.game-tag-analysis-datepicker {
  // alvin 時代，目前測試無影響，待之後確認無影響再刪除
  // .el-date-editor {
  //   width: 100%;
  //   height: 36px;
  // }
  :deep(.el-popper.el-picker__popper) {
    inset: 74px -21px auto auto !important;
  }
}
</style>
