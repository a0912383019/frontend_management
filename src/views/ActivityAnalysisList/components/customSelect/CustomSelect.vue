<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryPromotionList } from '@/api'
import { useGlobalStore, useDateStore } from '@/stores'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import { dayjs } from 'element-plus'
import { ElNotification } from 'element-plus'
import { formatDate } from '@/utils/commonUtils.js'

const { t } = useI18n()

const props = defineProps({
  isValid: {
    type: Boolean,
    default: true
  },
  promotionData: {
    type: Object,
    default: {}
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dateStore = useDateStore()
const { shortcutsConfig3 } = dateStore

const emit = defineEmits(['update:promotion', 'update:activityDate'])

const duration = ref('')

const apiSuccess = ref(false)
const showDatePicker = ref(true)

const selectPromotionRef = ref(null)
const selectDateRef = ref(null)

const promotionList = ref('')
const promotionOptions = ref([])
const promotionReturnMsg = ref(t('activity_analysis.reselect_activity_start_date'))

const getPromotionList = (val) => {
  const selectDate =
    dayjs(val[0]).format(t('date.format_date_rule')) +
    ' ~ ' +
    dayjs(val[1]).format(t('date.format_date_rule'))
  promotionReturnMsg.value = promotionReturnMsg.value + ` --- ${selectDate} --- `
  showDatePicker.value = false
  promotionOptions.value = []
  queryPromotionList()
}

// 取得優惠活動
const queryPromotionList = async (infoStartDate = null, infoEndDate = null) => {
  apiSuccess.value = false
  let start_date = dayjs(duration.value[0]).format('YYYY-MM-DD')
  let end_date = dayjs(duration.value[1]).format('YYYY-MM-DD')

  try {
    const result = await apiQueryPromotionList({
      hall_name: activeHall.hall_code,
      start_date: infoStartDate ? infoStartDate : start_date,
      end_date: infoEndDate ? infoEndDate : end_date
    })

    const { return_code } = result.data.status
    if (return_code === '0000' && result.data.result.length !== 0) {
      promotionOptions.value = generateOptions(result.data.result)
    } else {
      ElNotification({
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  } finally {
    apiSuccess.value = true
    await nextTick()
    if (
      props.promotionData.offer_id === null &&
      props.promotionData.original_id === null
    ) {
      selectPromotionRef.value.toggleMenu()
    }
  }
}

const generateOptions = (arr) => {
  let options = []

  arr.forEach((val) => {
    let optionValue = JSON.stringify(val)

    // 把活動分析明細的子活動資料傳過來
    if (props.promotionData.disabled) {
      if (
        val.offer_id === props.promotionData.offer_id &&
        val.original_id === props.promotionData.original_id
      ) {
        promotionList.value = optionValue
      }
    }
    options.push({
      value: optionValue,
      label: val.promotion_name
    })
  })

  return options
}

const handleReturn = async () => {
  promotionReturnMsg.value = t('activity_analysis.select_promotion_activity')
  promotionList.value = ''
  duration.value = ''
  showDatePicker.value = true
  emit('update:activityDate')

  await nextTick()
  selectDateRef.value.handleOpen()
}

const handleChange = () => {
  emit('update:promotion', promotionList.value)
}

onMounted(() => {
  if (props.promotionData.disabled) {
    showDatePicker.value = false
    const infoDate = props.promotionData.activity_date.split('~')
    const infoStartDate = formatDate(infoDate[0].trim())
    const infoEndDate =
      infoDate[1].trim() === '⎻⎻⎻⎻/⎻⎻/⎻⎻' ? '2100-01-01' : formatDate(infoDate[1].trim())

    queryPromotionList(
      infoStartDate,
      infoEndDate,
      props.promotionData.offer_id,
      props.promotionData.original_id
    )
  }
})
</script>
<template>
  <div class="flex flex-col w-full mr-10 text-left">
    <el-date-picker
      v-if="showDatePicker"
      ref="selectDateRef"
      v-model="duration"
      type="daterange"
      range-separator=""
      :start-placeholder="$t('activity_analysis.select_activity_start_date')"
      :shortcuts="shortcutsConfig3()"
      :teleported="false"
      :editable="false"
      class="cdp-datepicker-range cdp-datepicker-range__blue ml-5 mr-5 promotion-date-picker"
      :class="{ 'is-error': !props.isValid }"
      :popper-class="'cdp-datepicker-range-popper cdp-datepicker-range-popper__blue'"
      @change="getPromotionList"
      @keydown.enter="($event) => $event.preventDefault()"
    />
    <div class="w-full text-left ml-5 mr-5" v-else>
      <div class="loading" v-if="!apiSuccess">
        <LoadingBox color="blue" size="sm" />
      </div>
      <div v-else>
        <el-select
          v-model="promotionList"
          :placeholder="$t('activity_analysis.select_promotion_activity')"
          class="cdp-select cdp-select__blue"
          :class="{ 'is-error': !props.isValid }"
          ref="selectPromotionRef"
          popper-class="cdp-select-popper__blue popper-promotion"
          filterable
          :fallback-placements="['bottom-end', 'top-end']"
          :teleported="true"
          @change="handleChange"
        >
          <template #header>
            <div class="w-full h-full ml-10 mr-15">
              <div class="flex font-size-14" @click="handleReturn">
                <div class="mr-10">
                  <font-awesome-icon icon="fa-solid fa-angle-left" />
                </div>
                {{ promotionReturnMsg }}
              </div>
            </div>
          </template>
          <el-option
            v-for="item in promotionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :selected="item.selected"
          />
        </el-select>
      </div>
    </div>
    <div v-if="!props.isValid" class="cdp-text-candypink font-size-12 line-1-5 ml-5">
      {{ $t('activity_analysis.blank_promotion_error_msg') }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  z-index: 2098;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 38px;
}
</style>
<style lang="scss">
.promotion-date-picker {
  .el-range-input {
    text-align: left;
    padding-left: 10px;
    width: 100%;
  }
  &.cdp-datepicker-range.el-date-editor.el-input__wrapper {
    &.is-error {
      box-shadow: 0 0 0 1px #f56c6c inset !important;
      &:hover {
        box-shadow: 0 0 0 1px #f56c6c inset !important;
      }
    }
  }
}
.popper-promotion {
  &.cdp-select-popper__blue {
    .el-select-dropdown {
      min-width: 522px !important;
      max-width: 722px !important;
    }
  }
  .el-select-dropdown {
    &__header {
      cursor: pointer;
      padding: 6px;
      color: rgb(174, 174, 174);
      &:hover {
        color: $blue;
        background-color: rgba($blue, 0.08);
      }
    }
    &__item {
      white-space: normal;
      overflow: unset;
      height: auto;
      span {
        padding-right: 10px;
      }
    }
  }
}
</style>
