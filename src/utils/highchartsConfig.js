import { getHallCurrencySign, FormatNumber } from '@/utils/commonUtils.js'

//tooltip 深色設定
export const tooltipDarkConfig = {
  //當tooltip蓋到legend時，會發生底色圖層在legend下方的問題，所以背景透明度設0，tooltip自己寫黑色背景
  backgroundColor: 'rgba(0, 0, 0, 0)',
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
    <div style="
      padding: 6px 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.8)
    ">
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

export const tooltipShared = ({ data, date, hallCode }) => {
  let result = `
    <div style="
      padding: 6px 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.8)
    ">
    <div class="font-bold mb-3">${date}</div>
    <div class="flex flex-col">
  `
  for (let i = 0; i < data.length; i++) {
    result += `
    <div class="flex">
      <div class="mr-4 mt-4" style="
        width: 10px;
        height: 10px;
        background-color: ${data[i].color};
      "></div>
      <div>
        ${data[i]['point']['series']['name']}：
        ${getHallCurrencySign('BBIN', hallCode)}
        ${FormatNumber(data[i]['y'])}
      </div>
    </div>
    `
  }
  result += `</div></div>`
  return result
}
