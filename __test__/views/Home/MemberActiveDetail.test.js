import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import CdpIcon from '@/components/CdpIcon.vue'
import MemberActiveDetail from '@/views/Home/components/MemberActiveDetail.vue'
import ActiveDetail from '@/views/Home/components/ActiveDetail.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ElementPlus, { dayjs } from 'element-plus'
import { useGlobalStore } from '@/stores/global.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('MemberActiveDetail.vue', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    const result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            user_id: 941757584,
            analysis_level: 0,
            compare_level: 1,
            user_name: 'singleung',
            bet_amount: '49888.0000',
            payoff: '-7969.2000',
            offer_amount: '7963.3200',
            profit_loss: '5.8800',
            net_amount: '0',
            deposit_amount: '0'
          },
          {
            user_id: 941751430,
            analysis_level: 0,
            compare_level: 1,
            user_name: 'xinyang105',
            bet_amount: '2677.0000',
            payoff: '61.2200',
            offer_amount: '138.7700',
            profit_loss: '-199.9900',
            net_amount: '-200.0000',
            deposit_amount: '150.0000'
          },
          {
            user_id: 941728460,
            analysis_level: 0,
            compare_level: 1,
            user_name: 'clouds452',
            bet_amount: '37541.7000',
            payoff: '-4536.3100',
            offer_amount: '1135.9300',
            profit_loss: '3400.3800',
            net_amount: '3400.0000',
            deposit_amount: '8905.0000'
          }
        ]
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)

    wrapper = shallowMount(MemberActiveDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      },
      props: {
        lastDate: dayjs(1513823919228)
      }
    })
    //等待異步完成
    await flushPromises()
    const activityTableColumns = [
      { label: '會員名稱', prop: 'memberName', align: 'center', width: 120 },
      { label: '存款', prop: 'deposit', align: 'center', sortable: 'custom' },
      {
        label: '貨量',
        prop: 'betAmount',
        align: 'center',
        sortable: 'custom'
      },
      { label: '損益', prop: 'payoff', align: 'center', sortable: 'custom' },
      { label: '優惠獎金', prop: 'bonus', align: 'center', sortable: 'custom' },
      {
        label: '實際損益',
        prop: 'profitAndLoss',
        align: 'center',
        sortable: 'custom'
      },
      {
        label: '淨額',
        prop: 'netAmount',
        align: 'center',
        sortable: 'custom'
      },
      { prop: 'activeLevel', align: 'center', width: 140 }
    ]
    expect(wrapper.vm.activityTableColumns).toStrictEqual(activityTableColumns)
    expect(wrapper.findComponent(ActiveDetail).exists()).toBe(true)
    expect(wrapper.vm.weekDuration).toStrictEqual('2017/12/15~2017/12/21')
    wrapper.vm.handleOpenDialog()
    await flushPromises()

    const activityTableData = [
      {
        memberName: 'singleung',
        deposit: '0',
        betAmount: '49,888',
        payoff: '7,969',
        bonus: '-7,963',
        profitAndLoss: '6',
        netAmount: '0',
        user: { user_name: 'singleung', user_id: 941757584 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        memberName: 'xinyang105',
        deposit: '150',
        betAmount: '2,677',
        payoff: '-61',
        bonus: '-139',
        profitAndLoss: '-200',
        netAmount: '-200',
        user: { user_name: 'xinyang105', user_id: 941751430 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        memberName: 'clouds452',
        deposit: '8,905',
        betAmount: '37,542',
        payoff: '4,536',
        bonus: '-1,136',
        profitAndLoss: '3,400',
        netAmount: '3,400',
        user: { user_name: 'clouds452', user_id: 941728460 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      }
    ]
    expect(wrapper.vm.activityTableData).toStrictEqual(activityTableData)

    await wrapper.vm.handleSort({ prop: 'profitAndLoss', order: 'descending' })
    const descActivityTableData = [
      {
        memberName: 'clouds452',
        deposit: '8,905',
        betAmount: '37,542',
        payoff: '4,536',
        bonus: '-1,136',
        profitAndLoss: '3,400',
        netAmount: '3,400',
        user: { user_name: 'clouds452', user_id: 941728460 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        memberName: 'singleung',
        deposit: '0',
        betAmount: '49,888',
        payoff: '7,969',
        bonus: '-7,963',
        profitAndLoss: '6',
        netAmount: '0',
        user: { user_name: 'singleung', user_id: 941757584 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        memberName: 'xinyang105',
        deposit: '150',
        betAmount: '2,677',
        payoff: '-61',
        bonus: '-139',
        profitAndLoss: '-200',
        netAmount: '-200',
        user: { user_name: 'xinyang105', user_id: 941751430 },
        lastWeekIcon: { icon: 'fa-frown', color: 'cdp-text-amethyst' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      }
    ]
    expect(wrapper.vm.activityTableData).toStrictEqual(descActivityTableData)

    const handleOpenDialog = vi.fn()
    wrapper.vm.$refs.refActiveDetail.handleOpenDialog = handleOpenDialog
    wrapper.vm.handleActiveDetailClick()
    expect(handleOpenDialog).toBeCalled()
  })
})
