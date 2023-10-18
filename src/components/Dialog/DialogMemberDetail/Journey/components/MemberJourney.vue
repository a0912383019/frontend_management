<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberJourney } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import {
  FormatNumber,
  getHallCurrencySign,
  generateRGBColors,
  errorRespond,
  getSessionStorageEntity
} from '@/utils/commonUtils.js'
import { ElNotification, dayjs } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { chart_fixed_bgColor, RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import MemberJourneyDialog from './MemberJourneyDialog.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const refMemberJourneyDialog = ref(null)

const chartOptions = reactive({
  accessibility: {
    enabled: false
  },
  chart: {
    height: 500
  },
  xAxis: {
    plotBands: [],
    crosshair: {
      color: 'rgba(0, 0, 0, 0.3)',
      width: 1,
      zIndex: 0
    },
    lineColor: '#ccc',
    categories: []
  },
  tooltip: {
    shared: true,
    split: true,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    style: {
      width: '500px',
      fontSize: 13,
      color: '#000'
    }
  },
  yAxis: [
    {
      labels: {
        enabled: true
      },
      title: {
        text: t('customer_detail_info.net_amount_ratio')
      },
      gridLineColor: 'rgba(0, 0, 0, 0.07)'
    },
    {
      allowDecimals: false,
      labels: {
        enabled: true,
        formatter: function () {
          if (Math.floor(this.value) === this.value) {
            return Math.abs(this.value) >= 1000 ? this.value / 1000 + 'k' : this.value
          }
        }
      },
      title: {
        text: t('data_name.bet_amount')
      },
      opposite: true,
      gridLineColor: 'rgba(0, 0, 0, 0.07)'
    }
  ],
  plotOptions: {
    series: {
      allowOverlapX: false,
      clip: false,
      softThreshold: false,
      showInLegend: true
    }
  },
  series: []
})

// 取得資料
const queryMemberJourney = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  clearChart()
  try {
    const result = await apiQueryMemberJourney({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformMemberJourney(result.data.result)
    } else if (return_code !== '0001') {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

// 轉換資料
const transformMemberJourney = (data) => {
  let chart_data_this_day_step = []
  let chart_data_accumulate_bet_amount = []
  let chart_data_accumulate_bet_amount_level_flag = []
  let chart_data_accumulate_deposit_amount_level_flag = []
  let chart_data_accumulate_net_profit_ratio = []
  let chart_data_accumulate_net_profit_ratio_flag = []
  let chart_data_daily_bet_amount = []
  let chart_data_user_tag_flag = []
  let chart_data_user_tag_flag_dict = {}
  let chart_data_custom_flag = []
  data.forEach((item, index) => {
    let label = dayjs(item.data_date).format(t('date.format_date_rule'))

    chartOptions.xAxis.categories.push(dayjs(item.data_date).format(t('date.format_date_rule')))

    //  處理會員階段資料
    let step_config = RFM_NAPL_step_config[item.this_day_step]

    let this_day_step_data = {
      from: 0,
      to: data.length - 1,
      color: generateRGBColors(step_config.step_color, 0.1),
      label: {
        text: '<em>' + step_config.step_name + '</em>',
        style: {
          color: '#999999'
        },
        y: chart_data_this_day_step.length % 2 ? 40 : 20
      }
    }
    if (index === 0) {
      chart_data_this_day_step.push(this_day_step_data)
    } else if (item.this_day_step !== data[index - 1].this_day_step) {
      chart_data_this_day_step[chart_data_this_day_step.length - 1].to = index
      this_day_step_data.from = index
      chart_data_this_day_step.push(this_day_step_data)
    }
    chartOptions.xAxis.plotBands = chart_data_this_day_step

    //  處理累積淨利比資料
    chart_data_accumulate_net_profit_ratio.push(parseFloat(item.accumulate_net_profit_ratio))
    if (item.net_profit_ratio_tiptitle) {
      let net_profit_ratio_tiptitle_data = {
        x: index,
        text: item.net_profit_ratio_tiptitle.replaceAll('\n', '<br>'),
        title: t('customer_detail_info.accumulate_net_amount_ratio_detail')
      }
      chart_data_accumulate_net_profit_ratio_flag.push(net_profit_ratio_tiptitle_data)
    }

    //  處理累積貨量等級資料
    chart_data_daily_bet_amount.push(parseFloat(item.bet_amount))
    chart_data_accumulate_bet_amount.push(parseFloat(item.accumulate_bet_amount))
    if (
      index === 0 ||
      item.accumulate_bet_amount_level !== data[index - 1].accumulate_bet_amount_level
    ) {
      if (item.accumulate_bet_amount_level) {
        let accumulate_bet_amount_level_data = {
          x: index,
          text: t('customer_detail_info.accumulate_bet_amount_level_text', {
            accumulate_bet_amount: FormatNumber(
              item.accumulate_bet_amount,
              getHallCurrencySign('BBIN', activeHall.hall_code)
            )
          }),
          title: t(
            `customer_detail_info.accumulate_bet_amount_level_${item.accumulate_bet_amount_level}`
          )
        }
        chart_data_accumulate_bet_amount_level_flag.push(accumulate_bet_amount_level_data)
      }
    }

    //  處理累積存款等級資料
    if (
      index === 0 ||
      item.accumulate_deposit_amount_level !== data[index - 1].accumulate_deposit_amount_level
    ) {
      if (item.accumulate_deposit_amount_level) {
        let accumulate_deposit_amount_level_data = {
          x: index,
          text: t('customer_detail_info.accumulate_deposit_amount_level_text', {
            accumulate_deposit_amount: FormatNumber(
              item.accumulate_deposit_amount,
              getHallCurrencySign('BBIN', activeHall.hall_code)
            )
          }),
          title: t(
            `customer_detail_info.accumulate_deposit_amount_level_${item.accumulate_deposit_amount_level}`
          )
        }
        chart_data_accumulate_deposit_amount_level_flag.push(accumulate_deposit_amount_level_data)
      }
    }

    //  處理標籤資料
    let user_tag_ary = item.user_tag.split(',')

    //  移除標籤
    for (const key in chart_data_user_tag_flag_dict) {
      if (!user_tag_ary.includes(key)) {
        delete chart_data_user_tag_flag_dict[key]

        let tag_config =
          getSessionStorageEntity('system_config').tags_config[activeHall.hall_code][key]
        chart_data_user_tag_flag.push({
          x: index,
          text: t('customer_detail_info.remove_tag_from_member', { tag_name: tag_config.tag_name }),
          title: '−' + tag_config.tag_name
        })
      }
    }

    //  新增標籤
    for (let j = 0; j < user_tag_ary.length; j++) {
      if (
        user_tag_ary[j] &&
        !Object.prototype.hasOwnProperty.call(chart_data_user_tag_flag_dict, user_tag_ary[j])
      ) {
        chart_data_user_tag_flag_dict[user_tag_ary[j]] = label

        let tag_config =
          getSessionStorageEntity('system_config').tags_config[activeHall.hall_code][
            user_tag_ary[j]
          ]
        chart_data_user_tag_flag.push({
          x: index,
          text: t('customer_detail_info.tag_member_to', { tag_name: tag_config.tag_name }),
          title: '＋' + tag_config.tag_name
        })
      }
    }

    //  處理自訂旗標資料
    if (item.custom_flag_title) {
      let custom_flag_data = {
        x: index,
        text: item.custom_flag_content.replaceAll('\n', '<br>'),
        title: item.custom_flag_title,
        custom: {
          custom_flag_content: item.custom_flag_content,
          custom_flag_operator: item.custom_flag_operator,
          custom_flag_updated_time: dayjs(item.custom_flag_updated_time).format(
            t('date.format_datetime_rule')
          )
        },
        events: {
          click: function (event) {
            handleFlagEdited(event)
          }
        }
      }
      chart_data_custom_flag.push(custom_flag_data)
    }
  }) //end forEach
  let chartData = [
    {
      type: 'spline',
      dashStyle: 'dash',
      name: t('customer_detail_info.accumulate_net_amount_ratio'),
      color: generateRGBColors(chart_fixed_bgColor[1], 1),
      id: 'accumulate_net_amount_ratio',
      zIndex: 2,
      data: chart_data_accumulate_net_profit_ratio,
      visible: true,
      tooltip: {
        valueSuffix: ' %'
      }
    },
    {
      type: 'flags',
      name: t('customer_detail_info.accumulate_net_amount_ratio_detail'),
      color: generateRGBColors(chart_fixed_bgColor[1], 1),
      fillColor: generateRGBColors(chart_fixed_bgColor[1], 0.7),
      linkedTo: ':previous',
      zIndex: 2,
      allowOverlapX: true,
      data: chart_data_accumulate_net_profit_ratio_flag,
      onSeries: 'accumulate_net_amount_ratio',
      tooltip: {
        followPointer: true
      },
      events: {
        legendItemClick: function (event) {
          return event.target.linkedParent.visible
        }
      },
      visible: true
    },
    {
      type: 'flags',
      name: t('customer_detail_info.tag_info'),
      color: generateRGBColors(chart_fixed_bgColor[2], 1),
      fillColor: generateRGBColors(chart_fixed_bgColor[2], 0.7),
      zIndex: 5,
      shape: 'squarepin',
      y: -70,
      stackDistance: 20,
      data: chart_data_user_tag_flag,
      visible: true
    },
    {
      yAxis: 1,
      type: 'spline',
      dashStyle: 'dash',
      name: t('customer_detail_info.daily_bet_amount'),
      color: generateRGBColors(chart_fixed_bgColor[0], 1),
      id: 'daily_bet_amount',
      zIndex: 1,
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        lineColor: generateRGBColors(chart_fixed_bgColor[0], 1)
      },
      data: chart_data_daily_bet_amount,
      visible: true,
      tooltip: {
        pointFormatter: function () {
          return (
            '<span style="color:' +
            this.color +
            '">\u25CF</span> ' +
            this.series.name +
            ': <b>' +
            getHallCurrencySign('BBIN', activeHall.hall_code) +
            FormatNumber(this.y) +
            '</b>'
          )
        }
      }
    },
    {
      yAxis: 1,
      type: 'areaspline',
      name: t('customer_detail_info.accumulate_bet_amount'),
      lineWidth: 0,
      color: generateRGBColors(chart_fixed_bgColor[0], 0.3),
      id: 'accumulate_bet_amount',
      zIndex: 0,
      marker: {
        enabled: false
      },
      data: chart_data_accumulate_bet_amount,
      visible: true,
      tooltip: {
        pointFormatter: function () {
          return (
            '<span style="color:' +
            this.color +
            '">\u25CF</span> ' +
            this.series.name +
            ': <b>' +
            getHallCurrencySign('BBIN', activeHall.hall_code) +
            FormatNumber(this.y) +
            '</b>'
          )
        }
      }
    },
    {
      type: 'flags',
      name: t('customer_detail_info.accumulate_bet_amount_level'),
      color: generateRGBColors(chart_fixed_bgColor[0], 1),
      fillColor: generateRGBColors(chart_fixed_bgColor[0], 0.7),
      linkedTo: ':previous',
      zIndex: 3,
      shape: 'circlepin',
      data: chart_data_accumulate_bet_amount_level_flag,
      onSeries: 'accumulate_bet_amount',
      tooltip: {
        followPointer: true
      },
      events: {
        legendItemClick: function (event) {
          return event.target.linkedParent.visible
        }
      },
      visible: true
    },
    {
      type: 'flags',
      name: t('customer_detail_info.accumulate_deposit_amount_level'),
      color: generateRGBColors(chart_fixed_bgColor[4], 1),
      fillColor: generateRGBColors(chart_fixed_bgColor[4], 0.7),
      zIndex: 3,
      shape: 'circlepin',
      y: -30,
      data: chart_data_accumulate_deposit_amount_level_flag,
      visible: true
    },
    {
      type: 'flags',
      name: t('customer_detail_info.custom_flag'),
      color: generateRGBColors(chart_fixed_bgColor[3], 1),
      fillColor: generateRGBColors(chart_fixed_bgColor[3], 0.7),
      zIndex: 4,
      shape: 'squarepin',
      y: -50,
      data: chart_data_custom_flag,
      visible: true,
      cursor: 'pointer'
    }
  ]
  chartOptions.series = chartData
}

// 清空 chart
const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

// 開啟旗標dialog
const handleAdd = () => {
  refMemberJourneyDialog.value.dialogOpen({
    type: 'add'
  })
}

// 旗標更新成功，重新拿取資料
const handleFlagUpdated = () => {
  queryMemberJourney()
}

// 旗標編輯
const handleFlagEdited = (item) => {
  refMemberJourneyDialog.value.dialogOpen({
    type: 'edit',
    data: {
      date: item.point.category,
      title: item.point.title,
      content: item.point.custom.custom_flag_content,
      user: item.point.custom.custom_flag_operator,
      updatedTime: item.point.custom.custom_flag_updated_time
    }
  })
}

onMounted(() => {
  queryMemberJourney()
})
</script>
<template>
  <section class="cdp-section">
    <div class="flex justify-between items-center mb-30">
      <SectionTitle :title="$t('customer_detail_info.tab_journey')">
        <template #tooltip>
          {{ $t('customer_detail_info.member_journey_chart_reminder') }}
        </template>
      </SectionTitle>
      <ButtonIcon
        icon="plus"
        size="large"
        color="blue"
        :bg="false"
        :name="$t('customer_detail_info.custom_flag')"
        class="export__button"
        @click="handleAdd"
      />
    </div>
    <div class="relative" style="min-height: 410px">
      <CdpMessage :messageKey="messageKey" :cover="true" bg="white" v-if="apiSuccess === false" />
      <template v-else>
        <div class="cursor-pointer">
          <highcharts :options="chartOptions"></highcharts>
        </div>
      </template>
    </div>
    <MemberJourneyDialog ref="refMemberJourneyDialog" @update:flag="handleFlagUpdated" />
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  min-height: 410px;
}
</style>
