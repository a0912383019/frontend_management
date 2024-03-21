<script setup>
import { ref, reactive, onUnmounted, computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataRankAnalysisStore } from '@/stores'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'

const { t } = useI18n()

const dataRankStore = useDataRankAnalysisStore()
const { betAmountFilter } = dataRankStore
const { searchDate, rank } = toRefs(betAmountFilter)

const emit = defineEmits(['update:filter'])

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// filter 欄位資料
const filterData = reactive({
  searchDate: searchDate,
  rank: rank
})

// 排名選項
const selectRankLists = computed(() => {
  return [
    {
      value: 10,
      label: t('rank_analysis.top_10')
    },
    {
      value: 20,
      label: t('rank_analysis.top_20')
    },
    {
      value: 50,
      label: t('rank_analysis.top_50')
    }
  ]
})

// 確認篩選
const handleClick = () => {
  betAmountFilter.searchDate = filterData.searchDate
  betAmountFilter.rank = filterData.rank
  emit('update:filter')
  closePopover()
}

onUnmounted(() => {
  // 將篩選恢復成預設值
  dataRankStore.resetState()
})
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="310"
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
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.date')">
            </SectionTitle>
            <DatepickerRange
              v-model="filterData.searchDate"
              :config="8"
              :shortcutsConfig="1"
              class="w-full filter-datepicker"
              classColor="purple"
            />
          </div>
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('rank_analysis.ranking')"
            >
            </SectionTitle>
            <el-select
              v-model="filterData.rank"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
            >
              <el-option
                v-for="item in selectRankLists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="drop__footer">
          <div class="drop__footer__item">
            <ButtonIcon
              icon="search"
              size="medium "
              color="purple"
              @click="handleClick"
              :name="$t('common.filter')"
            />
          </div>
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
    &__item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
}
</style>
