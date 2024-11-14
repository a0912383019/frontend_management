import { FormatNumber } from '@/utils/commonUtils.js'
import { useGlobalStore } from '@/stores/global.js'

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
 * @param unit 單位
 * @param tooltipIconBorder icon的border
 */
export const tooltipFormatter = ({ data, hallCode = '', unit = '', tooltipIconBorder = false }) => {
  const globalStore = useGlobalStore()
  let color = data.color.split(',') //將顏色用逗號切割
  color[3] = `${0.9})` // 把rgba的透明度調成1
  color = color.join(',') // -> EX: rgb(255, 255, 255, 0.9)

  let moneySign = hallCode !== '' ? globalStore.currencySign : ''
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
          border: ${Number(tooltipIconBorder)}px solid #FFF;
        "></div>
        <div>
          ${data.key}：${moneySign + FormatNumber(data.y) + unit}
        </div>
      </div>
    </div>
  `
}

/**
 * tooltipShared formatter排版
 * @param data 帶入tooltip的this.points
 * @param date 帶入tooltip的this.x
 * @param hallCode 可拿pinia globalStore 的 activeHall.hall_code帶入
 * @param precision 顯示的小數位數
 */
export const tooltipShared = ({ data, date = '', hallCode = '', precision = 0 }) => {
  const globalStore = useGlobalStore()
  let result = `
    <div style="
      padding: 6px 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.8);
      overflow-y: scroll;
      max-height: 400px;
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
        ${hallCode !== '' ? globalStore.currencySign : ''}
        ${FormatNumber(data[i]['y'], '', precision)}
      </div>
    </div>
    `
  }
  result += `</div></div>`
  return result
}

/**
 * tooltipSingleShared formatter排版
 * @param data 帶入tooltip的this.points
 * @param hallCode 可拿pinia globalStore 的 activeHall.hall_code帶入
 * @param tooltipIconBorder icon的border
 */
export const tooltipSingleShared = ({ data, hallCode, tooltipIconBorder = false }) => {
  const globalStore = useGlobalStore()
  let result = `
    <div style="
      padding: 6px 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.8);
    ">
    <div class="flex flex-col">
  `
  for (let i = 0; i < data.length; i++) {
    result += `
    <div class="flex">
      <div class="mr-3 mt-3" style="
        width: 12px;
        height: 12px;
        background-color: ${data[i].color};
        border: ${Number(tooltipIconBorder)}px solid #FFF;
      "></div>
      <div>
        ${data[i]['x']}：
        ${globalStore.currencySign}
        ${FormatNumber(data[i]['y'])}
      </div>
    </div>
    `
  }
  result += `</div></div>`
  return result
}

/**
 * tooltipAddSign formatter排版
 * type: line
 * @param data 帶入tooltip的this.points
 * @param date 帶入tooltip的this.x
 * @param sign 帶入tooltip的符號
 */
export const tooltipAddSign = ({ data, date = '', sign = '' }) => {
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
        ${FormatNumber(data[i]['y'])}
        ${sign}
      </div>
    </div>
    `
  }
  result += `</div></div>`
  return result
}

/**
 * tooltipAddSignInFront formatter排版
 * type: line
 * @param data 帶入tooltip的this.points
 * @param date 帶入tooltip的this.x
 * @param sign 帶入tooltip的符號
 */
export const tooltipAddSignInFront = ({ data, date = '', sign = '' }) => {
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
        ${sign}
        ${FormatNumber(data[i]['y'])}
      </div>
    </div>
    `
  }
  result += `</div></div>`
  return result
}

/**
 * tooltipAddSignForCol formatter排版
 * type: column
 * @param data 帶入tooltip的this
 * @param sign 帶入tooltip的符號
 */
export const tooltipAddSignForCol = ({ data, sign = '' }) => {
  let result = `
    <div>
      <div style="
        padding: 6px 10px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.8)
      ">
        <div class="flex">
          <div class="mr-4 mt-4" style="
            width: 10px;
            height: 10px;
            background-color: ${data.series.options.borderColor};
            opacity: 1;
          "></div>
          <div>
            ${data.x}：${data.y}${sign}
          </div>
        </div>
      <div class="flex flex-col">
    </div>
  `
  return result
}

/**
 * tooltipColumnSeparate formatter排版
 * type: column
 * @param data 帶入tooltip的this
 * @param sign 帶入tooltip的符號
 */
export const tooltipColumnSeparate = ({ data, sign = '' }) => {
  let result = `
    <div>
      <div style="
        padding: 6px 10px;
        border-radius: 5px;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.8)
      ">
        <div class="font-bold">${data.series.name}</div>
        <div class="flex">
          <div class="mr-4 mt-4" style="
            width: 10px;
            height: 10px;
            background-color: ${data.series.userOptions.color};
            border: 1px solid #FFF;
            opacity: 1;
          "></div>
          <div>
            ${data.x}：${data.y}${sign}
          </div>
        </div>
      <div class="flex flex-col">
    </div>
  `
  return result
}
