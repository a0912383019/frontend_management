import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import Overview from '@/views/RegisteredNoDepositAnalysis/components/Overview.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

describe('Overview', () => {
  let wrapper = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    let result = {
      data: {
        result: [
          {
            lower: '10',
            upper: '20',
            span_count: 19,
            deposited_total_day: 0,
            deposited_count: 0,
            deposited_ratio: '0',
            deposited_avg_day: '-'
          },
          {
            lower: '20',
            upper: '30',
            span_count: 16,
            deposited_total_day: 0,
            deposited_count: 0,
            deposited_ratio: '0',
            deposited_avg_day: '-'
          },
          {
            lower: '30',
            upper: '40',
            span_count: 8,
            deposited_total_day: 5657,
            deposited_count: 1,
            deposited_ratio: '12.5000',
            deposited_avg_day: '5657.0000'
          },
          {
            lower: '40',
            upper: '50',
            span_count: 4,
            deposited_total_day: 10957,
            deposited_count: 2,
            deposited_ratio: '50.0000',
            deposited_avg_day: '5478.5000'
          },
          {
            lower: '50',
            upper: '60',
            span_count: 8,
            deposited_total_day: 21663,
            deposited_count: 4,
            deposited_ratio: '50.0000',
            deposited_avg_day: '5415.7500'
          },
          {
            lower: '60',
            upper: '70',
            span_count: 4,
            deposited_total_day: 5441,
            deposited_count: 1,
            deposited_ratio: '25.0000',
            deposited_avg_day: '5441.0000'
          },
          {
            lower: '70',
            upper: '80',
            span_count: 1,
            deposited_total_day: 0,
            deposited_count: 0,
            deposited_ratio: '0',
            deposited_avg_day: '-'
          },
          {
            lower: '80',
            upper: '90',
            span_count: 1,
            deposited_total_day: 5449,
            deposited_count: 1,
            deposited_ratio: '100.0000',
            deposited_avg_day: '5449.0000'
          },
          {
            lower: '90',
            upper: '100',
            span_count: 1,
            deposited_total_day: 5448,
            deposited_count: 1,
            deposited_ratio: '100.0000',
            deposited_avg_day: '5448.0000'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

    wrapper = shallowMount(Overview, {
      global: {
        plugins: [i18n]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('components exists?', () => {
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
  })

  it('queryActionScoreSpan', async () => {
    const result = [
      {
        lower: '10%',
        upper: '20%',
        deposit_prob: '10(含) ~ 20(不含)',
        total_people_num: 19,
        total_deposit_people_num: 0,
        deposit_ratio: '0%',
        avg_first_deposit_day: 0,
        has_bg: false
      },
      {
        lower: '20%',
        upper: '30%',
        deposit_prob: '20(含) ~ 30(不含)',
        total_people_num: 16,
        total_deposit_people_num: 0,
        deposit_ratio: '0%',
        avg_first_deposit_day: 0,
        has_bg: false
      },
      {
        lower: '30%',
        upper: '40%',
        deposit_prob: '30(含) ~ 40(不含)',
        total_people_num: 8,
        total_deposit_people_num: 1,
        deposit_ratio: '12.5%',
        avg_first_deposit_day: 5657,
        has_bg: false
      },
      {
        lower: '40%',
        upper: '50%',
        deposit_prob: '40(含) ~ 50(不含)',
        total_people_num: 4,
        total_deposit_people_num: 2,
        deposit_ratio: '50%',
        avg_first_deposit_day: 10957,
        has_bg: true
      },
      {
        lower: '50%',
        upper: '60%',
        deposit_prob: '50(含) ~ 60(不含)',
        total_people_num: 8,
        total_deposit_people_num: 4,
        deposit_ratio: '50%',
        avg_first_deposit_day: 21663,
        has_bg: true
      },
      {
        lower: '60%',
        upper: '70%',
        deposit_prob: '60(含) ~ 70(不含)',
        total_people_num: 4,
        total_deposit_people_num: 1,
        deposit_ratio: '25%',
        avg_first_deposit_day: 5441,
        has_bg: false
      },
      {
        lower: '70%',
        upper: '80%',
        deposit_prob: '70(含) ~ 80(不含)',
        total_people_num: 1,
        total_deposit_people_num: 0,
        deposit_ratio: '0%',
        avg_first_deposit_day: 0,
        has_bg: false
      },
      {
        lower: '80%',
        upper: '90%',
        deposit_prob: '80(含) ~ 90(不含)',
        total_people_num: 1,
        total_deposit_people_num: 1,
        deposit_ratio: '100%',
        avg_first_deposit_day: 5449,
        has_bg: true
      },
      {
        lower: '90%',
        upper: '100%',
        deposit_prob: '90(含) ~ 100(含)',
        total_people_num: 1,
        total_deposit_people_num: 1,
        deposit_ratio: '100%',
        avg_first_deposit_day: 5448,
        has_bg: true
      }
    ]

    wrapper.vm.queryActionScoreSpan()
    await flushPromises()

    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(wrapper.vm.tableData).toStrictEqual(result)
  })

  it('handleChangeDetail', async () => {
    const row = {
      lower: '20%',
      upper: '30%',
      deposit_prob: '20(含) ~ 30(不含)',
      total_people_num: 16,
      total_deposit_people_num: 0,
      deposit_ratio: '0%',
      avg_first_deposit_day: 0,
      has_bg: false
    }
    await wrapper.vm.handleChangeDetail(row)

    expect(wrapper.emitted('update:detail')).toStrictEqual([['20;30']])
  })
})
