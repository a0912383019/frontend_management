import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import highchartsMore from 'highcharts/highcharts-more'

highchartsMore(Highcharts)

// Highcharts全域設定
Highcharts.setOptions({
  credits: {
    enabled: false //關閉版權宣告
  },
  title: {
    text: ''
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
