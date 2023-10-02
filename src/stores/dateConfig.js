import { reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { getSessionStorageEntity } from '@/utils/commonUtils'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Taipei')

export const useDateStore = defineStore('dateStore', () => {
  const route = useRoute()

  const getServerTime = () => {
    if (sessionStorage.getItem('system_config') !== null) {
      // server回傳的美東時間，由API system_config 取得
      return dayjs(getSessionStorageEntity('system_config')['server_time'])
    } else {
      // 若api還沒回傳先使用client端的美東時間當作預設
      return dayjs().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
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

  // 切換路由更新最新時間
  watch(route, () => {
    if (route.name !== 'Login' && sessionStorage.getItem('system_config') !== null) {
      updateDate()
    }
  })

  // config_1 : 預設選取近1個月 (原：1, 5, 9, 10, 11)
  const date_range_picker_config_1 = reactive({
    startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  })

  // config_2 : 預設選取近20年
  const date_range_picker_config_2 = {
    startDate: dayjs().add(1, 'day').subtract(20, 'year'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: dayjs().subtract(20, 'year'), //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  }

  // config_3 : 預設選取未來2週
  const date_range_picker_config_3 = {
    startDate: dayjs(), //預設起始時間
    endDate: dayjs().add(14, 'day'), //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: dayjs().startOf('day').add(1, 'year') //限制最大可選日期
  }

  // config_4 : 單日期模式，預設選前2日
  const date_range_picker_config_4 = {
    singleDatePicker: true, //是否為單日期模式
    startDate: dayjs().startOf('day').subtract(2, 'day'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  }

  // config_5 : 預設選取前後一個月，最早可選至20年前，最晚可選至一年後
  const date_range_picker_config_5 = {
    startDate: dayjs().add(1, 'day').subtract(1, 'month'), //預設起始時間
    endDate: dayjs().startOf('day').add(1, 'month'), //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: dayjs().startOf('day').add(1, 'year') //限制最大可選日期
  }

  // config_6 : 預設選取近2個月
  const date_range_picker_config_6 = {
    startDate: dayjs().add(1, 'day').subtract(2, 'month'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  }

  // config_7 : 預設選取近3個月
  const date_range_picker_config_7 = {
    startDate: dayjs().add(1, 'day').subtract(3, 'month'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  }

  // config_8 : 預設選取近一週
  const date_range_picker_config_8 = {
    startDate: dayjs().startOf('day').subtract(7, 'day'), //預設起始時間
    endDate: LAST_DATE, //預設結束時間
    minDate: MIN_DATE, //限制最小可選日期
    maxDate: LAST_DATE //限制最大可選日期
  }

  // 近1週、近2週、近1個月、近2個月、近3個月
  const shortcutsConfig1 = () => {
    const { t } = useI18n()
    return [
      {
        text: t('date_range_picker.last_week'),
        value: () => {
          return [dayjs().subtract(7, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_weeks'),
        value: () => {
          return [dayjs().subtract(14, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_month'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(1, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_months'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(2, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_three_months'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(3, 'month'), LAST_DATE.value]
        }
      }
    ]
  }

  // 近1週、近2週、近1個月、近1年、近3年、近5年、近20年
  const shortcutsConfig2 = () => {
    const { t } = useI18n()
    return [
      {
        text: t('date_range_picker.last_week'),
        value: () => {
          return [dayjs().subtract(7, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_two_weeks'),
        value: () => {
          return [dayjs().subtract(14, 'day'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_month'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(1, 'month'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_year'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(1, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_three_years'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(3, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_five_years'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(5, 'year'), LAST_DATE.value]
        }
      },
      {
        text: t('date_range_picker.last_twenty_years'),
        value: () => {
          return [dayjs().add(1, 'day').subtract(20, 'year'), LAST_DATE.value]
        }
      }
    ]
  }

  return {
    date_range_picker_config_1,
    date_range_picker_config_2,
    date_range_picker_config_3,
    date_range_picker_config_4,
    date_range_picker_config_5,
    date_range_picker_config_6,
    date_range_picker_config_7,
    date_range_picker_config_8,
    shortcutsConfig1,
    shortcutsConfig2
  }
})
