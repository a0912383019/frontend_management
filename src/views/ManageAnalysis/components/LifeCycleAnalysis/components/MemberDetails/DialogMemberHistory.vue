<script setup>
import { ref } from 'vue'
import { ElDialog, dayjs } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiQueryMemberStepDetail } from '@/api/manageAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import { generateRGBColors, errorRespond } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import 'chartjs-adapter-dayjs-3'

const { t } = useI18n()
const dialogTableVisible = ref(false) //dialog開啟狀態

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { deatilRangeDate } = storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //會員生明細api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const vueChart = {
  id: 'bar',
  type: 'bar',
  data: {
    xLabels: [],
    yLabels: [''],
    datasets: []
    // datasets: [
    //   {
    //     label: '活躍期',
    //     backgroundColor: 'rgb(232,70,94,0.7)',
    //     borderWidth: 1,
    //     hoverBorderWidth: 3,
    //     borderColor: 'rgb(232,70,94,1)',
    //     data: [['2023-05-08', '2023-05-15']]
    //   },
    //   {
    //     label: '活躍衰退期',
    //     backgroundColor: 'rgb(62,150,169,0.7)',
    //     borderWidth: 1,
    //     hoverBorderWidth: 3,
    //     borderColor: 'rgb(62,150,169,1)',
    //     data: [['2023-05-15', '2023-06-05']]
    //   },
    //   {
    //     label: '即將流失回頭期',
    //     backgroundColor: 'rgb(243,109,48,0.7)',
    //     borderWidth: 1,
    //     hoverBorderWidth: 3,
    //     borderColor: 'rgb(243,109,48,1)',
    //     data: [['2023-06-05', '2023-06-06']]
    //   }
    // ]
  },
  options: {
    indexAxis: 'y',
    layout: {
      padding: 0
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
          displayFormats: {
            day: t('date.format_date_rule')
          }
        },
        stacked: false,
        ticks: {
          padding: 1
        }
      },
      y: {
        stacked: true,
        ticks: {
          padding: 10,
          display: false
        }
      }
    },
    plugins: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: true,
        font: {
          size: 14
        },
        color: '#007bff',
        text: ''
      },
      legend: {
        display: true,
        position: 'top',
        // labels: {
        //   filter: function (item, chart) {
        //     // if (!step_legend_dict.hasOwnProperty(item.text)) {
        //     //   step_legend_dict[item.text] = 1
        //     //   return true
        //     // }
        //     // step_legend_dict[item.text]++
        //   }
        // },
        onClick: function (e) {
          e.stopPropagation()
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            console.log(context)
            let { formattedValue, dataset } = context
            formattedValue = JSON.parse(formattedValue)
            let result = `${dataset.label}:`

            result =
              result +
              dayjs(formattedValue[0]).format(t('date.format_date_rule')) +
              ' ~ ' +
              dayjs(formattedValue[1]).format(t('date.format_date_rule'))
            return result
          }
        }
      }
    }
  }
}

const query_member_step_detail = async (param) => {
  console.log(param, activeHall.hall_code)
  try {
    const res = await apiQueryMemberStepDetail({
      hall_name: activeHall.hall_code,
      member_id: param.user_id,
      member_step_detail_date: deatilRangeDate.value
    })
    console.log(res)
    const { return_code } = res.data.status
    const { result } = res.data
    if (return_code === '0000') {
      apiSuccess.value = true
      let chart_xLabels = []
      let chart_datasets = []
      for (let i = 0; i < result.length; i++) {
        console.log('result[i].data_date', result[i])
        let xLabel_date = dayjs(result[i].data_date).format('YYYY-MM-DD')
        chart_xLabels.push(xLabel_date)

        //  若資料為最後一筆，多加一筆在後面，以便顯示最後一筆的階段
        if (i + 1 === result.length) {
          let search_last_date = deatilRangeDate.value.split('~')[1].trim()
          let xLabel_last_date = dayjs(search_last_date).format('YYYY-MM-DD')
          xLabel_last_date = dayjs(search_last_date).add(1, 'day').format('YYYY-MM-DD')
          chart_xLabels.push(xLabel_last_date)
        }

        let step_config = RFM_NAPL_step_config[result[i].this_day_step]
        if (step_config !== undefined) {
          let dataset_config = {
            label: step_config.step_name,
            backgroundColor: generateRGBColors(step_config.step_color, 0.7),
            borderWidth: 1,
            hoverBorderWidth: 3,
            borderColor: generateRGBColors(step_config.step_color, 1),
            data: [
              [
                new Date(result[i].data_date),
                i + 1 === result.length
                  ? chart_xLabels[chart_xLabels.length - 1]
                  : new Date(result[i + 1].data_date)
              ]
            ]
          }
          chart_datasets.push(dataset_config)
        }
      }
      // console.log(chart_xLabels, chart_datasets)

      vueChart.data.xLabels = []
      vueChart.data.xLabels = chart_xLabels
      vueChart.data.datasets = []
      vueChart.data.datasets = chart_datasets
      vueChart.options.plugins.title.text = ''
      vueChart.options.plugins.title.display = param.user_name
      vueChart.options.plugins.title.text = param.user_name
      // let step_legend_dict = {}
    } else if (return_code === '0001') {
      apiSuccess.value = false
      messageKey.value = 'noResults'
      let failMsg = errorRespond(res.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(res.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.log(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//開啟 dialog
const handleOpenDialog = (param) => {
  console.log('handleOpenDialog', param)
  dialogTableVisible.value = true
  query_member_step_detail(param)
}

//關閉 dialog
const handleCloseDialog = () => {
  apiSuccess.value = false
  vueChart.data.xLabels = []
  vueChart.data.datasets = []
  vueChart.options.plugins.title.text = ''
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      class="cdp-dialog member-step-detail-dialog"
      @close="handleCloseDialog"
      :append-to-body="true"
      :title="t('manage_analysis.member_life_cycle_history')"
    >
      <div class="cdp-dialog__content">
        <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
        <div class="cdp-dialog__chart" v-else>
          <vue3-chart-js
            :id="vueChart.id"
            :type="vueChart.type"
            :data="vueChart.data"
            :options="vueChart.options"
          ></vue3-chart-js>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__chart {
    width: 100%;
    height: 300px;
  }
}
</style>
<!-- <style lang="scss">
.member-step-detail-dialog {
  &.el-dialog {
    max-width: 720px;
  }
}
</style> -->
