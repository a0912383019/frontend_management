import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import MemberLifeCycleHistory from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberLifeCycleHistory.vue'
import router from '@/router'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'

describe('GADetail.vue', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    wrapper = shallowMount(MemberLifeCycleHistory, {
      global: {
        plugins: [
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    expect(wrapper.vm.chartIsShow).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LifeCycleHistory).exists()).toBe(true)
  })
})
