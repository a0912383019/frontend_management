<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryAgNameUserLevel } from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import FuzzySwitchWithTooltip from '@/components/Switch/FuzzySwitchWithTooltip.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ImportCSV from '@/components/Filter/ImportCSV.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//popover 開啟狀態
const popoverVisible = ref(false)

const emit = defineEmits(['update:filter-submit'])

// 代理帳號 options
const selectAccountOptions = ref([
  {
    value: '0',
    label: t('common.select_all'),
    selected: true
  }
])

// 會員層級 options
const selectLevelOptions = ref([
  {
    value: '0',
    label: t('common.select_all'),
    selected: true
  }
])

// 使用手動匯入名單開啟狀態
const useCustomList = ref(false)

// 會員名稱有資料時，其他欄位需要Disabled
const formDisabled = ref(false)

const form = reactive({
  member: '', //會員名稱
  selectAcount: '0', //代理帳號
  selectLevel: '0', //會員層級
  isActivedDateCheck: true, //實動日期checkbox
  activatedDate: '', //實動日期
  registerDate: '', //註冊日期
  searchTag: '', //包含標籤
  excludeTag: '', //排除標籤
  fuzzySearch: false, //模糊搜尋
  custom_user_list: [] //golang api 會用到的 CSV username
})

const handleSubmitClick = () => {
  popoverVisible.value = false
  emit('update:filter-submit', form)
  closePopover()
}

// 取得代理帳號和會員層級
const queryAgNameUserLevel = async () => {
  try {
    const result = await apiQueryAgNameUserLevel({
      hall_name: activeHall.hall_code
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformAgNameUserLevel(result.data.result)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      ElNotification({
        title: t('msg.query_failed'),
        type: 'success'
      })
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

// 處理資料
const transformAgNameUserLevel = (data) => {
  let { ag_name, user_level } = data
  // 代理帳號
  ag_name.forEach((item) => {
    selectAccountOptions.value.push({
      value: item,
      label: item
    })
  })

  // 會員層級
  user_level.forEach((item) => {
    selectLevelOptions.value.push({
      value: item.user_level_id,
      label: item.user_level_name
    })
  })
}

// csv 上傳成功
const handleCsvSuccess = (result) => {
  form.custom_user_list = result
  handleSubmitClick()
}

// 關閉 使用者手動匯入名單
const handleCsvClear = () => {
  //將 customUserList 清空
  form.custom_user_list = []
}

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

onMounted(() => {
  queryAgNameUserLevel()
})

// 監聽會員名稱
watch(
  () => form.member,
  () => {
    if (form.member === '') {
      formDisabled.value = false
    } else {
      formDisabled.value = true
    }
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
      popper-class="cdp-popover unit-test-filter"
    >
      <template #reference>
        <ButtonIcon
          icon="filter"
          :isSvg="true"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <el-row :gutter="15">
        <el-col :span="12" class="mb-19">
          <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('data_name.ag_name')">
          </SectionTitle>
          <el-select-v2
            v-model="form.selectAcount"
            class="cdp-select cdp-select__purple"
            popper-class="cdp-select-popper cdp-select-popper__purple"
            filterable
            :teleported="false"
            :disabled="formDisabled"
            :options="selectAccountOptions"
          />
        </el-col>
        <el-col :span="12" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('data_name.user_level')"
          >
          </SectionTitle>
          <el-select
            v-model="form.selectLevel"
            class="cdp-select cdp-select__purple"
            popper-class="cdp-select-popper cdp-select-popper__purple w-full"
            filterable
            :teleported="false"
            :disabled="formDisabled"
          >
            <el-option
              v-for="item in selectLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :selected="item.selected"
            />
          </el-select>
        </el-col>
        <el-col :span="12" class="mb-19">
          <div class="flex items-start mb-4">
            <el-checkbox
              v-model="form.isActivedDateCheck"
              :label="$t('data_name.active_date')"
              class="cdp-checkbox checkbox-label"
            />
          </div>
          <DatepickerRange
            v-model="form.activatedDate"
            :config="1"
            :shortcutsConfig="1"
            :disabled="formDisabled || !form.isActivedDateCheck"
            class="w-full filter-datepicker custom-tag-date-picker"
            classColor="purple"
          />
        </el-col>
        <el-col :span="12" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            style="min-height: 25px"
            :title="$t('data_name.register_date')"
          >
          </SectionTitle>
          <DatepickerRange
            v-model="form.registerDate"
            :config="10"
            :shortcutsConfig="2"
            :enabledThreeMonth="false"
            :disabled="formDisabled"
            class="w-full filter-datepicker custom-tag-date-picker"
            classColor="purple"
          />
        </el-col>
        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('data_name.member_name')"
          >
            <template #tooltip>
              {{ $t('customer_tag_list.search_by_member_name') }}
            </template>
          </SectionTitle>
          <el-input
            v-model="form.member"
            class="cdp-input__purple"
            :placeholder="$t('common.input_member_name_search')"
          />
        </el-col>
        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('common.include_tags')"
          >
          </SectionTitle>
          <SelectTag v-model="form.searchTag" />
        </el-col>
        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('common.exclude_tags')"
          >
          </SectionTitle>
          <SelectTag v-model="form.excludeTag" />
        </el-col>
      </el-row>
      <div class="drop">
        <div class="drop__item">
          <ImportCSV
            v-model="useCustomList"
            class="mr-20"
            :csvType="1"
            @update:success="handleCsvSuccess"
            @update:clear="handleCsvClear"
          />
          <FuzzySwitchWithTooltip v-model="form.fuzzySearch" />
        </div>
        <div class="drop__item">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleSubmitClick"
            :name="$t('common.filter')"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  &__item {
    display: flex;
    margin-left: 30px;
  }
}
.cdp-checkbox {
  height: 25px;
}
.custom-tag-date-picker {
  :deep(.el-popper.el-picker__popper) {
    inset: 157px -13px auto auto !important;
  }
}
</style>
<style lang="scss">
.filter-datepicker {
  .el-date-editor {
    width: 100%;
    height: 36px;
  }
}
</style>
