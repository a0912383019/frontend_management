import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import Detail from '@/views/RegisteredNoDepositAnalysis/components/Detail.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('Detail', () => {
  let wrapper = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    let result = {
      result: {
        data: [
          {
            ag_name: '',
            user_id: 941735068,
            user_name: 'fyj1688',
            register_date: '2019-06-04 17:46:30',
            action_score: '19.9832',
            update_date: '2023-12-03 02:02:44',
            deposit_status: false,
            ip_count: 6
          }
        ],
        records_total: 100
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }

    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/deposit_probability/action_score_detail':
          return Promise.resolve({ data: result })
        default:
          return error
      }
    })

    wrapper = shallowMount(Detail, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('component exists', () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
  })

  it('queryActionScoreDetail', async () => {
    wrapper.vm.queryActionScoreDetail('10;20')
    await flushPromises()

    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(wrapper.vm.apiRecordsTotal).toBe(100)

    wrapper.vm.queryActionScoreDetail()
    await flushPromises()

    expect(wrapper.vm.messageKey).toBe('clickForDetail')
  })

  it('upadteCurrentSort', async () => {
    let data = {
      prop: 'action_score',
      order: 'ascending'
    }
    wrapper.vm.upadteCurrentSort(data)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.querySortRule).toStrictEqual({
      sort: 'action_score',
      order: 'ASC'
    })

    let data2 = {
      prop: 'action_score',
      order: 'descending'
    }
    wrapper.vm.upadteCurrentSort(data2)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.querySortRule).toStrictEqual({
      sort: 'action_score',
      order: 'DESC'
    })
  })

  it('updateCurrentPage', async () => {
    wrapper.vm.updateCurrentPage(2)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.apiDraw).toBe(2)
    expect(wrapper.vm.apiStart).toBe(15)
  })

  it('tableGoToFirstPage', async () => {
    // mock function
    wrapper.vm.$refs.refDetailTable.goToFirstPage = vi.fn()

    wrapper.vm.tableGoToFirstPage()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.apiStart).toBe(0)
    expect(wrapper.vm.$refs.refDetailTable.goToFirstPage).toHaveBeenCalled()
  })
})
