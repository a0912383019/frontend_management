import { getHallCurrencySign, FormatNumber } from '@/utils/commonUtils.js'

//tooltip 深色設定
export const tooltipDarkConfig = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  style: {
    color: '#fff'
  }
}

/**
 * tooltip formatter排版
 * @param data 帶入tooltip的this
 * @param hallCode 可拿pinia globalStore 的 activeHall.hall_code帶入
 */
export const tooltipFormatter = ({ data, hallCode }) => {
  let color = data.color.split(',') //將顏色用逗號切割
  color[3] = `${0.9})` // 把rgba的透明度調成1
  color = color.join(',') // -> EX: rgb(255, 255, 255, 0.9)

  let value = getHallCurrencySign('BBIN', hallCode) + FormatNumber(data.y)
  return `
    <div>
      <div class="font-bold mb-3">${data.key}</div>
      <div class="flex">
        <div class="mr-4 mt-4" style="
          width: 10px;
          height: 10px;
          background-color: ${color};
        "></div>
        <div>
          ${data.key}：${value}
        </div>
      </div>
    </div>
  `
}
