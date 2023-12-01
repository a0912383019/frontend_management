import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { useGlobalStore } from '@/stores/global.js'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Login from '@/views/Login.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import axiosInstance from '@/api/axiosInstance.js'
import { apiLogin, apiGoLogin } from '@/api/system.js'

describe('Login', () => {
  let wrapper = null

  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  // globalStore.activeHall = {
  //   hall_name: 'esb',
  //   hall_code: 'esb'
  // }

  beforeEach(() => {
    wrapper = shallowMount(Login, {
      global: {
        plugins: [i18n, ElementPlus, router],
        stubs: {
          GoogleLogin: {
            template: '<div><slot /></div>'
          }
        },
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('hideErrorMsg', async () => {
    wrapper.vm.hideErrorMsg()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.failMsg.msg1.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg2.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg3.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg4.isShow).toBe(false)
  })

  it('shake', async () => {
    vi.useFakeTimers()

    wrapper.vm.shake()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShake).toBe(true)
    vi.advanceTimersByTime(2000)
    expect(wrapper.vm.isShake).toBe(false)
  })

  it('googleLoginCallback', async () => {
    const data = {
      credential: 'asdjio12j'
    }
    const goResponse = {
      result: {
        user_id: 10,
        user_name: 'test',
        user_type: 9,
        access_hall: 'esb,bmw',
        picture: 'abc.jpg',
        token_type: 'bearer',
        access_token: 'gotoken'
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }
    const phpResponse = {
      token_type: 'bearer',
      access_token: 'phptoken',
      status: {
        return_code: '0000',
        message: 'Successfully login_google'
      }
    }
    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'put').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/login_google':
          return Promise.resolve({ data: goResponse })
        default:
          return error
      }
    })
    vi.spyOn(axiosInstance, 'post').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/login_google':
          return Promise.resolve({ data: phpResponse })
        default:
          return error
      }
    })
    wrapper.vm.googleLoginCallback(data)
    await flushPromises()
    expect(globalStore.isLoading).toBe(false)

    // 驗證 user info
    const goResponseUserInfo = {
      user_id: 10,
      user_name: 'test',
      user_type: 9,
      access_hall: 'esb,bmw',
      picture: 'abc.jpg'
    }
    const userInfo = JSON.parse(sessionStorage.user_info)

    expect(userInfo).toStrictEqual(goResponseUserInfo)

    // 驗證 accsee token
    expect(sessionStorage.access_token).toBe('bearer phptoken')
    expect(sessionStorage.access_token_go).toBe('bearer gotoken')
  })
})
