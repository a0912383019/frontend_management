<script setup>
import { ref, reactive, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { storeToRefs } from 'pinia'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag, weekTotalReportFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const emit = defineEmits(['update:filter'])

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// filter 欄位資料
const filterData = reactive({
  searchDate: '',
  vipTag: defaultVipTag
})

// 取得 system_config 資料
const tagsConfig = ref(getSessionStorageEntity('system_config').tags_config)

// 包含標籤選項
const selectTypeLists = computed({
  get() {
    return [
      {
        value: 'all',
        label: t('vip_commercial_analysis.all'),
        disabled: false
      },
      {
        value: 10001,
        label: tagsConfig.value[10001].tag_name,
        disabled: true
      },
      {
        value: 10003,
        label: tagsConfig.value[10003].tag_name,
        disabled: true
      }
    ]
  },
  set(newValue) {
    return newValue
  }
})
// 儲存初始資料
const originalSelectTypeLists = JSON.parse(JSON.stringify(selectTypeLists.value))

// 紀錄 key
const key = ref(0)

// 確認篩選
const handleClick = () => {
  if (filterData.vipTag === '') {
    // 如果 vip_tag 為空，要搜尋全部，且重置 SelectTagSingle 組件，恢復選擇全部選項
    filterData.vipTag = defaultVipTag
    key.value = Math.floor(Math.random() * 10000)
    // 恢復為預設值
    selectTypeLists.value = originalSelectTypeLists
  }
  const date = filterData.searchDate.split('~')
  weekTotalReportFilter.startDate = dayjs(date[0]).format('YYYY-MM')
  weekTotalReportFilter.endDate = dayjs(date[1]).format('YYYY-MM')
  weekTotalReportFilter.vipTag = filterData.vipTag
  emit('update:filter')
  closePopover()
}

onUnmounted(() => {
  // 將篩選日期恢復成預設值
  vipStore.resetState()
})

watch(
  () => systemConfigIsOk.value,
  () => {
    tagsConfig.value = getSessionStorageEntity('system_config').tags_config
    key.value = Math.floor(Math.random() * 100)
  }
)
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
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('date.date_duration')"
            >
            </SectionTitle>
            <DatepickerRange
              v-model="filterData.searchDate"
              type="monthrange"
              :config="9"
              :shortcutsConfig="0"
              classColor="purple"
            />
          </div>
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('common.include_tags')"
            >
            </SectionTitle>
            <SelectTagSingle :key="key" :lists="selectTypeLists" v-model="filterData.vipTag" />
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
