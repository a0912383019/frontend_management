<script setup>
import { onMounted, ref } from 'vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import { useActivityAnalysisStore } from '@/stores'

const activityStore = useActivityAnalysisStore()

const searchDate = ref('')
const searchActivity = ref('')

const popover = ref(null) // popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// 確認篩選
const handleClick = () => {
  activityStore.searchDate = searchDate.value
  activityStore.searchActivity = searchActivity.value
  activityStore.filtered = Date.now()
  closePopover()
}

onMounted(() => {
  searchDate.value = activityStore.searchDate
  searchActivity.value = activityStore.searchActivity
})
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="320"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover unit-test-people-changes"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <div class="drop">
        <div class="drop__top">
          <div class="drop__top__item full">
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('data_name.created_time')">
            </SectionTitle>
            <DatepickerRange
              v-model="searchDate"
              :rangeDate="activityStore.searchDate"
              :config="1"
              :shortcutsConfig="1"
              class="w-full filter-datepicker"
              classColor="purple"
            />
          </div>
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('activity_analysis.activity_name')"
            >
            </SectionTitle>
            <el-input
              v-model="searchActivity"
              class="cdp-input__purple"
              :placeholder="$t('common.input_member_name_search')"
            />
          </div>
        </div>
        <div class="drop__footer">
            <ButtonIcon
              icon="search"
              size="medium "
              color="purple"
              @click="handleClick"
              :name="$t('common.filter')"
            />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
