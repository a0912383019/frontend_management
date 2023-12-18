import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import router from '@/router'
import Countdown from '@/components/HeaderBar/components/Countdown.vue'

describe('Countdown', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)

  beforeEach(() => {
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'esb'
    }

    wrapper = shallowMount(Countdown, {
      global: {
        plugins: [i18n, router]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('watch i18nLocale', async () => {
    wrapper.vm.i18nLocale = 'en'
    await flushPromises()
    expect(wrapper.vm.isDisabledResetBtn).toBe(false)
  })

  it('setCountDownTimer function', async () => {
    await wrapper.vm.setCountDownTimer()
    expect(wrapper.vm.timeoutMinText).toBe(59)
  })

  it('timeoutZero function', () => {
    expect(wrapper.vm.timeoutZero(9)).toBe('09')
    expect(wrapper.vm.timeoutZero(12)).toBe(12)
  })

  it('resetTimer function', async () => {
    await wrapper.vm.resetTimer()
    expect(wrapper.vm.timeoutMinText).toBe(59)
    expect(wrapper.vm.timeoutSecText).toBe(59)
    expect(wrapper.vm.timeoutMin).toBe(59)
    expect(wrapper.vm.timeoutSec).toBe(59)
  })

  it('countDown function', async () => {
    wrapper.vm.timeoutSec = 10
    await wrapper.vm.countDown()
    expect(wrapper.vm.timeoutSec).toBe(9)
    expect(wrapper.vm.timeoutSecText).toBe('09')

    wrapper.vm.timeoutSec = 0
    wrapper.vm.timeoutMin = 10
    await wrapper.vm.countDown()
    expect(wrapper.vm.timeoutSec).toBe(59)
    expect(wrapper.vm.timeoutSecText).toBe(59)
    expect(wrapper.vm.timeoutMin).toBe(9)
    expect(wrapper.vm.timeoutMinText).toBe('09')
  })

  it('visibility change', async () => {
    // 呼叫 handleVisibilityChange，模擬可見性狀態的變化
    let countdownInterval = 1000
    wrapper.vm.countdownInterval = countdownInterval
    await wrapper.vm.$nextTick()
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }))

    const startTime = new Date().getTime()
    const currentTime = new Date().getTime()
    const mockSessionStorage = { start_timer: JSON.stringify(startTime) }
    global.sessionStorage = mockSessionStorage

    const timeDifference = currentTime - startTime
    const minutes = Math.floor(timeDifference / (countdownInterval * 60)) // 計算分鐘數
    const seconds = Math.floor((timeDifference / countdownInterval) % 60) // 計算秒數

    expect(wrapper.vm.timeoutMinText).toBe(59 - minutes)
    expect(wrapper.vm.timeoutSecText).toBe(59 - seconds)
    expect(wrapper.vm.timeoutMin).toBe(59 - minutes)
    expect(wrapper.vm.timeoutSec).toBe(59 - seconds)
  })

  it('restartTimer function', async () => {
    await wrapper.vm.restartTimer()
    expect(wrapper.vm.isDisabledResetBtn).toBe(false)
  })

  it('watch globalStore.activeHall.hall_code', async () => {
    const mockSessionStorage = { system_config: 1 }
    global.sessionStorage = mockSessionStorage
    globalStore.activeHall.hall_code = 123
    await flushPromises()
    expect(wrapper.vm.isDisabledResetBtn).toBe(false)
  })
})
