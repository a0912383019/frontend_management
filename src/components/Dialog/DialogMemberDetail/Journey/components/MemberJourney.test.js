import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import MemberJourney from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberJourney.vue'
import MemberJourneyDialog from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberJourneyDialog.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import HighchartsVue from 'highcharts-vue'

describe('MemberJourney.vue', () => {
  let wrapper = null
  let result

  let system_config = {
    tags_config: {
      esb: {
        10001: {
          tag_type: 1,
          tag_name: '測試',
          tag_description: '測試敘述',
          tag_category: 1,
          sort_index: 1000000,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        40001: {
          tag_type: 1,
          tag_name: 'VIP客',
          tag_description: '人工定義為高價值會員',
          tag_category: 1,
          sort_index: 1000001,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        40004: {
          tag_type: 3,
          tag_name: '體育客',
          tag_description: '會員近15個實動日，在體育類遊戲總有效投註量最多',
          tag_category: 1,
          sort_index: 3000012,
          tag_enabled: true,
          mutual_tags_code: '30009,30010,30011,30013,30014'
        }
      }
    }
  }
  sessionStorage.setItem('system_config', JSON.stringify(system_config))

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        result: [
          {
            // 下架或不存在標籤不影響顯示ex 50001
            user_tag: '10001,40001,40004, 50001',
            accumulate_deposit_amount: '45031',
            accumulate_deposit_amount_level: 1,
            accumulate_bet_amount: '184472',
            accumulate_bet_amount_level: 0,
            accumulate_net_profit_ratio: '-8.89',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '184472',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-20'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '89831',
            accumulate_deposit_amount_level: 2,
            accumulate_bet_amount: '312462',
            accumulate_bet_amount_level: 1,
            accumulate_net_profit_ratio: '3.14',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '127990',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-21'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '124733',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '401239',
            accumulate_bet_amount_level: 1,
            accumulate_net_profit_ratio: '-50.22',
            profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥47,775 損益率 -77.79%\n最高損益率 New BB體育_體育_排球: 有效投注 ¥10,182 損益率 100.0%\n最低損益率 同最高有效投注',
            net_profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥47,775 淨利率 -76.13%\n最高淨利率 New BB體育_體育_排球: 有效投注 ¥10,182 淨利率 107.76%\n最低淨利率 同最高有效投注',
            bet_amount: '88777',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-22'
          },
          {
            user_tag: '40001,40004,10001',
            accumulate_deposit_amount: '156354',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '448632',
            accumulate_bet_amount_level: 1,
            accumulate_net_profit_ratio: '-76.83',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '47393',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-23'
          },
          {
            user_tag: '10001,40004,40001',
            accumulate_deposit_amount: '198854',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '551504',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '-103.34',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '102872',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-24'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '205854',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '598227',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '-6.94',
            profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥23,266 損益率 90.01%\n最高損益率 New BB體育_體育_籃球: 有效投注 ¥8,023 損益率 100.0%\n最低損益率 同最高有效投注',
            net_profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥23,266 淨利率 93.12%\n最高淨利率 New BB體育_體育_籃球: 有效投注 ¥8,023 淨利率 109.02%\n最低淨利率 同最高有效投注',
            bet_amount: '46723',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-25'
          },
          {
            user_tag: '10001,40001,40004',
            accumulate_deposit_amount: '225854',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '693844',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '21.26',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '95617',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-26'
          },
          {
            user_tag: '10001,40004,40001',
            accumulate_deposit_amount: '286254',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '793485',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '-41.77',
            profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥43,551 損益率 -100.0%\n最高損益率 New BB體育_體育_排球: 有效投注 ¥25,000 損益率 6.8%\n最低損益率 同最高有效投注',
            net_profit_ratio_tiptitle:
              '最高有效投注 New BB體育_體育_網球: 有效投注 ¥43,551 淨利率 -97.38%\n最高淨利率 New BB體育_體育_排球: 有效投注 ¥25,000 淨利率 11.36%\n最低淨利率 同最高有效投注',
            bet_amount: '99641',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-27'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '346589',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '906638',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '-80.09',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '113153',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-28'
          },
          {
            user_tag: '10001,40001,40004',
            accumulate_deposit_amount: '378867',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '999435',
            accumulate_bet_amount_level: 2,
            accumulate_net_profit_ratio: '-139.72',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '92797',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-29'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '400267',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '1024876',
            accumulate_bet_amount_level: 3,
            accumulate_net_profit_ratio: '-235.08',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '25441',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-30'
          },
          {
            user_tag: '10001,40001,40004',
            accumulate_deposit_amount: '414767',
            accumulate_deposit_amount_level: 3,
            accumulate_bet_amount: '1095459',
            accumulate_bet_amount_level: 3,
            accumulate_net_profit_ratio: '-181.05',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '70583',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-10-31'
          },
          {
            user_tag: '40004,10001,40001',
            accumulate_deposit_amount: '1238358',
            accumulate_deposit_amount_level: 5,
            accumulate_bet_amount: '3045126',
            accumulate_bet_amount_level: 3,
            accumulate_net_profit_ratio: '-114.82',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '48990',
            custom_flag_title: 'tteesstt',
            custom_flag_content: 'tteesstt',
            custom_flag_operator: 'BI-CDP-Yu_Lan',
            custom_flag_updated_time: '2023-11-06 13:44:54',
            this_day_step: 1,
            data_date: '2023-11-01'
          },
          {
            user_tag: '40004,40001,10001',
            accumulate_deposit_amount: '505562',
            accumulate_deposit_amount_level: 4,
            accumulate_bet_amount: '1260475',
            accumulate_bet_amount_level: 3,
            accumulate_net_profit_ratio: '-183.04',
            profit_ratio_tiptitle: '',
            net_profit_ratio_tiptitle: '',
            bet_amount: '116026',
            custom_flag_title: null,
            custom_flag_content: null,
            custom_flag_operator: null,
            custom_flag_updated_time: null,
            this_day_step: 1,
            data_date: '2023-11-02'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberJourney, {
      global: {
        plugins: [
          HighchartsVue,
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(MemberJourneyDialog).exists()).toBe(true)

    wrapper.vm.activeHall.hall_code = 'esb'
    await flushPromises()

    //測試資料轉換是否正確
    const categories = [
      '2023/10/20',
      '2023/10/21',
      '2023/10/22',
      '2023/10/23',
      '2023/10/24',
      '2023/10/25',
      '2023/10/26',
      '2023/10/27',
      '2023/10/28',
      '2023/10/29',
      '2023/10/30',
      '2023/10/31',
      '2023/11/01',
      '2023/11/02'
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)

    const plotBands = [
      {
        from: 0,
        to: 13,
        color: 'rgb(232,70,94,0.1)',
        label: { text: '<em></em>', style: { color: '#999999' }, y: 20 }
      }
    ]
    expect(wrapper.vm.chartOptions.xAxis.plotBands).toStrictEqual(plotBands)

    const seriesDatas = {
      data0: [
        -8.89, 3.14, -50.22, -76.83, -103.34, -6.94, 21.26, -41.77, -80.09, -139.72, -235.08,
        -181.05, -114.82, -183.04
      ],
      data1: [
        {
          x: 2,
          text: '最高有效投注 New BB體育_體育_網球: 有效投注 ¥47,775 淨利率 -76.13%<br>最高淨利率 New BB體育_體育_排球: 有效投注 ¥10,182 淨利率 107.76%<br>最低淨利率 同最高有效投注',
          title: '淨利比資訊'
        },
        {
          x: 5,
          text: '最高有效投注 New BB體育_體育_網球: 有效投注 ¥23,266 淨利率 93.12%<br>最高淨利率 New BB體育_體育_籃球: 有效投注 ¥8,023 淨利率 109.02%<br>最低淨利率 同最高有效投注',
          title: '淨利比資訊'
        },
        {
          x: 7,
          text: '最高有效投注 New BB體育_體育_網球: 有效投注 ¥43,551 淨利率 -97.38%<br>最高淨利率 New BB體育_體育_排球: 有效投注 ¥25,000 淨利率 11.36%<br>最低淨利率 同最高有效投注',
          title: '淨利比資訊'
        }
      ],
      data2: [
        { x: 0, text: '標記 <b>測試</b>', title: '＋測試' },
        { x: 0, text: '標記 <b>VIP客</b>', title: '＋VIP客' },
        { x: 0, text: '標記 <b>體育客</b>', title: '＋體育客' }
      ],
      data3: [
        184472, 127990, 88777, 47393, 102872, 46723, 95617, 99641, 113153, 92797, 25441, 70583,
        48990, 116026
      ],
      data4: [
        184472, 312462, 401239, 448632, 551504, 598227, 693844, 793485, 906638, 999435, 1024876,
        1095459, 3045126, 1260475
      ],
      data5: [
        { x: 1, text: '累積貨量達到 <b>¥312,462</b>', title: '貨量1.0' },
        { x: 4, text: '累積貨量達到 <b>¥551,504</b>', title: '貨量2.0' },
        { x: 10, text: '累積貨量達到 <b>¥1,024,876</b>', title: '貨量3.0' }
      ],
      data6: [
        { x: 0, text: '累積存款達到 <b>¥45,031</b>', title: '存款1.0' },
        { x: 1, text: '累積存款達到 <b>¥89,831</b>', title: '存款2.0' },
        { x: 2, text: '累積存款達到 <b>¥124,733</b>', title: '存款3.0' },
        { x: 12, text: '累積存款達到 <b>¥1,238,358</b>', title: '存款5.0' },
        { x: 13, text: '累積存款達到 <b>¥505,562</b>', title: '存款4.0' }
      ],
      data7: [
        {
          x: 12,
          text: 'tteesstt',
          title: 'tteesstt',
          custom: {
            custom_flag_content: 'tteesstt',
            custom_flag_operator: 'BI-CDP-Yu_Lan',
            custom_flag_updated_time: '2023/11/06 13:44:54'
          },
          events: {
            click: expect.any(Function)
          }
        }
      ]
    }
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(seriesDatas.data0)
    expect(wrapper.vm.chartOptions.series[1].data).toStrictEqual(seriesDatas.data1)
    expect(wrapper.vm.chartOptions.series[2].data).toStrictEqual(seriesDatas.data2)
    expect(wrapper.vm.chartOptions.series[3].data).toStrictEqual(seriesDatas.data3)
    expect(wrapper.vm.chartOptions.series[4].data).toStrictEqual(seriesDatas.data4)
    expect(wrapper.vm.chartOptions.series[5].data).toStrictEqual(seriesDatas.data5)
    expect(wrapper.vm.chartOptions.series[6].data).toStrictEqual(seriesDatas.data6)
    expect(wrapper.vm.chartOptions.series[7].data).toStrictEqual(seriesDatas.data7)

    //測試點擊自訂旗標是否觸發開啟dialogOpen
    const dialogOpen = vi.fn()
    wrapper.vm.$refs.refMemberJourneyDialog.dialogOpen = dialogOpen
    await wrapper.find('.export__button').trigger('click')
    expect(dialogOpen).toHaveBeenCalledWith({ type: 'add' })

    //測試旗標點擊function是否觸發dialogOpen
    const item = {
      point: {
        category: 'Date',
        title: 'Title',
        custom: {
          custom_flag_content: 'Content',
          custom_flag_operator: 'User',
          custom_flag_updated_time: 'Updated Time'
        }
      }
    }
    wrapper.vm.handleFlagEdited(item)
    expect(dialogOpen).toHaveBeenCalledWith({
      type: 'edit',
      data: {
        date: 'Date',
        title: 'Title',
        content: 'Content',
        user: 'User',
        updatedTime: 'Updated Time'
      }
    })
  })
})
