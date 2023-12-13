import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Home from '@/views/Home/Home.vue'
import TopCard from '@/views/Home/components/TopCard.vue'
import NotificationTables from '@/views/Home/components/NotificationTables.vue'
import LifeStep from '@/views/Home/components/LifeStep.vue'
import MemberActive from '@/views/Home/components/MemberActive.vue'

describe('Home.vue', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
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
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.findComponent(TopCard).exists()).toBe(true)
    expect(wrapper.findComponent(NotificationTables).exists()).toBe(true)
    expect(wrapper.findComponent(LifeStep).exists()).toBe(true)
    expect(wrapper.findComponent(MemberActive).exists()).toBe(true)

    //測試重新搜尋
    wrapper.vm.systemConfigIsOk = 35353
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(35353)
  })
})
