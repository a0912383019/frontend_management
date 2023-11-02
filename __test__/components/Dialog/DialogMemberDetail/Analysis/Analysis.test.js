import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import GADetail from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADetail.vue'
import GALoginCount from '@/components/Dialog/DialogMemberDetail/Analysis/components/GALoginCount.vue'
import PeriodOfferAmount from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodOfferAmount.vue'
import PeriodDayOffer from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodDayOffer.vue'
import GADataPage from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADataPage.vue'
import Analysis from '@/components/Dialog/DialogMemberDetail/Analysis/Analysis.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import HighchartsVue from 'highcharts-vue'

describe('Analysis.vue', () => {
  let wrapper = null
  let dialogMemberDetailStore = null

  beforeEach(() => {
    const result = {
      data: {
        status: {
          return_code: '9999',
          message: 'error'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = mount(Analysis, {
      global: {
        plugins: [
          HighchartsVue,
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      }
    })
    dialogMemberDetailStore = useDialogMemberDetailStore()

    //讓console.error不要洗版
    vi.spyOn(console, 'error').mockImplementation(() => {})
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
