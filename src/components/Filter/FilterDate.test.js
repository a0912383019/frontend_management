import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import router from '@/router'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useDateStore } from '@/stores/dateConfig.js'
import FilterDate from '@/components/Filter/FilterDate.vue'
import CdpIcon from '@/components/CdpIcon.vue'

describe('FilterDate', () => {
  let wrapper = null
  let dateStore = null

  beforeEach(() => {
    wrapper = shallowMount(FilterDate, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      },
      props: {
        config: 11
      }
    })
    dateStore = useDateStore()
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 驗證props config日期
  it('expect date with props config', () => {
    expect(wrapper.vm.dateValueStartDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_1.startDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateValueEndDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_1.endDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateMinDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_1.minDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateMaxDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_1.maxDate.format('YYYY-MM-DD')
    )
  })

  // 修改props config驗證日期是否正確
  it('change props config', () => {
    wrapper = shallowMount(FilterDate, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      },
      props: {
        config: 7
      }
    })

    expect(wrapper.vm.dateValueStartDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_7.startDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateValueEndDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_7.endDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateMinDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_7.minDate.format('YYYY-MM-DD')
    )
    expect(wrapper.vm.dateMaxDate.format('YYYY-MM-DD')).toBe(
      dateStore.date_range_picker_config_7.maxDate.format('YYYY-MM-DD')
    )
  })

  //如果props rangedate有值，優先使用
  it('props rangeDate', () => {
    wrapper = shallowMount(FilterDate, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      },
      props: {
        rangeDate: '2023-07-29 ~ 2023-10-28'
      }
    })

    expect(wrapper.vm.dateValueStartDate).toBe('2023-07-29')
    expect(wrapper.vm.dateValueEndDate).toBe('2023-10-28')
  })

  it('disabledDate', async () => {
    // 選擇日期小於最小日期（可選最小日期：鎖定 2021/04/01 (註冊日期例外)）
    expect(wrapper.vm.disabledDate('2021/3/10')).toBe(true)

    // 選擇小於三個月的日期，預期會得到fasle
    wrapper.vm.selectDate = ['2023/7/1', null]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.disabledDate('2023/7/10')).toBe(false)

    // 選擇大於三個月的日期，預期會得到true
    wrapper.vm.selectDate = ['2023/7/1', null]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.disabledDate('2023/11/10')).toBe(true)
  })

  // 選擇日期後將日期放入
  it('handleCalendarChange function', () => {
    let date = ['2023/07/01', '2023/07/10']
    wrapper.vm.handleCalendarChange(date)
    expect(wrapper.vm.selectDate).toStrictEqual(date)
  })

  // handleClick
  it('handleClick', () => {
    wrapper.vm.handleClick()
    let emitStartDate = wrapper.emitted('update:timestamp')[0][0]['rangeDate'].split('~')[0].trim()
    expect(emitStartDate).toBe(dateStore.date_range_picker_config_1.startDate.format('YYYY-MM-DD'))
  })

  // 當使用者清空日曆後，將selectDate一併清空
  it('watch dateValue change', async () => {
    wrapper.vm.dateValue = null
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectDate).toBe(null)
  })
})
