import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { dayjs } from 'element-plus'
import ElementPlus from 'element-plus'
import Datepicker from '@/components/Date/Datepicker.vue'

describe('Datepicker', () => {
  let wrapper = null
  let classColor = 'blue'

  beforeEach(() => {
    wrapper = shallowMount(Datepicker, {
      global: {
        plugins: [
          ElementPlus,
          i18n,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      props: {
        classColor
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('handleDateChange', () => {
    const resultDate = dayjs(wrapper.vm.singleDateValue).format('YYYY/MM/DD')
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[resultDate]])
    expect(wrapper.emitted('change')).toStrictEqual([[resultDate]])
  })

  it('disabledDate', () => {
    const result1 = wrapper.vm.disabledDate('2022-04-01')
    expect(result1).toBeFalsy()

    const result2 = wrapper.vm.disabledDate('1980-04-01')
    expect(result2).toBeTruthy()
  })

  it('handleCalendarChange', () => {
    wrapper.vm.handleCalendarChange('test')
    expect(wrapper.vm.selectDate).toBe('test')
  })

  it('Testing for Non-Empty popperClass', () => {
    expect(wrapper.vm.popperClass).toBe(
      `cdp-datepicker-single-popper cdp-datepicker-single-popper__${classColor}`
    )
  })

  it('Testing for Empty popperClass', () => {
    wrapper = shallowMount(Datepicker, {
      global: {
        plugins: [ElementPlus, i18n]
      },
      props: {
        classColor: ''
      }
    })
    expect(wrapper.vm.popperClass).toBe(`cdp-datepicker-single-popper`)
  })

  it('Testing formatDate Value for props.type=date', () => {
    expect(wrapper.vm.formatDate).toBe('YYYY/MM/DD')
  })

  it('Testing formatDate Value for props.type=month', () => {
    wrapper = shallowMount(Datepicker, {
      global: {
        plugins: [ElementPlus, i18n]
      },
      props: {
        type: 'month'
      }
    })
    expect(wrapper.vm.formatDate).toBe('YYYY/MM')
  })

  it('watch singleDateValue', async () => {
    wrapper.vm.singleDateValue = null
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectDate).toBe(null)
  })
})
