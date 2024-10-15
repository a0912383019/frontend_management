<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryListActiveLimit } from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import FuzzySwitchWithTooltip from '@/components/Switch/FuzzySwitchWithTooltip.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//popover 開啟狀態
const popoverVisible = ref(false)

const emit = defineEmits(['update:filter-submit'])

// 分析區間 options
const selectAccountOptions = computed(() => {
  return [
    {
      value: '0',
      label: t('tag_synchronization.activity_date_cycle_week'),
      selected: true
    },
    {
      value: '0',
      label: t('tag_synchronization.activity_date_cycle_week'),
      selected: true
    }
  ]
})

// 達檻狀態 options
const selectLevelOptions = ref([
  {
    value: '0',
    label: t('tag_synchronization.activity_date_cycle_week'),
    selected: true
  }
])

const form = reactive({
  hall_name: '',
  start_search_year: '',
  start_search_month: '',
  start_search_week: '',
  start_date: '',
  end_search_year: '',
  end_search_month: '',
  end_search_week: '',
  end_date: '',
  cut_type: '',
  reward_flag: '',
  reward_date_flag: 0,
  search_activity: []
})

const handleSubmitClick = () => {
  popoverVisible.value = false
  emit('update:filter-submit', form)
  closePopover()
}

// 取得代理帳號和會員層級
const queryAgNameUserLevel = async () => {
  try {
    const result = await apiQueryListActiveLimit({
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
            class="cdp-select cdp-select__purple w-full"
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
            :title="$t('data_name.register_date')"
          >
          </SectionTitle>
          <DatepickerRange
            v-model="form.registerDate"
            :config="2"
            :shortcutsConfig="1"
            :disabled="formDisabled"
            class="w-full filter-datepicker custom-tag-date-picker"
            classColor="purple"
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
            class="cdp-select cdp-select__purple w-full"
            popper-class="cdp-select-popper cdp-select-popper__purple"
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
          <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('data_name.ag_name')">
          </SectionTitle>
          <el-select-v2
            v-model="form.selectAcount"
            class="cdp-select cdp-select__purple w-full"
            popper-class="cdp-select-popper cdp-select-popper__purple"
            filterable
            :teleported="false"
            :disabled="formDisabled"
            :options="selectAccountOptions"
          />
        </el-col>

        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('activity_analysis.activity_name')"
          >
          </SectionTitle>
          <SelectTag v-model="form.searchTag" />
        </el-col>
      </el-row>
      <div class="drop">
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
    inset: 147px -13px auto auto !important;
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
