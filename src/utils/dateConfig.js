import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

// Date range picker 固定設定
const date_ranges_quick_select_config_1 = {}
const date_ranges_quick_select_config_2 = {}
const date_ranges_quick_select_config_3 = {}
const date_ranges_quick_select_config_4 = {}

const date_locale_config = {
  separator: ' ~ ' //日期區間分隔符號
}

// config_1 : 預設選取近1個月，最早可選至3年前，最晚可選至前一日
export const date_range_picker_config_1 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(1, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(1, 'day'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_1,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_2 : 預設選取近20年，最早可選至20年前，最晚可選至前一日
export const date_range_picker_config_2 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(20, 'year'), //預設起始時間
  endDate: dayjs(), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(20, 'year'), //限制最小可選日期
  maxDate: dayjs(), //限制最大可選日期
  ranges: date_ranges_quick_select_config_3,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_3 : 預設選取未來2週，最早可選至3年前，最晚可選至1年後
export const date_range_picker_config_3 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs(), //預設起始時間
  endDate: dayjs().add(14, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').add(1, 'year'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_2,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_4 : 單日期模式，預設選前2日，最早可選至3年前，最晚可選至前2日
export const date_range_picker_config_4 = {
  autoApply: true, //點選後是否自動應用日期
  singleDatePicker: true, //是否為單日期模式
  startDate: dayjs().startOf('day').subtract(2, 'day'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(2, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(2, 'day'), //限制最大可選日期
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_5 : 預設選取近1個月，最早可選至3年前，最晚可選至前一日，無快速選單
export const date_range_picker_config_5 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(1, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(1, 'day'), //限制最大可選日期
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_6 : 預設選取近2個月，最早可選至3年前，最晚可選至1年後
export const date_range_picker_config_6 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(2, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').add(0, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').add(1, 'year'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_2,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_7 : 預設選取近一週，最早可選至3年前，最晚可選至前一日
export const date_range_picker_config_7 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().startOf('day').subtract(7, 'day'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(1, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(1, 'day'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_1,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_8 : 預設選取近一週，最早可選至3年前，最晚可選至當日
export const date_range_picker_config_8 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().startOf('day').subtract(7, 'day'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(0, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(0, 'day'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_1,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_9 : 預設選取近一個月，最早可選至3年前，最晚可選至前一日，一次最多只能選取三個月，無快速選單
export const date_range_picker_config_9 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(1, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(1, 'day'), //限制最大可選日期
  maxSpan: {
    months: 3
  },
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_10 : 預設選取近一個月，最早可選至3年前，最晚可選至前一日，一次最多只能選取一年
export const date_range_picker_config_10 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs(), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs(), //限制最大可選日期
  maxSpan: {
    year: 1
  },
  ranges: date_ranges_quick_select_config_4,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_11 : 預設選取近1個月，最早可選至3年前，最晚可選至前二日
export const date_range_picker_config_11 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(2, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(2, 'day'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_1,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_12 : 預設選取前後一個月，最早可選至20年前，最晚可選至一年後
export const date_range_picker_config_12 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').add(1, 'month'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').add(1, 'year'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_2,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// config_13 : 預設選取近3個月，最早可選至3年前，最晚可選至前一日
export const date_range_picker_config_13 = {
  autoApply: true, //點選後是否自動應用日期
  startDate: dayjs().add(1, 'day').subtract(3, 'month'), //預設起始時間
  endDate: dayjs().startOf('day').subtract(1, 'day'), //預設結束時間
  minDate: dayjs().add(1, 'day').subtract(3, 'year'), //限制最小可選日期
  maxDate: dayjs().startOf('day').subtract(1, 'day'), //限制最大可選日期
  ranges: date_ranges_quick_select_config_1,
  locale: date_locale_config,
  showDropdowns: true,
  linkedCalendars: false
}

// 近1週、近2週、近1個月、近2個月、近3個月
export const shortcutsConfig1 = ({ rangeEndDate }) => {
  const { t } = useI18n()
  return [
    {
      text: t('date_range_picker.last_week'),
      value: () => {
        return [dayjs().subtract(7, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_two_weeks'),
      value: () => {
        return [dayjs().subtract(14, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_month'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(1, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_two_months'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(2, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_three_months'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(3, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    }
  ]
}

// 近1週、近2週、近1個月、近1年、近3年、近5年、近20年
export const shortcutsConfig2 = ({ rangeEndDate }) => {
  const { t } = useI18n()
  return [
    {
      text: t('date_range_picker.last_week'),
      value: () => {
        return [dayjs().subtract(7, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_two_weeks'),
      value: () => {
        return [dayjs().subtract(14, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_month'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(1, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_year'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(1, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_three_years'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(3, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_five_years'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(5, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_twenty_years'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(20, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    }
  ]
}

// 近1週、近2週、近1個月、近2個月、近3個月、近半年、近1年、近2年、近3年
export const shortcutsConfig3 = ({ rangeEndDate }) => {
  const { t } = useI18n()
  return [
    {
      text: t('date_range_picker.last_week'),
      value: () => {
        return [dayjs().subtract(7, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_two_weeks'),
      value: () => {
        return [dayjs().subtract(14, 'day'), dayjs().startOf('day').subtract(rangeEndDate, 'day')]
      }
    },
    {
      text: t('date_range_picker.last_month'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(1, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_two_months'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(2, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_three_months'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(3, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_six_months'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(6, 'month'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_year'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(1, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_two_years'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(2, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    },
    {
      text: t('date_range_picker.last_three_years'),
      value: () => {
        return [
          dayjs().add(1, 'day').subtract(3, 'year'),
          dayjs().startOf('day').subtract(rangeEndDate, 'day')
        ]
      }
    }
  ]
}
