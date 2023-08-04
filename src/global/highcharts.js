import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import highchartsMore from 'highcharts/highcharts-more'
import stockInit from 'highcharts/modules/stock'

import { formatNumberWithK } from '@/utils/commonUtils.js'
highchartsMore(Highcharts)

// 初始化 flags 模組
stockInit(Highcharts)

// Highcharts全域設定
Highcharts.setOptions({
  credits: {
    enabled: false //關閉版權宣告
  },
  title: {
    text: ''
  },
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      formatter: function () {
        return formatNumberWithK(this.value)
      }
    }
  },
  accessibility: {
    enabled: false
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    style: {
      color: '#fff'
    }
  },
  legend: {
    navigation: {
      activeColor: '#3c8dbc',
      inactiveColor: '#eee'
    }
  }
})
export const highchartsRegister = (app) => {
  app.use(HighchartsVue)
}
