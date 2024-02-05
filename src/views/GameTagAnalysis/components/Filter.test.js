import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import Filter from '@/views/GameTagAnalysis/components/Filter.vue'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import ElementPlus from 'element-plus'

describe('Filter', () => {
  let wrapper = null
  let gameTagAnalysisStore
  const date = new Date(2000, 1, 1, 13)

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    gameTagAnalysisStore = useGameTagAnalysis(pinia)
    vi.useFakeTimers()
    vi.setSystemTime(date)
  })

  afterEach(() => {
    wrapper.unmount()
    vi.useRealTimers()
  })

  // 測試api資料
  it('expect mock api', async () => {
    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.vm.filterFormData).toStrictEqual({
      date: '',
      excludeTag: '',
      searchTag: ''
    })

    const form = {
      date: '2023-11-04 ~ 2023-12-03',
      excludeTag: '40030',
      searchTag: '10001;40001'
    }
    //reactive必須單獨給key賦值
    wrapper.vm.form.date = form.date
    wrapper.vm.form.excludeTag = form.excludeTag
    wrapper.vm.form.searchTag = form.searchTag
    const popoverHide = vi.fn()
    wrapper.vm.$refs.popover.hide = popoverHide
    await wrapper.vm.handleSubmitClick()
    expect(gameTagAnalysisStore.filterTimestamp).toStrictEqual(date.getTime())
    expect(wrapper.vm.filterTimestamp).toStrictEqual(date.getTime())
    expect(wrapper.vm.filterFormData).toStrictEqual(form)
    expect(popoverHide).toHaveBeenCalled()
  })
})
