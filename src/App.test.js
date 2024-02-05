import { it, describe, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import App from '@/App.vue'
import { createTestingPinia } from '@pinia/testing'
import { ElConfigProvider } from 'element-plus'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
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

  // LoadingBox 元件是否存在於畫面上
  it('Whether the LoadingBox component exists on the screen', () => {
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(true)
  })
})
