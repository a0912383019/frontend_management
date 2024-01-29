<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore } from '@/stores/global.js'
import { useVipCommercialAnalysisStore } from '@/stores/vipCommercialAnalysis.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Datepicker from '@/components/Date/Datepicker.vue'
import ImportCSV from '@/components/Filter/ImportCSV.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const emit = defineEmits(['update:filter'])

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const useCustomList = ref('') // 手動匯入名單

// filter 欄位資料
const filterData = reactive({
  member: '',
  date: '',
  custom: false,
  searchTag: '10001,10003',
  fuzzySearch: false
})

// 取得 system_config 資料
const tagsConfig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

// 包含標籤選項
const selectTypeLists = ref([
  {
    value: 'all',
    label: t('vip_commercial_analysis.all'),
    disabled: false
  },
  {
    value: 10001,
    label: tagsConfig[10001]['tag_name'],
    disabled: true
  },
  {
    value: 10003,
    label: tagsConfig[10003]['tag_name'],
    disabled: true
  }
])

// 紀錄 key
const key = ref(0)

// csv 上傳成功
const handleCsvSuccess = () => {}

// 確認篩選
const handleClick = () => {
  if (filterData['searchTag'] === '') {
    // 如果 searchTag 為空，要搜尋全部，且重置 SelectTagSingle 組件，恢復選擇全部選項
    filterData['searchTag'] = '10001,10003'
    key.value = Math.floor(Math.random() * 10000)
  }
  console.log(key.value)
  livelyAnalysisFilter['member'] = filterData['member']
  livelyAnalysisFilter['date'] = filterData['date']
  livelyAnalysisFilter['custom'] = filterData['custom']
  livelyAnalysisFilter['searchTag'] = filterData['searchTag']
  livelyAnalysisFilter['fuzzySearch'] = filterData['fuzzySearch']
  emit('update:filter')
  // closePopover()
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
          <div class="drop__top__item">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('data_name.member_name')"
            >
            </SectionTitle>
            <el-input
              v-model="filterData.member"
              :placeholder="$t('common.input_member_name_search')"
              class="cdp-input__purple"
            />
          </div>

          <div class="drop__top__item">
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.date')">
            </SectionTitle>
            <Datepicker v-model="filterData.date" classColor="purple" />
          </div>

          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('common.include_tags')"
            >
            </SectionTitle>
            <SelectTagSingle :key="key" :lists="selectTypeLists" v-model="filterData.searchTag" />
          </div>
        </div>
        <div class="drop__footer">
          <div class="drop__footer__item">
            <ImportCSV v-model="useCustomList" :csvType="1" @update:success="handleCsvSuccess" />
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
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
}
</style>
