import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import MemberActive from '@/views/Home/components/MemberActive.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpIcon from '@/components/CdpIcon.vue'
import MemberActiveDetail from '@/views/Home/components/MemberActiveDetail.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import router from '@/router'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { useGlobalStore } from '@/stores/global.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('MemberActive.vue', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  const dateStore = useDateStore(pinia)

  dateStore.LAST_DATE = dayjs(1513823919228)

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    globalStore.activeHall = {
      hall_name: '',
      hall_code: ''
    }
    wrapper = shallowMount(MemberActive, {
      global: {
        plugins: [i18n, router],
        components: {
          FontAwesomeIcon,
          CdpIcon
        },
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
    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(MemberActiveDetail).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.vm.lastWeekDuration).toStrictEqual('2017/12/08~2017/12/14')
    expect(wrapper.vm.thisWeekDuration).toStrictEqual('2017/12/15~2017/12/21')
  })

  it('Expected components render correctly', async () => {
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }
    const result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          [29, 5, 0, 0, 0, 0],
          [3, 11, 2, 2, 2, 0],
          [1, 2, 2, 1, 1, 0],
          [0, 1, 2, 0, 2, 1],
          [0, 0, 0, 2, 1, 1],
          [0, 0, 0, 2, 2, 20]
        ]
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberActive, {
      global: {
        plugins: [i18n, router],
        components: {
          FontAwesomeIcon,
          CdpIcon
        },
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
    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(MemberActiveDetail).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.vm.lastWeekDuration).toStrictEqual('2017/12/08~2017/12/14')
    expect(wrapper.vm.thisWeekDuration).toStrictEqual('2017/12/15~2017/12/21')
    
    const refPeople = [
      [ 20, 2, 2, 0, 0, 0 ],
      [ 1, 1, 2, 0, 0, 0 ],
      [ 1, 2, 0, 2, 1, 0 ],
      [ 0, 1, 1, 2, 2, 1 ],
      [ 0, 2, 2, 2, 11, 3 ],
      [ 0, 0, 0, 0, 5, 29 ]
    ]
    expect(wrapper.vm.refPeople).toStrictEqual(refPeople)

    const handleOpenDialog = vi.fn()
    wrapper.vm.$refs.activityStepDetail.handleOpenDialog = handleOpenDialog
    wrapper.vm.showActivityStepDetail(3,5)
    expect(handleOpenDialog).toBeCalledWith(3,5)
  })
})
