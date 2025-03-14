import { it, describe, expect, afterEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { useGlobalStore } from '@/stores/global.js'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Login from '@/views/Login.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('Login', () => {
  let wrapper = null

  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)

  // mock console
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})
  const consoleErrMock = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('hideErrorMsg', async () => {
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
    wrapper.vm.hideErrorMsg()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.failMsg.msg1.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg2.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg3.isShow).toBe(false)
    expect(wrapper.vm.failMsg.msg4.isShow).toBe(false)
  })

  it('shake', async () => {
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
    vi.useFakeTimers()

    wrapper.vm.shake()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShake).toBe(true)
    vi.advanceTimersByTime(2000)
    expect(wrapper.vm.isShake).toBe(false)
  })

  it('googleLoginCallback', async () => {
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
    expect(sessionStorage.access_token_go).toBe('bearer gotoken')
  })

  it('apiRelease success', async () => {
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/release':
          return Promise.resolve({ data: { status: 200 } })
      }
    })

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
    await flushPromises()
    expect(consoleMock).toHaveBeenCalledWith({ data: { status: 200 } })
  })

  it('apiRelease fail', async () => {
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/release':
          return Promise.reject(new Error('API error'))
      }
    })

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
    await flushPromises()
    expect(consoleErrMock).toHaveBeenCalledWith(new Error('API error'))
  })
})
