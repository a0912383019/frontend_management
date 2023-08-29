<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryAgNameUserLevel } from '@/api/customerTagList.js'
import { useGlobalStore } from '@/stores/global.js'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import FuzzySwitchWithTooltip from '@/components/Switch/FuzzySwitchWithTooltip.vue'
import FilterTag from '@/components/Filter/FilterTag.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ImportCSV from '@/components/Filter/ImportCSV.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//popover 開啟狀態
const popoverVisible = ref(false)

const emit = defineEmits(['update:filter-submit'])

// 代理帳號 options
const selectAcountOptions = ref([
  {
    value: '',
    label: t('common.select_all'),
    selected: true
  }
])

// 會員層級 options
const selectLevelOptions = ref([
  {
    value: '',
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
  selectAcount: '', //代理帳號
  selectLevel: '', //會員層級
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
    selectAcountOptions.value.push({
      value: item,
      label: item
    })
  })

  // 會員層級
  user_level.forEach((item) => {
    selectLevelOptions.value.push({
      value: item['user_level_id'],
      label: item['user_level_name']
    })
  })
}

// csv 上傳成功
const handleCsvSuccess = (result) => {
  form['custom_user_list'] = []
  form['custom_user_list'] = result
  handleSubmitClick()
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
      placement="bottom-end"
      :visible="popoverVisible"
      :width="990"
      trigger="click"
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
      <el-row :gutter="15">
        <el-col :span="12" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('data_name.ag_name')">
          </SectionTitle>
          <el-select
            v-model="form.selectAcount"
            class="cdp-select w-full"
            popper-class="cdp-select-popper"
            filterable
            :disabled="formDisabled"
          >
            <el-option
              v-for="item in selectAcountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :selected="item.selected"
            />
          </el-select>
        </el-col>
        <el-col :span="12" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('data_name.user_level')">
          </SectionTitle>
          <el-select
            v-model="form.selectLevel"
            class="cdp-select w-full"
            popper-class="cdp-select-popper"
            filterable
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
        <el-col :span="12" class="mb-15">
          <div class="flex items-start mb-8">
            <el-checkbox
              v-model="form.isActivedDateCheck"
              :label="t('data_name.active_date')"
              class="cdp-checkbox checkbox-label"
            />
            <!-- <SectionTitle class="cdp-text-purple ml-10" :title="t('data_name.active_date')">
            </SectionTitle> -->
          </div>
          <DatepickerRange
            v-model="form.activatedDate"
            :config="10"
            :shortcutsConfig="3"
            :enabledThreeMonth="false"
            :rangeEndDate="0"
            :disabled="formDisabled || !form.isActivedDateCheck"
            class="w-full filter-datepicker"
          />
        </el-col>
        <el-col :span="12" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('data_name.register_date')">
          </SectionTitle>
          <DatepickerRange
            v-model="form.registerDate"
            :config="2"
            :shortcutsConfig="2"
            :enabledThreeMonth="false"
            :rangeEndDate="0"
            :disabled="formDisabled"
            class="w-full filter-datepicker"
          />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('data_name.member_name')">
            <template #tooltip>
              {{ $t('customer_tag_list.search_by_member_name') }}
            </template>
          </SectionTitle>
          <el-input
            v-model="form.member"
            class="cdp-input"
            :placeholder="t('common.input_member_name_search')"
          />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('common.include_tags')">
          </SectionTitle>
          <FilterTag v-model="form.searchTag" :disabled="formDisabled" />
        </el-col>
        <el-col :span="24" class="mb-15">
          <SectionTitle class="cdp-text-purple mb-10" :title="t('common.exclude_tags')">
          </SectionTitle>
          <FilterTag v-model="form.excludeTag" :disabled="formDisabled" />
        </el-col>
      </el-row>
      <div class="drop">
        <div class="drop__item">
          <ImportCSV
            v-model="useCustomList"
            class="mr-20"
            :csvType="1"
            @update:success="handleCsvSuccess"
          />
          <FuzzySwitchWithTooltip v-model="form.fuzzySearch" />
        </div>
        <div class="drop__item">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleSubmitClick"
            :name="t('common.filter')"
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
</style>
<style lang="scss">
.checkbox-label {
  .el-checkbox {
    &__label {
      font-size: 16px;
      font-weight: 500;
      color: $purple;
    }
    &__input {
      &.is-checked {
        & + .el-checkbox {
          &__label {
            color: $purple;
          }
        }
      }
    }
  }
}
.filter-datepicker {
  .el-date-editor {
    width: 100%;
    height: 36px;
  }
}
</style>
