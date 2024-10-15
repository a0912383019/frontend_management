<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { storeToRefs } from 'pinia'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ImportCSV from '@/components/Filter/ImportCSV.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag, activeTimeAnalysisFilter, defaultWeeks } = vipStore

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
  searchName: '',
  searchDate: '',
  custom: false,
  containWeeks: defaultWeeks,
  vipTag: defaultVipTag,
  customUserList: [],
  fuzzySearch: false
})

// 包含星期選項
const selectWeekLists = computed({
  get() {
    return [
      {
        value: 'all',
        label: t('vip_commercial_analysis.all'),
        disabled: false
      },
      {
        value: 1,
        label: t('vip_commercial_analysis.monday'),
        disabled: true
      },
      {
        value: 2,
        label: t('vip_commercial_analysis.tuesday'),
        disabled: true
      },
      {
        value: 3,
        label: t('vip_commercial_analysis.wednesday'),
        disabled: true
      },
      {
        value: 4,
        label: t('vip_commercial_analysis.thursday'),
        disabled: true
      },
      {
        value: 5,
        label: t('vip_commercial_analysis.friday'),
        disabled: true
      },
      {
        value: 6,
        label: t('vip_commercial_analysis.saturday'),
        disabled: true
      },
      {
        value: 7,
        label: t('vip_commercial_analysis.sunday'),
        disabled: true
      }
    ]
  },
  set(newValue) {
    return newValue
  }
})

// 儲存初始資料
const originalWeekLists = JSON.parse(JSON.stringify(selectWeekLists.value))

// 取得 system_config 資料
const tagsConfig = ref(getSessionStorageEntity('system_config').tags_config)

// 包含標籤選項
const selectTagLists = computed({
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
  set(newVale) {
    return newVale
  }
})
// 儲存初始資料
const originalVipTagLists = JSON.parse(JSON.stringify(selectTagLists.value))

// 紀錄 key
const weekKey = ref(0)
const vipKey = ref(0)

// csv 上傳成功
const handleCsvSuccess = (data) => {
  filterData.customUserList = data
  handleClick()
}

// 關閉 使用者手動匯入名單
const handleCsvClear = () => {
  //將 customUserList 清空
  filterData.customUserList = []
}

// 確認篩選
const handleClick = () => {
  if (filterData.containWeeks === '') {
    // 如果 containWeeks 為空，要搜尋全部，且重置 SelectWeekSingle 組件，恢復選擇全部選項
    filterData.containWeeks = defaultWeeks
    weekKey.value = Math.floor(Math.random() * 10000)
    // 恢復為預設值
    selectWeekLists.value = originalWeekLists
  }

  if (filterData.vipTag === '') {
    // 如果 vipTag 為空，要搜尋全部，且重置 SelectTagSingle 組件，恢復選擇全部選項
    filterData.vipTag = defaultVipTag
    vipKey.value = Math.floor(Math.random() * 10000)
    // 恢復為預設值
    selectTagLists.value = originalVipTagLists
  }

  activeTimeAnalysisFilter.searchDate = filterData.searchDate
  activeTimeAnalysisFilter.searchName = filterData.searchName
  activeTimeAnalysisFilter.custom = filterData.custom
  activeTimeAnalysisFilter.vipTag = filterData.vipTag
  activeTimeAnalysisFilter.containWeeks = filterData.containWeeks
  activeTimeAnalysisFilter.fuzzySearch = filterData.fuzzySearch
  activeTimeAnalysisFilter.customUserList = filterData.customUserList
  emit('update:filter')
  closePopover()
}

watch(
  () => systemConfigIsOk.value,
  () => {
    tagsConfig.value = getSessionStorageEntity('system_config').tags_config
    weekKey.value = Math.floor(Math.random() * 100)
    vipKey.value = Math.floor(Math.random() * 100)
  }
)
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="600"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover unit-test"
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
          <div class="drop__top__item">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('data_name.member_name')"
            >
            </SectionTitle>
            <el-input
              v-model="filterData.searchName"
              :placeholder="$t('common.input_member_name_search')"
              class="cdp-input__purple"
            />
          </div>
          <div class="drop__top__item">
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
              :title="$t('vip_commercial_analysis.include_day_of_week')"
            >
            </SectionTitle>
            <SelectTagSingle
              :key="weekKey"
              :lists="selectWeekLists"
              :defaultAll="defaultWeeks"
              v-model="filterData.containWeeks"
            />
          </div>
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('common.include_tags')"
            >
            </SectionTitle>
            <SelectTagSingle :key="vipKey" :lists="selectTagLists" v-model="filterData.vipTag" />
          </div>
        </div>
        <div class="drop__footer">
          <div class="drop__footer__item">
            <ImportCSV
              v-model="filterData.custom"
              :csvType="1"
              @update:success="handleCsvSuccess"
              @update:clear="handleCsvClear"
            />
          </div>
          <div class="drop__footer__item">
            <el-switch
              v-model="filterData.fuzzySearch"
              :active-text="$t('common.fuzzy_search')"
              class="mr-10 cdp-switch"
            />
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="$t('common.return_similar_username')"
              placement="top"
            >
              <font-awesome-icon icon="fa-solid fa-circle-info" />
            </el-tooltip>
          </div>
          <div class="drop__footer__item">
            <ButtonIcon
              icon="search"
              size="medium"
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
