<script setup>
import { ref } from 'vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { useActivityAnalysisStore } from '@/stores'

const activityStore = useActivityAnalysisStore()
const { findSelectedOption, currentChildAnalysis, optionChildList } = activityStore

const props = defineProps({
  activityId: {
    type: Number
  }
})

const popover = ref(null) // popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// 確認篩選
const handleClick = () => {
  findSelectedOption()
  activityStore.isChildFiltered = Date.now()
  closePopover()
}
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
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('activity_analysis.activity_detail')"
            >
            </SectionTitle>
            <el-select
              v-model="currentChildAnalysis.id"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
              :filterable="true"
            >
              <el-option
                v-for="item in optionChildList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
