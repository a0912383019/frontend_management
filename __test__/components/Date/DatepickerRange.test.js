import { it, describe, expect, afterEach, vi } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ElementPlus from 'element-plus'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import { i18n } from '@/global/i18n'
import { useDateStore } from '@/stores/dateConfig.js'

describe('DatepickerRange', () => {
  let wrapper = null
  let dateStore = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('rangeDate', () => {
    wrapper = mount(DatepickerRange, {
      global: {
        plugins: [
          i18n,
          router,
          ElementPlus,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      props: {
        shortcutsConfig: 1,
        config: 1
      }
    })
    dateStore = useDateStore()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    const modelValue =
      dateStore.date_range_picker_config_1.startDate.format('YYYY-MM-DD') +
      ' ~ ' +
      dateStore.date_range_picker_config_1.endDate.format('YYYY-MM-DD')
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(modelValue)
    expect(wrapper.vm.dateValueStartDate).toBe(dateStore.date_range_picker_config_1.startDate)
    expect(wrapper.vm.dateValueEndDate).toBe(dateStore.date_range_picker_config_1.endDate)

    const dateValue = [
      dateStore.date_range_picker_config_1.startDate,
      dateStore.date_range_picker_config_1.endDate
    ]
    expect(wrapper.vm.dateValue).toStrictEqual(dateValue)
    expect(wrapper.vm.dateMinDate).toBe(dateStore.date_range_picker_config_1.minDate)
    expect(wrapper.vm.dateMaxDate).toBe(dateStore.date_range_picker_config_1.maxDate)
    expect(wrapper.vm.shortcuts).toBe(dateStore.shortcutsConfig1())
    expect(wrapper.vm.selectDate).toStrictEqual(dateValue)
  })

  // props設定rangeDate，資料是否正確
  it('props sets rangeDate, is the data correct?', async () => {
    wrapper = shallowMount(DatepickerRange, {
      global: {
        plugins: [
          i18n,
          router,
          ElementPlus,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      props: {
        rangeDate: '2023-09-07 ~ 2023-10-04',
        shortcutsConfig: 2,
        config: 7
      }
    })
    dateStore = useDateStore()

    expect(wrapper.vm.dateValue).toStrictEqual(['2023-09-07 ', ' 2023-10-04'])
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('2023-09-07 ~ 2023-10-04')
    expect(wrapper.vm.dateMinDate).toBe(dateStore.date_range_picker_config_7.minDate)
    expect(wrapper.vm.dateMaxDate).toBe(dateStore.date_range_picker_config_7.maxDate)
    expect(wrapper.vm.shortcuts).toBe(dateStore.shortcutsConfig2())
    expect(wrapper.vm.selectDate).toStrictEqual(['2023-09-07 ', ' 2023-10-04'])

    //清除dateValue，觸發watch後資料是否正確
    wrapper.vm.dateValue = null
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectDate).toBe(null)
  })
})
