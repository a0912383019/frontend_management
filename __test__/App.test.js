import { it, describe, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import App from '@/App.vue'
import { createTestingPinia } from '@pinia/testing'
import { ElConfigProvider } from 'element-plus'
import Loading from '@/components/Loading/Loading.vue'
import router from '@/router'

describe('App.vue', () => {
  const wrapper = shallowMount(App, {
    global: {
      plugins: [i18n, router, createTestingPinia({ createSpy: vi.fn })]
    }
  })

  // ElConfigProvider 元件是否存在於畫面上
  it('Whether the ElConfigProvider component exists on the screen', () => {
    expect(wrapper.findComponent(ElConfigProvider).exists()).toBe(true)
  })

  // Loading 元件是否存在於畫面上
  it('Whether the Loading component exists on the screen', () => {
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
  })
})
