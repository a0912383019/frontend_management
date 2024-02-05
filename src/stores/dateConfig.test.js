import { it, describe, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

describe('useSystemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct values', async () => {
    let system_config = {
      server_time: '2020-08-23 00:08:05'
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))
    const store = useDateStore()

    //server time + 12 > 5.前減兩天
    const lastDate = dayjs(system_config.server_time).add(12, 'hour').subtract(2, 'day')
    expect(store.LAST_DATE).toEqual(lastDate)

    sessionStorage.clear()

    //server time + 12 > 5.後減一天
    system_config.server_time = '2023-11-15 06:22:17'
    sessionStorage.setItem('system_config', JSON.stringify(system_config))

    store.updateDate()
    const newLastDate = dayjs(system_config.server_time).add(12, 'hour').subtract(1, 'day')
    expect(store.LAST_DATE).toEqual(newLastDate)

    const minDate = dayjs('2021/04/01')
    const date_range_picker_config_1 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(1, 'month'),
      endDate: newLastDate,
      minDate: minDate,
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_1).toEqual(date_range_picker_config_1)

    const date_range_picker_config_2 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(3, 'month'),
      endDate: newLastDate,
      minDate: dayjs(newLastDate).subtract(20, 'year'),
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_2).toEqual(date_range_picker_config_2)

    const date_range_picker_config_3 = {
      startDate: newLastDate,
      endDate: dayjs(newLastDate).add(14, 'day'),
      minDate: minDate,
      maxDate: dayjs(newLastDate).add(1, 'year')
    }
    expect(store.date_range_picker_config_3).toEqual(date_range_picker_config_3)

    const date_range_picker_config_4 = {
      singleDatePicker: true,
      endDate: newLastDate,
      minDate: minDate,
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_4).toEqual(date_range_picker_config_4)

    const date_range_picker_config_5 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(1, 'month'),
      endDate: dayjs(newLastDate).add(1, 'month'),
      minDate: minDate,
      maxDate: dayjs(newLastDate).add(1, 'year')
    }
    expect(store.date_range_picker_config_5).toEqual(date_range_picker_config_5)

    const date_range_picker_config_6 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(2, 'month'),
      endDate: newLastDate,
      minDate: minDate,
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_6).toEqual(date_range_picker_config_6)

    const date_range_picker_config_7 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(3, 'month'),
      endDate: newLastDate,
      minDate: minDate,
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_7).toEqual(date_range_picker_config_7)

    const date_range_picker_config_8 = {
      startDate: dayjs(newLastDate).add(1, 'day').subtract(7, 'day'),
      endDate: newLastDate,
      minDate: minDate,
      maxDate: newLastDate
    }
    expect(store.date_range_picker_config_8).toEqual(date_range_picker_config_8)

    const shortcutsConfig1 = [
      { text: '近1週', value: expect.any(Function) },
      { text: '近2週', value: expect.any(Function) },
      { text: '近1個月', value: expect.any(Function) },
      { text: '近2個月', value: expect.any(Function) },
      { text: '近3個月', value: expect.any(Function) }
    ]
    expect(store.shortcutsConfig1()).toEqual(shortcutsConfig1)
    const shortcutsConfig1Value = [
      [dayjs(newLastDate).add(1, 'day').subtract(7, 'day'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(14, 'day'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(1, 'month'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(2, 'month'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(3, 'month'), newLastDate]
    ]
    shortcutsConfig1Value.forEach((value, idx) => {
      expect(store.shortcutsConfig1()[idx].value()).toEqual(value)
    })

    const shortcutsConfig2 = [
      { text: '近1週', value: expect.any(Function) },
      { text: '近2週', value: expect.any(Function) },
      { text: '近1個月', value: expect.any(Function) },
      { text: '近1年', value: expect.any(Function) },
      { text: '近3年', value: expect.any(Function) },
      { text: '近5年', value: expect.any(Function) },
      { text: '近20年', value: expect.any(Function) }
    ]
    expect(store.shortcutsConfig2()).toEqual(shortcutsConfig2)
    const shortcutsConfig2Value = [
      [dayjs(newLastDate).subtract(7, 'day'), newLastDate],
      [dayjs(newLastDate).subtract(14, 'day'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(1, 'month'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(1, 'year'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(3, 'year'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(5, 'year'), newLastDate],
      [dayjs(newLastDate).add(1, 'day').subtract(20, 'year'), newLastDate]
    ]
    shortcutsConfig2Value.forEach((value, idx) => {
      expect(store.shortcutsConfig2()[idx].value()).toEqual(value)
    })
  })
})
