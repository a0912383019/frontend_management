import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
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

// const dialogMemberDetailStore = useDialogMemberDetailStore()
describe('Analysis.vue', () => {
  let wrapper = null
	let dialogMemberDetailStore = null
  beforeEach(() => {
    wrapper = shallowMount(Analysis, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
        // components: {
        //   FontAwesomeIcon
        // }
      },
			stubs: {
				ElementPlus
			}
    })
    dialogMemberDetailStore = useDialogMemberDetailStore()
  })
  //   afterEach(() => {
  //     wrapper.unmount()
  //   })

  it('Expected components render correctly', async () => {
		expect(wrapper.findComponent(GADetail).exists()).toBe(true)
	})
})
