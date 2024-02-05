import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MemberHealth from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberHealth.vue'
import MemberInfo from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberInfo.vue'
import MemberAmount from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberAmount.vue'
import MemberPeriodBetAmount from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberPeriodBetAmount.vue'
import LobbyGroup from '@/components/Dialog/DialogMemberDetail/Overview/components/LobbyGroup.vue'
import Lobby from '@/components/Dialog/DialogMemberDetail/Overview/components/Lobby.vue'
import LobbyGame from '@/components/Dialog/DialogMemberDetail/Overview/components/LobbyGame.vue'
import Overview from '@/components/Dialog/DialogMemberDetail/Overview/Overview.vue'
import router from '@/router'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

describe('Overview.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    wrapper = shallowMount(Overview, {
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
    expect(wrapper.findComponent(MemberHealth).exists()).toBe(true)
    expect(wrapper.findComponent(MemberInfo).exists()).toBe(true)
    expect(wrapper.findComponent(MemberAmount).exists()).toBe(true)
    expect(wrapper.findComponent(MemberPeriodBetAmount).exists()).toBe(true)
    expect(wrapper.findComponent(LobbyGroup).exists()).toBe(true)
    expect(wrapper.findComponent(Lobby).exists()).toBe(true)
    expect(wrapper.findComponent(LobbyGame).exists()).toBe(true)

    //測試重新搜尋
    dialogMemberDetailStore.timeStamp = 1234567
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual('')

    //測試重新搜尋後切回頁面是否會更改key值
    dialogMemberDetailStore.nowTag = 'Overview'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(1234567)
  })
})
