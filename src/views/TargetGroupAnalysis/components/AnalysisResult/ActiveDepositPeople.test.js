import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ActiveDepositPeople from '@/views/TargetGroupAnalysis/components/AnalysisResult/ActiveDepositPeople.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import HighchartsVue from 'highcharts-vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'

describe('ActiveDepositPeople.vue', () => {
  let wrapper = null
  let targetStore
  let spyGet

  const consoleErrMock = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    targetStore = useTargetGroupStore(pinia)
    targetStore.filtered = new Date(12342323).getTime()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly and watch correctly', async () => {
    let result = {
      data: {
        status: {
          return_code: '0001',
          message: 'success'
        }
      }
    }

    let result2 = new Error('err')
    result2.response = { status: 500 }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result)
    spyGet.mockRejectedValueOnce(result2)

    wrapper = shallowMount(ActiveDepositPeople, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        targetId: 'ttui-uuid-9999',
        kind: 'ActivePeople'
      }
    })

    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    // 模擬搜尋，觸發watch
    targetStore.filtered = new Date(22342323).getTime()
    expect(consoleErrMock).toBeCalledTimes(0)
    await flushPromises()
    expect(consoleErrMock).toBeCalledTimes(1)
    expect(consoleErrMock).toHaveBeenCalledWith(new Error('err'))
  })

  it('Expected ActivePeople api correctly', async () => {
    let result = {
      data: {
        result: [
          {
            custom_tag_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                active_people: 0
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                active_people: 0
              }
            ],
            date: '2024-05-04'
          },
          {
            custom_tag_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                active_people: 8
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                active_people: 5
              }
            ],
            date: '2024-05-05'
          },
          {
            custom_tag_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                active_people: 9
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                active_people: 7
              }
            ],
            date: '2024-05-06'
          },
          {
            custom_tag_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                active_people: 14
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                active_people: 13
              }
            ],
            date: '2024-05-07'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result)

    wrapper = shallowMount(ActiveDepositPeople, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        targetId: 'ttui-uuid-6666',
        kind: 'ActivePeople'
      }
    })

    // 等待異步完成
    await flushPromises()
    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(spyGet).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.props('targetId')}/active_people`,
      expect.any(Object)
    )
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual([
      '2024/05/04',
      '2024/05/05',
      '2024/05/06',
      '2024/05/07'
    ])
    expect(wrapper.vm.chartOptions.series).toStrictEqual([
      {
        color: 'rgb(245,105,84,1)',
        data: [0, 8, 9, 14],
        fillColor: 'rgb(245,105,84,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: 'jwi'
      },
      {
        color: 'rgb(0,166,90,1)',
        data: [0, 5, 7, 13],
        fillColor: 'rgb(0,166,90,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: 'mby'
      }
    ])
  })

  it('Expected DepositPeople api correctly', async () => {
    let result = {
      data: {
        result: [
          {
            custom_tag_deposit_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                deposit_people: 0
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                deposit_people: 0
              }
            ],
            date: '2024-05-04'
          },
          {
            custom_tag_deposit_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                deposit_people: 0
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                deposit_people: 0
              }
            ],
            date: '2024-05-05'
          },
          {
            custom_tag_deposit_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                deposit_people: 0
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                deposit_people: 0
              }
            ],
            date: '2024-05-06'
          },
          {
            custom_tag_deposit_data: [
              {
                custom_tags_id: '09d9ec24-22dc-4b7e-8888-8602135dea28',
                custom_tags_name: 'jwi',
                deposit_people: 2
              },
              {
                custom_tags_id: 'a8666191-65fa-4044-9431-cb236eafc133',
                custom_tags_name: 'mby',
                deposit_people: 1
              }
            ],
            date: '2024-05-07'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result)

    wrapper = shallowMount(ActiveDepositPeople, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        targetId: 'ttui-uuid-6666',
        kind: 'DepositPeople'
      }
    })

    // 等待異步完成
    await flushPromises()
    expect(wrapper.vm.apiSuccess).toBe(true)
    expect(spyGet).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.props('targetId')}/deposit_people`,
      expect.any(Object)
    )
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual([
      '2024/05/04',
      '2024/05/05',
      '2024/05/06',
      '2024/05/07'
    ])
    expect(wrapper.vm.chartOptions.series).toStrictEqual([
      {
        color: 'rgb(245,105,84,1)',
        data: [0, 0, 0, 2],
        fillColor: 'rgb(245,105,84,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: 'jwi'
      },
      {
        color: 'rgb(0,166,90,1)',
        data: [0, 0, 0, 1],
        fillColor: 'rgb(0,166,90,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: 'mby'
      }
    ])
  })

  it('clearChart', async () => {
    wrapper.vm.chartOptions.xAxis.categories = ['categories']
    wrapper.vm.chartOptions.series = ['series']

    await wrapper.vm.clearChart()
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual([])
    expect(wrapper.vm.chartOptions.series).toStrictEqual([])
  })
})
