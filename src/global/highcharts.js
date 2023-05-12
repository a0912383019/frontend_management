import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
// Highcharts全域設定
Highcharts.setOptions({
  credits: {
    enabled: false, //關閉版權宣告
  },
  accessibility: {
    enabled: false,
  },
});
export const highchartsRegister = (app) => {
  app.use(HighchartsVue);
};
