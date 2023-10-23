import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import DialogMemberHistory from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberHistory.vue'

describe('Dialog Member', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(DialogMemberHistory, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 開啟Dialog
  it('open Dialog', () => {
    let dataValue = {
      hall_id: 3820698,
      domain_id: 0,
      ag_name: 'dcash888',
      user_id: 941721245,
      user_name: 'wuxu850223',
      activity_day: 26,
      bet_amount: '1218198',
      payoff: '-32299.69',
      deposit_amount: '245748',
      bet_amount_avg: '46853.76',
      payoff_avg: '-1242.3',
      deposit_amount_avg: '9451.85'
    }
    wrapper.vm.handleOpenDialog(dataValue)
    expect(wrapper.vm.chartParam).toStrictEqual(dataValue)
    expect(wrapper.vm.dialogTableVisible).toBe(true)
  })
})
