import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import SelectTagDropdown from '@/components/Filter/SelectTagDropdown.vue'

describe('SelectTagDropdown', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(SelectTagDropdown, {
      global: {
        plugins: [
          i18n,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('expect emmit', () => {
    let obj = { value: 'OR', label: 'OR' }
    wrapper.vm.handleTagAddText(obj)
    expect(wrapper.emitted('update:tagtext')).toStrictEqual([
      [{ value: 'OR', label: 'OR', active: false }]
    ])

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['OR']])
  })
})
