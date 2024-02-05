import { it, describe, expect, vi } from 'vitest'
import {
  showDatasetsLabels,
  showPieDatasetsLabels,
  showPolarDatasetsLabels
} from '@/utils/pluginUtils'

describe('pluginUtils', () => {
  it('showDatasetsLabels', () => {
    const chart = {
      ctx: {
        fillStyle: '',
        textAlign: '',
        textBaseline: '',
        measureText: vi.fn().mockReturnValue({ width: 50 }), //該點資料字串寬度
        fillText: vi.fn()
      },
      boxes: [{ position: 'top', height: 50 }],
      options: { layout: { padding: { top: 10 } } },
      width: 300,
      data: {
        datasets: [
          {
            data: [10, 20, 30]
          }
        ]
      },
      getDatasetMeta: vi.fn().mockReturnValue({
        hidden: false,
        data: [
          { tooltipPosition: () => ({ x: 10, y: 5 }) },
          { tooltipPosition: () => ({ x: 150, y: 50 }) },
          { tooltipPosition: () => ({ x: 250, y: 5 }) }
        ],
        type: 'bar',
        index: 0
      })
    }

    showDatasetsLabels(chart)

    expect(chart.ctx.textAlign).toBe('center')
    expect(chart.ctx.textBaseline).toBe('top')
    expect(chart.ctx.fillText).toHaveBeenCalledTimes(3)

    chart.ctx.measureText = vi.fn().mockReturnValue({ width: 150 })
    chart.getDatasetMeta = vi.fn().mockReturnValue({
      hidden: false,
      data: [
        { tooltipPosition: () => ({ x: 100, y: 30 }) },
        { tooltipPosition: () => ({ x: 250, y: 30 }) },
        { tooltipPosition: () => ({ x: 400, y: 30 }) }
      ],
      type: 'horizontalBar',
      index: 0
    })

    chart.ctx.fillText.mockClear()

    showDatasetsLabels(chart)

    expect(chart.ctx.textAlign).toBe('right')
    expect(chart.ctx.textBaseline).toBe('middle')
    expect(chart.ctx.fillText).toHaveBeenCalledTimes(3)

    chart.ctx.measureText = vi.fn().mockReturnValue({ width: 50 })
    chart.getDatasetMeta = vi.fn().mockReturnValue({
      hidden: false,
      data: [
        { tooltipPosition: () => ({ x: 20, y: 30 }) },
        { tooltipPosition: () => ({ x: 40, y: 30 }) },
        { tooltipPosition: () => ({ x: 60, y: 30 }) }
      ],
      type: 'line',
      index: 0
    })

    chart.ctx.fillText.mockClear()

    showDatasetsLabels(chart)

    expect(chart.ctx.textAlign).toBe('center')
    expect(chart.ctx.textBaseline).toBe('top')
    expect(chart.ctx.fillText).toHaveBeenCalledTimes(3)
  })

  it('showPieDatasetsLabels', () => {
    expect(showPieDatasetsLabels({ currentData: 5, dataTotal: 50, pieSliceCount: 10 })).toBe(true)
    expect(showPieDatasetsLabels({ currentData: 7, dataTotal: 70, pieSliceCount: 8 })).toBe(true)
    expect(showPieDatasetsLabels({ currentData: 5, dataTotal: 150, pieSliceCount: 7 })).toBe(false)
  })

  it('showPolarDatasetsLabels', () => {
    expect(showPolarDatasetsLabels({ currentData: 5, dataTotal: 50, pieSliceCount: 10 })).toBe(false)
    expect(showPolarDatasetsLabels({ currentData: 10, dataTotal: 10, pieSliceCount: 8 })).toBe(true)
    expect(showPolarDatasetsLabels({ currentData: 5, dataTotal: 150, pieSliceCount: 3 })).toBe(false)
  })
})
