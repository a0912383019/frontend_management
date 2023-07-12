import { FormatNumber } from './commonUtils.js'
/**
 * 顯示 chart.js datasets 資料數值於圖表上 (bar & line chart 使用此方法，pie & polar chart 使用 chartjs-plugin-labels)
 * @param {object} chart
 * @param {int} fontSize  文字大小
 * @param {int} datasetsShowedLimit  顯示的datasets數量上限，超過不顯示
 * @param {int} dataLength  要顯示的data數量上限，超過不顯示
 * @param {int} numberPrecision  要顯示的小數點位數
 * @param {int} datalabelIndex  指定要顯示的datalabel，預設值為null，全部顯示(增加此參數原因為，遇到有多個chart line，點擊其中一個line會關閉其他的，但其他的datalabel不會關閉，在部分狀況下還是會看到顯示於畫面中)
 */
export function showDatasetsLabels(
  chart,
  fontSize = 12,
  datasetsShowedLimit = 5,
  dataLength = 20,
  numberPrecision = 0,
  datalabelIndex = []
) {
  // Define a plugin to provide data labels
  let ctx = chart.ctx
  let box = chart.boxes[0]
  let chart_layout_padding = chart.options.layout.padding // 圖表padding設定

  // dataset label添加方法
  let drawDatasetLabel = function (dataset, meta) {
    let pre_data_object = {
      dataString_width: 0,
      position_x: 0,
      position_y: 0,
      textAlign: '',
      textBaseline: ''
    }
    if (!meta.hidden && meta.data.length <= dataLength) {
      //  若資料少於設定的筆數才顯示label
      if (datalabelIndex.length === 0 || datalabelIndex.indexOf(meta.index) !== -1) {
        // 若有指定datalabelIndex則顯示指定的datalabel
        // 若為null則顯示全部
        meta.data.forEach(function (element, index) {
          // Draw the text in black, with the specified font
          ctx.fillStyle = 'rgb(0, 0, 0)'

          // let fontStyle = 'normal'
          // ctx.font = Chart.helpers.fontString(fontSize, fontStyle)

          // Just naively convert to string for now
          let dataString = FormatNumber(dataset.data[index], '', numberPrecision).toString()
          let dataString_width = ctx.measureText(dataString).width //  取得該點資料字串寬度

          // Make sure alignment settings are correct
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'

          let position = element.tooltipPosition()
          let position_x = position.x
          let position_y = position.y
          let checkIsOverlap = function () {
            //  判斷資料點文字是否有重疊
            if (ctx.textBaseline !== pre_data_object.textBaseline) {
              //  若文字baseline不同，兩點之間的高度為文字大小的兩倍距離才能確保不會重疊
              return (
                position_x - dataString_width / 2 <
                  pre_data_object.position_x + pre_data_object.dataString_width / 2 &&
                Math.abs(position_y - pre_data_object.position_y) < fontSize * 2
              )
            } else {
              return (
                position_x - dataString_width / 2 <
                  pre_data_object.position_x + pre_data_object.dataString_width / 2 &&
                Math.abs(position_y - pre_data_object.position_y) < fontSize
              )
            }
          }
          let checkIsExceedTopBorder = function () {
            //  判斷資料點文字是否有超過圖表頂端邊界
            return position_y - fontSize < 0
          }
          let checkIsOverlapTopLegend = function () {
            //  判斷資料點文字是否有重疊到上方legend
            return (
              box.position === 'top' &&
              position_y - fontSize < chart_layout_padding.top + box.height
            )
          }

          //  依據不同種類的圖表進行處理
          if (meta.type === 'horizontalBar') {
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            if (position_x + dataString_width > chart.width) {
              //  若文字超過邊界，調整文字對齊方式
              ctx.textAlign = 'right'
            }
          } else {
            position_x =
              position_x + dataString_width / 2 < chart.width
                ? position_x
                : position_x - (position_x + dataString_width / 2 - chart.width) //  若文字會超出canvas邊界，調整x軸偏移量
            if (meta.type === 'bar') {
              if (dataString.indexOf('-') === -1) {
                if (checkIsOverlap()) {
                  position_y = position_y - fontSize * 2
                  if (checkIsExceedTopBorder()) {
                    ctx.textBaseline = 'top'
                    position_y = position_y + fontSize * 2
                    if (checkIsOverlap()) {
                      position_y = position_y + fontSize * 2
                    }
                  }
                } else {
                  if (checkIsExceedTopBorder()) {
                    ctx.textBaseline = 'top'
                    if (checkIsOverlap()) {
                      position_y = position_y + fontSize * 2
                    }
                  }
                }
              } else {
                ctx.textBaseline = 'top'
                if (checkIsOverlap()) {
                  position_y = position_y + fontSize * 2
                }
              }
            } else if (meta.type === 'line') {
              position_y = position.y - fontSize / 2
              if (checkIsOverlap()) {
                if (position_y > pre_data_object.position_y) {
                  ctx.textBaseline = 'top'
                  position_y = position_y + fontSize
                } else {
                  position_y = position_y - fontSize

                  // 若legend在上方時，判斷文字是否會重疊到
                  if (checkIsOverlapTopLegend()) {
                    ctx.textBaseline = 'top'
                    position_y = position_y + fontSize * 2
                    if (checkIsOverlap()) {
                      position_y = position_y + fontSize * 2
                    }
                  }
                }
              } else {
                // 若legend在上方時，判斷文字是否會重疊到
                if (checkIsOverlapTopLegend()) {
                  ctx.textBaseline = 'top'
                  position_y = position_y + fontSize
                  if (checkIsOverlap()) {
                    position_y = position_y + fontSize * 2
                  }
                }
              }
            }
          }
          ctx.fillText(dataString, position_x, position_y)

          //  紀錄當前資料座標供下個資料判斷使用
          pre_data_object.dataString_width = dataString_width
          pre_data_object.position_x = position_x
          pre_data_object.position_y = position_y
          pre_data_object.textAlign = ctx.textAlign
          pre_data_object.textBaseline = ctx.textBaseline
        })
      }
    }
  }

  let datasets_showed_idx_ary = [] //  紀錄目前顯示的dataset index
  chart.data.datasets.forEach(function (dataset, i) {
    let meta = chart.getDatasetMeta(i)
    if (!meta.hidden) {
      datasets_showed_idx_ary.push(i)
    }
  })

  //  若datasets canvas上顯示的數量小於等於設定數量才添加label
  if (datasets_showed_idx_ary.length <= datasetsShowedLimit) {
    for (let i = 0; i < datasets_showed_idx_ary.length; i++) {
      drawDatasetLabel(
        chart.data.datasets[datasets_showed_idx_ary[i]],
        chart.getDatasetMeta(datasets_showed_idx_ary[i])
      )
    }
  }
}

/**
 * chart.js新版 dataLabels 顯示邏輯與舊版呈現不一致
 * 這邊依據當前切片區塊的數值百分比去計算
 * percentShow 用於決定是否顯示，當percent小於percentShow則不顯示
 * 目前想不到比較好的做法，若有其他做法歡迎提出改善
 * @param {Number} currentData 當前切片的數值
 * @param {Number} dataTotal 該圓餅圖所有切片數值的加總
 * @param {Number} pieSliceCount 該圓餅圖的切片數量
 */
export function showPieDatasetsLabels({ currentData = 0, dataTotal = 0, pieSliceCount = 0 }) {
  let percent = (currentData / dataTotal) * 100
  let percentShow = 10
  if (pieSliceCount >= 9) {
    percentShow = 6.9
  } else if (pieSliceCount >= 8 && pieSliceCount < 9) {
    percentShow = 7.5
  } else {
    percentShow = 9.4
  }
  if (percent < percentShow) {
    return false
  }
  return true
}

/**
 * 同上
 */
export function showPolarDatasetsLabels({ currentData = 0, dataTotal = 0, pieSliceCount = 0 }) {
  console.log('pieSliceCount', pieSliceCount)
  console.log('A:', currentData, dataTotal)
  let percent = (currentData / dataTotal) * 100
  let percentShow = 10
  if (pieSliceCount >= 9) {
    percentShow = 40
  } else if (pieSliceCount >= 5 && pieSliceCount < 9) {
    percentShow = 40
  } else {
    percentShow = 43
  }
  console.log('B:', percent)
  if (percent < percentShow) {
    return false
  }
  return true
}
