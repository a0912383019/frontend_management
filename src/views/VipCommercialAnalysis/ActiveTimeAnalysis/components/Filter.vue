<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Datepicker from '@/components/Date/Datepicker.vue'
import ImportCSV from '@/components/Filter/ImportCSV.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag, livelyAnalysisFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const emit = defineEmits(['update:filter'])

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// filter 欄位資料
const filterData = reactive({
  member: '',
  date: '',
  searchWeek: '1,2,3,4,5,6,7',
  searchTag: defaultVipTag,
})

// 包含星期選項
const selectWeekLists = ref([
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
  },
])

// 取得 system_config 資料
const tagsConfig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

// 包含標籤選項
const selectTagLists = ref([
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
// 儲存初始資料
const originalSelectTypeLists = JSON.parse(JSON.stringify(selectTagLists.value))

// 紀錄 key
const key = ref(0)

// csv 上傳成功
const handleCsvSuccess = (data) => {
  filterData['custom_user_list'] = data
  handleClick()
}

// 確認篩選
const handleClick = () => {
  if (filterData['searchTag'] === '') {
    // 如果 searchTag 為空，要搜尋全部，且重置 SelectTagSingle 組件，恢復選擇全部選項
    filterData['searchTag'] = defaultVipTag
    key.value = Math.floor(Math.random() * 10000)
    // 恢復為預設值
    selectTypeLists.value = originalSelectTypeLists
  }
  livelyAnalysisFilter['date'] = filterData['date']
  livelyAnalysisFilter['member'] = filterData['member']
  livelyAnalysisFilter['custom'] = filterData['custom']
  livelyAnalysisFilter['searchTag'] = filterData['searchTag']
  livelyAnalysisFilter['fuzzySearch'] = filterData['fuzzySearch']
  livelyAnalysisFilter['custom_user_list'] = filterData['custom_user_list']
  emit('update:filter')
  closePopover()
}
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="300"
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
          <div class="mb-15">
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

          <div class="mb-15">
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.date')">
            </SectionTitle>
            <Datepicker v-model="filterData.date" classColor="purple" />
          </div>
          <div class="mb-15">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('common.include_weeks')"
            >
            </SectionTitle>
            <SelectTagSingle :key="key" :lists="selectWeekLists" v-model="filterData.searchWeek" />
          </div>
          <div class="mb-15">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('common.include_tags')"
            >
            </SectionTitle>
            <SelectTagSingle :key="key" :lists="selectTagLists" v-model="filterData.searchTag" />
          </div>
            <ButtonIcon
              icon="search"
              size="medium "
              color="purple"
              @click="handleClick"
              :name="$t('common.filter')"
            />
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
