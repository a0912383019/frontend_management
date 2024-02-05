import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MemberPayoffHallProfit from '@/components/Dialog/DialogMemberDetail/Profit/components/MemberPayoffHallProfit.vue'
import DepositAndWithdraw from '@/components/Dialog/DialogMemberDetail/Profit/components/DepositAndWithdraw.vue'
import TotalBetPlatforms from '@/components/Dialog/DialogMemberDetail/Profit/components/TotalBetPlatforms.vue'
import TotalPayoffPlatforms from '@/components/Dialog/DialogMemberDetail/Profit/components/TotalPayoffPlatforms.vue'
import Profit from '@/components/Dialog/DialogMemberDetail/Profit/Profit.vue'
import router from '@/router'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

describe('Profit.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    wrapper = shallowMount(Profit, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          'ElRow': {
            template: '<div><slot /></div>'
          },
          'ElCol': {
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
    expect(wrapper.findComponent(MemberPayoffHallProfit).exists()).toBe(true)
    expect(wrapper.findComponent(DepositAndWithdraw).exists()).toBe(true)
    expect(wrapper.findComponent(TotalBetPlatforms).exists()).toBe(true)
    expect(wrapper.findComponent(TotalPayoffPlatforms).exists()).toBe(true)

    //測試重新搜尋
    dialogMemberDetailStore.timeStamp = 1234567
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual('')

    //測試重新搜尋後切回頁面是否會更改key值
    dialogMemberDetailStore.nowTag = 'Profit'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(1234567)
  })
})
