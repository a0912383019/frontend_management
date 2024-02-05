import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import DialogMemberDetail from '@/components/Dialog/DialogMemberDetail/DialogMemberDetail.vue'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FilterDate from '@/components/Filter/FilterDate.vue'
import Tab from '@/components/Tab.vue'
import Overview from '@/components/Dialog/DialogMemberDetail/Overview/Overview.vue'
import Profit from '@/components/Dialog/DialogMemberDetail/Profit/Profit.vue'
import Journey from '@/components/Dialog/DialogMemberDetail/Journey/Journey.vue'
import Analysis from '@/components/Dialog/DialogMemberDetail/Analysis/Analysis.vue'

describe('DialogMemberDetail.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    wrapper = shallowMount(DialogMemberDetail, {
      global: {
        plugins: [
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          },
          KeepAlive: {
            template: '<div><slot /></div>'
          }
        },
        components: {
          FontAwesomeIcon
        }
      }
    })
    dialogMemberDetailStore = useDialogMemberDetailStore()
    dialogMemberDetailStore.state.memberData = {
      user_name: '5439696',
      user_id: 941751988
    }
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.vm.dialogVisible).toBe(false)
    //觸發watch打開dialog
    wrapper.vm.showMemberDialog = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(FilterDate).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.vm.currentTabs).toStrictEqual('Overview')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.headerMemberName).toStrictEqual('5439696')
    expect(wrapper.vm.headerTitle).toStrictEqual('會員名稱：5439696')
    expect(dialogMemberDetailStore.nowTag).toStrictEqual('Overview')

    //更新時間
    wrapper.vm.updateTimestamp({
      timestamp: 1700019016374,
      rangeDate: '2023-08-18 ~ 2023-09-14'
    })
    await wrapper.vm.$nextTick()
    expect(dialogMemberDetailStore.timeStamp).toStrictEqual(1700019016374)
    expect(dialogMemberDetailStore.dialogMemberDetailRangeDate).toStrictEqual(
      '2023-08-18 ~ 2023-09-14'
    )

    expect(wrapper.findComponent(Overview).exists()).toBe(true)
    expect(wrapper.findComponent(Profit).exists()).toBe(false)
    expect(wrapper.findComponent(Journey).exists()).toBe(false)
    expect(wrapper.findComponent(Analysis).exists()).toBe(false)
    //模擬更改tab
    wrapper.vm.currentTabs = 'Profit'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('Profit')
    expect(wrapper.findComponent(Overview).exists()).toBe(false)
    expect(wrapper.findComponent(Profit).exists()).toBe(true)
    expect(wrapper.findComponent(Journey).exists()).toBe(false)
    expect(wrapper.findComponent(Analysis).exists()).toBe(false)

    // 關閉 dialog
    wrapper.vm.handleDialogClosed()
    expect(dialogMemberDetailStore.showMemberDialog).toBe(false)
    expect(wrapper.vm.currentTabs).toStrictEqual('Overview')
  })

  it('test window open', async () => {
    global.open = vi.fn()

    wrapper.vm.openNewWindow()
    await wrapper.vm.$nextTick()
    expect(window.open).toBeCalled()
    expect(window.open).toHaveBeenCalledWith(
      '/member-details-popup',
      '_blank',
      'width=1000,height=800,scrollbars=yes'
    )
  })
})
