import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { i18n } from '@/global/i18n'
import { dayjs } from 'element-plus'
import { getSessionStorageEntity } from '@/utils/commonUtils'

export const useDateStore = defineStore('dateStore', () => {
  const getServerTime = () => {
    if (sessionStorage.getItem('system_config') !== null) {
      // server回傳的美東時間，由API system_config 取得
      return dayjs(getSessionStorageEntity('system_config')['server_time'])
    }
  }

  const MIN_DATE = dayjs('2021/04/01') // 可選最小日期：鎖定 2021/04/01 (註冊日期例外)

  const SERVER_TIME = ref(getServerTime()) // 取得時間

  const FRONTEND_TIME = ref(dayjs(SERVER_TIME.value).add(12, 'hour').format('YYYY-MM-DD HH:mm:ss')) // 轉換成前端使用的時間 + 12h

  // 換算可選最大日期
  // 可選最大日期：台灣時間 17:00 切換 17:00前 -2 天，17:00後 -1 天
  const LAST_DATE = ref(
    dayjs(FRONTEND_TIME.value).hour() >= 17
      ? dayjs(FRONTEND_TIME.value).subtract(1, 'day')
      : dayjs(FRONTEND_TIME.value).subtract(2, 'day')
  )

  const updateDate = () => {
    SERVER_TIME.value = getServerTime()
    FRONTEND_TIME.value = dayjs(SERVER_TIME.value).add(12, 'hour').format('YYYY-MM-DD HH:mm:ss')
    LAST_DATE.value =
      dayjs(FRONTEND_TIME.value).hour() >= 17
        ? dayjs(FRONTEND_TIME.value).subtract(1, 'day')
        : dayjs(FRONTEND_TIME.value).subtract(2, 'day')
  }

  // config_1 : 預設選取近1個月 (原：1, 5, 9, 10, 11)
  const date_range_picker_config_1 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(1, 'month'), //預設起始時間
      endDate: LAST_DATE.value, //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_2 : 預設選取近20年
  const date_range_picker_config_2 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(3, 'month'), //預設起始時間
      endDate: LAST_DATE.value, //預設結束時間
      minDate: dayjs(LAST_DATE.value).subtract(20, 'year'), //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_3 : 預設選取未來2週
  const date_range_picker_config_3 = computed(() => {
    return {
      startDate: LAST_DATE.value, //預設起始時間
      endDate: dayjs(LAST_DATE.value).add(14, 'day'), //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: dayjs(LAST_DATE.value).add(1, 'year') //限制最大可選日期
    }
  })

  // config_4 : 單日期模式，預設選前2日
  const date_range_picker_config_4 = computed(() => {
    return {
      singleDatePicker: true, //是否為單日期模式
      endDate: LAST_DATE.value, //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_5 : 預設選取前後一個月，最早可選至20年前，最晚可選至一年後
  const date_range_picker_config_5 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(1, 'month'), //預設起始時間
      endDate: dayjs(LAST_DATE.value).add(1, 'month'), //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: dayjs(LAST_DATE.value).add(1, 'year') //限制最大可選日期
    }
  })

  // config_6 : 預設選取近2個月
  const date_range_picker_config_6 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(2, 'month'), //預設起始時間
      endDate: LAST_DATE.value, //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_7 : 預設選取近3個月
  const date_range_picker_config_7 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(3, 'month'), //預設起始時間
      endDate: LAST_DATE.value, //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_8 : 預設選取近一週
  const date_range_picker_config_8 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).add(1, 'day').subtract(7, 'day'), //預設起始時間
      endDate: LAST_DATE.value, //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // config_9 : 預設選取當月
  const date_range_picker_config_9 = computed(() => {
    return {
      startDate: dayjs(LAST_DATE.value).format('YYYY-MM'), //預設起始時間
      endDate: dayjs(LAST_DATE.value).format('YYYY-MM'), //預設結束時間
      minDate: MIN_DATE, //限制最小可選日期
      maxDate: LAST_DATE.value //限制最大可選日期
    }
  })

  // 近1週、近2週、近1個月、近2個月、近3個月
  const shortcutsConfig1 = () => {
    const { t } = i18n.global
    return [
      {
        text: t('date_range_picker.last_week'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(7, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_weeks'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(14, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_month'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(1, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_months'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(2, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_three_months'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(3, 'month'), LAST_DATE.value]
        }
      }
    ]
  }

  // 近1週、近2週、近1個月、近1年、近3年、近5年、近20年
  const shortcutsConfig2 = () => {
    const { t } = i18n.global
    return [
      {
        text: t('date_range_picker.last_week'),
        value: () => {
          return [dayjs(LAST_DATE.value).subtract(7, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_weeks'),
        value: () => {
          return [dayjs(LAST_DATE.value).subtract(14, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_month'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(1, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_year'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(1, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_three_years'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(3, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_five_years'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(5, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_twenty_years'),
        value: () => {
          return [dayjs(LAST_DATE.value).add(1, 'day').subtract(20, 'year'), LAST_DATE.value]
        }
      }
    ]
  }

  return {
    LAST_DATE,
    updateDate,
    date_range_picker_config_1,
    date_range_picker_config_2,
    date_range_picker_config_3,
    date_range_picker_config_4,
    date_range_picker_config_5,
    date_range_picker_config_6,
    date_range_picker_config_7,
    date_range_picker_config_8,
    date_range_picker_config_9,
    shortcutsConfig1,
    shortcutsConfig2
  }
})
