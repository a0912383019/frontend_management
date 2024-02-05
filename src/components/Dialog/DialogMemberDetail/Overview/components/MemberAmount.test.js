import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberAmount from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberAmount.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import { useGlobalStore } from '@/stores/global.js'

describe('MemberAmount.vue', () => {
  let wrapper = null

  //只mock getHallCurrencySign，因爲無法初始化hall_code
  vi.mock('@/utils/commonUtils.js', async () => {
    const actual = await vi.importActual('@/utils/commonUtils.js')
    const getHallCurrencySign = vi.fn()
    getHallCurrencySign.mockReturnValue('¥')

    return {
      ...actual, //包括原始模組中的其他方法
      getHallCurrencySign //覆蓋 getHallCurrencySign 函數
    }
  })

  //讓console.error不要洗版
  vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    const result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          total_deposit: '4766000',
          total_profit: '-1236936.1',
          total_withdraw: '4827723',
          withdraw_deposit_net_amount: '-61723'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberAmount, {
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
          FontAwesomeIcon
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
    const amountData = {
      total_profit: '-1,236,936',
      withdraw_deposit_net_amount: '-61,723',
      total_deposit: '4,766,000',
      total_withdraw: '4,827,723'
    }
    expect(wrapper.vm.amountData).toStrictEqual(amountData)
    expect(wrapper.vm.currencySignText).toBe('¥')
  })

  it('Expected components render correctly, mock api error', async () => {
    const error401 = new Error('error')
    error401.response = {
      status: 401
    }
    vi.spyOn(axiosGoInstance, 'get').mockRejectedValue(error401)
    wrapper = shallowMount(MemberAmount, {
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
          FontAwesomeIcon
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
    const globalStore = useGlobalStore()

    const storeHandleApiError = vi.fn()
    globalStore.storeHandleApiError = storeHandleApiError

    await flushPromises()
    expect(storeHandleApiError).toHaveBeenCalled()
  })
})
