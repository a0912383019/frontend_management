<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegisteredNoDepositAnalysis } from '@/stores/registeredNoDepositAnalysis.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'

const { t, locale: i18nLocale } = useI18n()

const deoositStore = useRegisteredNoDepositAnalysis()

//popover 開啟狀態
const popoverVisible = ref(true)

const emit = defineEmits(['update:filter-submit'])

// 更新時間日期
const updatedTimeDate = ref('')

// 目前存款狀態選取值
const selectDepositValue = ref(deoositStore.selectDepositValue) // 預設 all
// 目前存款狀態 options
const selectDepositOptions = computed(() => {
  return [
    {
      value: 'all',
      label: t('common.select_all'),
      selected: true
    },
    {
      value: 0,
      label: t('register_no_deposit_analysis.not_deposit')
    },
    {
      value: 1,
      label: t('register_no_deposit_analysis.deposited')
    }
  ]
})

// 送出
const handleSubmitClick = () => {
  popoverVisible.value = false

  // 目前存款狀態
  deoositStore.selectDepositValue = selectDepositValue.value
  // 更新時間
  deoositStore.deatilRangeDate = updatedTimeDate.value
  // IP重複次數
  deoositStore.ipDuplicateRange = slideVlaue.value.join(';')

  emit('update:filter-submit')
  closePopover()
}

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const slideVlaue = ref(deoositStore.slideVlaue) // 預設[0, 10]
const marks = reactive({
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90',
  100: '100'
})

const isMax = ref(false)

// 数据改变时触发（使用鼠标拖曳时，活动过程实时触发）
const handleSliderInput = (val) => {
  if (val[1] === 100) {
    nextTick(() => {
      document
        .querySelectorAll('.el-slider__button-wrapper')[1]
        .setAttribute('aria-valuenow', '100+')
    })
  }
  if (val[1] >= 90) {
    isMax.value = true
  } else {
    isMax.value = false
  }
}

onMounted(() => {
  if (slideVlaue.value[1] === 100) {
    nextTick(() => {
      document
        .querySelectorAll('.el-slider__button-wrapper')[1]
        .setAttribute('aria-valuenow', '100+')
    })
  }
})
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="600"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover"
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
        <el-col :span="12" class="mb-15">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-10"
            :title="$t('data_name.updated_time')"
          >
          </SectionTitle>
          <DatepickerRange
            v-model="updatedTimeDate"
            :config="8"
            :shortcutsConfig="1"
            class="w-full filter-datepicker"
            classColor="purple"
          />
        </el-col>
        <el-col :span="12" class="mb-15">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-10"
            :title="$t('register_no_deposit_analysis.deposit_status')"
          >
          </SectionTitle>
          <el-select
            v-model="selectDepositValue"
            class="cdp-select__purple w-full"
            popper-class="cdp-select-popper__purple"
            filterable
            suffix-icon="CaretBottom"
            :teleported="false"
          >
            <el-option
              v-for="item in selectDepositOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :selected="item.selected"
            />
          </el-select>
        </el-col>
        <el-col :span="24">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-18"
            :title="$t('register_no_deposit_analysis.repeated_ip')"
          >
          </SectionTitle>
          <div class="slider-box" :class="{ en: i18nLocale === 'en', isMax: isMax }">
            <div class="slider-box__tag start">0{{ $t('unit.times') }}</div>
            <div class="slider-box__tag end">100+{{ $t('unit.times') }}</div>
            <el-slider
              v-model="slideVlaue"
              range
              show-stops
              class="cdp-el-slider"
              :class="{ en: i18nLocale === 'en' }"
              :show-tooltip="false"
              tooltip-class="filter-tooltip"
              :step="10"
              :marks="marks"
              @input="handleSliderInput"
            />
          </div>
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
  justify-content: flex-end;
  padding-top: 40px;
}
.slider-box {
  position: relative;
  &__tag {
    position: absolute;
    display: inline-block;
    padding: 1px 3px;
    background-color: #e1e4e9;
    color: #9f9f9f;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1;
    &.start {
      left: -2px;
      top: -10px;
    }
    &.end {
      right: -11px;
      top: -10px;
    }
  }
  &.en {
    .slider-box {
      &__tag {
        &.start {
          left: -12px;
        }
        &.end {
          right: -17px;
        }
      }
    }
    &.isMax {
      .slider-box {
        &__tag {
          &.end {
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.cdp-el-slider {
  padding-left: 12px;
  padding-right: 12px;
  &.en {
    .el-slider__button-wrapper {
      &:nth-of-type(2) {
        &::before {
          content: attr(aria-valuenow) ' times';
        }
      }
      &:nth-of-type(3) {
        &::before {
          content: attr(aria-valuenow) ' times';
        }
      }
    }
  }
  .el-slider__button-wrapper {
    &::before {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      height: 16px;
      background-color: #f65668;
      background-position: center top;
      background-repeat: no-repeat;
      border-radius: 4px;
      line-height: 1.2;
      color: #fff;
      font-size: 12px;
      padding: 1px 3px;
      white-space: nowrap;
      letter-spacing: -0.5px;
    }
    &::after {
      content: '';
      position: absolute;
      top: 4px;
      left: 50%;
      margin-left: -3px;
      z-index: -1;
      width: 6px;
      height: 6px;
      transform: rotate(-45deg);
      border-radius: 0 0 0 20%;
      background-color: #f65668;
    }
    &:nth-of-type(2) {
      &::before {
        content: attr(aria-valuenow) ' 次';
      }
    }
    &:nth-of-type(3) {
      &::before {
        content: attr(aria-valuenow) ' 次';
      }
    }
  }
  .el-slider {
    &__runway {
      position: relative;
      height: 11px;
      background-color: transparent;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 100%;
        height: 4px;
        background-image: linear-gradient(
          90deg,
          transparent 0%,
          transparent 32%,
          #e1e4e9 33%,
          #e1e4e9 33%,
          transparent 34%,
          transparent 65%,
          #e1e4e9 66%,
          #e1e4e9 66%,
          transparent 67%,
          transparent 100%
        );
        background-size: 10% 100%;
      }
      &::after {
        content: '';
        position: absolute;
        left: -6px;
        top: 0;
        z-index: -1;
        width: calc(100% + 12px);
        height: 100%;
        background-color: #e1e4e9;
        border-radius: 4px;
      }
    }
    &__button {
      width: 2px;
      height: 15px;
      border-radius: 0%;
      border: none;
      background-color: #e34556;
      transform: translateY(2px);
      transform: translateY(9px);
    }
    &__bar {
      height: 11px;
      background-color: #f65668;
      border-radius: 0;
    }
    &__stop {
      display: none;
    }
    &__marks {
      &-text {
        padding-top: 10px;
        color: #9f9f9f;
        font-size: 12px;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          margin-left: -0.5px;
          top: 0px;
          width: 1px;
          height: 8px;
          background-color: #e1e4e9;
        }
      }
    }
  }
}
</style>
