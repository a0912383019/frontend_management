<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { userTypeConfig, userStatusConfig } = storeToRefs(globalStore)

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const emit = defineEmits(['searchAccount'])

const selectUserTypeOptions = computed(() => {
  return appendOptions(userTypeConfig.value)
})

const selectUserStatusOptions = computed(() => {
  return appendOptions(userStatusConfig.value)
})

const appendOptions = (obj) => {
  let options = [
    {
      value: 'all',
      label: t('common.select_all'),
      selected: true
    }
  ]
  const keys = Object.keys(obj)

  keys.forEach((key) => {
    options.push({
      value: key,
      label: obj[key]
    })
  })

  return options
}

const form = reactive({
  userName: '',
  userType: 'all',
  userStatus: 'all',
  lastLoginTime: ''
})

const isLastLoginTimeCheck = ref(false)

// 確認篩選
const handleClick = () => {
  let filterData = { ...form }
  if (!isLastLoginTimeCheck.value) {
    filterData.lastLoginTime = null
  }

  emit('searchAccount', filterData)
  closePopover()
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
        <el-row :gutter="15">
          <el-col :span="12" class="mb-17">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('user_detail_info.account_name') + ' | ' + $t('data_name.email')"
            >
            </SectionTitle>
            <el-input
              v-model="form.userName"
              class="cdp-input__purple"
              :placeholder="$t('admin_user.input_account_name_or_email_to_search')"
            />
          </el-col>
          <el-col :span="12" class="mb-17">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('user_detail_info.user_type')"
            >
            </SectionTitle>
            <el-select
              v-model="form.userType"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
            >
              <el-option
                v-for="item in selectUserTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :selected="item.selected"
              />
            </el-select>
          </el-col>
          <el-col :span="12" class="">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4 mt-3"
              :title="$t('data_name.status')"
            >
            </SectionTitle>
            <el-select
              v-model="form.userStatus"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
            >
              <el-option
                v-for="item in selectUserStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :selected="item.selected"
              />
            </el-select>
          </el-col>
          <el-col :span="12" class="">
            <div class="flex items-start mb-2">
              <el-checkbox
                v-model="isLastLoginTimeCheck"
                :label="$t('user_detail_info.last_login_time')"
                class="cdp-checkbox checkbox-label"
              />
            </div>
            <DatepickerRange
              v-model="form.lastLoginTime"
              :config="8"
              :shortcutsConfig="1"
              :disabled="!isLastLoginTimeCheck"
              class="w-full filter-datepicker admin-date-picker"
              classColor="purple"
            />
          </el-col>
        </el-row>
        <div class="drop__footer mt-5">
          <ButtonIcon
            icon="search"
            size="large large-120"
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
.admin-date-picker {
  :deep(.el-popper.el-picker__popper) {
    inset: 155px 7px auto auto !important;
  }
}
.drop {
  &__search {
    margin-top: 5px;
    margin-bottom: 12px;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
  }
}
:deep(.cdp-select-popper.el-select-dropdown) {
  box-shadow: 0 0 6px rgba(#000, 0.15);
  border-radius: 5px;
}
:deep(.el-checkbox) {
  height: 25px;
}
</style>
