import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import History from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/history/History.vue'

describe('History', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const result = {
      data: {
        result: [
          {
            step: 0,
            before_num: 0,
            current_num: 0,
            after_num: 0
          },
          {
            step: 1,
            before_num: 2529,
            current_num: 2628,
            after_num: 2648
          },
          {
            step: 2,
            before_num: 69,
            current_num: 57,
            after_num: 72
          },
          {
            step: 3,
            before_num: 93,
            current_num: 79,
            after_num: 82
          },
          {
            step: 4,
            before_num: 148,
            current_num: 129,
            after_num: 173
          },
          {
            step: 5,
            before_num: 70,
            current_num: 91,
            after_num: 85
          },
          {
            step: 6,
            before_num: 636,
            current_num: 830,
            after_num: 857
          },
          {
            step: 7,
            before_num: 2199,
            current_num: 2071,
            after_num: 2047
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValue(result)

    wrapper = shallowMount(History, {
      global: {
        plugins: [i18n, createTestingPinia({ createSpy: vi.fn })]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        label: '階段名稱',
        prop: 'step_name',
        headerAlign: 'center',
        align: 'center',
        minWidth: '40%'
      },
      {
        label: '活動前',
        prop: 'activity_before',
        headerAlign: 'center',
        align: 'center',
        minWidth: '20%'
      },
      {
        label: '活動中',
        prop: 'activity_now',
        headerAlign: 'center',
        align: 'center',
        minWidth: '20%'
      },
      {
        label: '活動後',
        prop: 'activity_after',
        headerAlign: 'center',
        align: 'center',
        minWidth: '20%'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('Expected API data in the transform function is correct', async () => {
    expect(spyGet).toBeCalledTimes(1)
    const tableData = [
      {
        step_index: 1,
        activity_before: '2,529',
        activity_now: '2,628',
        activity_after: '2,648'
      },
      {
        step_index: 2,
        activity_before: '69',
        activity_now: '57',
        activity_after: '72'
      },
      {
        step_index: 3,
        activity_before: '93',
        activity_now: '79',
        activity_after: '82'
      },
      {
        step_index: 4,
        activity_before: '148',
        activity_now: '129',
        activity_after: '173'
      },
      {
        step_index: 5,
        activity_before: '70',
        activity_now: '91',
        activity_after: '85'
      },
      {
        step_index: 6,
        activity_before: '636',
        activity_now: '830',
        activity_after: '857'
      },
      {
        step_index: 7,
        activity_before: '2,199',
        activity_now: '2,071',
        activity_after: '2,047'
      }
    ]

    wrapper.vm.apiSuccess = false
    expect(wrapper.vm.apiSuccess).toBe(false)
    wrapper.vm.queryMemberStepChanges()
    await flushPromises()
    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(spyGet).toBeCalledTimes(2)
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })
})
