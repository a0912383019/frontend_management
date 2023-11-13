import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import HeaderBar from '@/components/HeaderBar/HeaderBar.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Tags from '@/components/HeaderBar/components/Tags.vue'
import Hall from '@/components/HeaderBar/components/Hall.vue'
import Language from '@/components/HeaderBar/components/Language.vue'
import Account from '@/components/HeaderBar/components/Account.vue'
import { useSidebarStore } from '@/stores/sidebar.js'

describe('HeaderBar', () => {
  let wrapper = null
  let sidebarStore = null
  const toggleSidebarOpen = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(HeaderBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      }
    })
    sidebarStore = useSidebarStore()
    sidebarStore.toggleSidebarOpen = toggleSidebarOpen
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 預期渲染與開啟下拉是否正確，函式是否正確呼叫
  it('test component, test function', async () => {
    expect(wrapper.findComponent(Tags).exists()).toBe(true)
    expect(wrapper.findComponent(Hall).exists()).toBe(true)
    expect(wrapper.findComponent(Language).exists()).toBe(true)
    expect(wrapper.findComponent(Account).exists()).toBe(true)

    await wrapper.findComponent(Hall).vm.$emit('time', 123)
    expect(wrapper.vm.times).toBe(123)

    await wrapper.find('.m_menu_button').trigger('click')
    expect(toggleSidebarOpen).toHaveBeenCalled()
  })
})
