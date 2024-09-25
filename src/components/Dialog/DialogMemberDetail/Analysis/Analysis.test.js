import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import GADetail from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADetail.vue'
import GALoginCount from '@/components/Dialog/DialogMemberDetail/Analysis/components/GALoginCount.vue'
import PeriodOfferAmount from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodOfferAmount.vue'
import PeriodDayOffer from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodDayOffer.vue'
import GADataPage from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADataPage.vue'
import Analysis from '@/components/Dialog/DialogMemberDetail/Analysis/Analysis.vue'
import router from '@/router'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'

describe('Analysis.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    wrapper = shallowMount(Analysis, {
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
    expect(wrapper.findComponent(GADetail).exists()).toBe(true)
    expect(wrapper.findComponent(GALoginCount).exists()).toBe(true)
    expect(wrapper.findComponent(PeriodOfferAmount).exists()).toBe(true)
    expect(wrapper.findComponent(PeriodDayOffer).exists()).toBe(true)
    expect(wrapper.findComponent(GADataPage).exists()).toBe(true)

    //測試重新搜尋
    dialogMemberDetailStore.timeStamp = 1234567
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual('')

    //測試重新搜尋後切回頁面是否會更改key值
    dialogMemberDetailStore.nowTag = 'Analysis'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(1234567)
  })
})
