import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MemberJourney from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberJourney.vue'
import MemberDetail from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberDetail.vue'
import MemberLifeCycleHistory from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberLifeCycleHistory.vue'
import Journey from '@/components/Dialog/DialogMemberDetail/Journey/Journey.vue'
import router from '@/router'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

describe('Journey.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    wrapper = shallowMount(Journey, {
      global: {
        plugins: [
          router,
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
    dialogMemberDetailStore = useDialogMemberDetailStore()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.findComponent(MemberJourney).exists()).toBe(true)
    expect(wrapper.findComponent(MemberDetail).exists()).toBe(true)
    expect(wrapper.findComponent(MemberLifeCycleHistory).exists()).toBe(true)

    //測試重新搜尋
    dialogMemberDetailStore.timeStamp = 1234567
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual('')

    //測試重新搜尋後切回頁面是否會更改key值
    dialogMemberDetailStore.nowTag = 'Journey'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(1234567)
  })
})
