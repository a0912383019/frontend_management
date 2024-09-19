import { it, describe, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'

import {
  tooltipFormatter,
  tooltipShared,
  tooltipSingleShared,
  tooltipAddSign,
  tooltipAddSignForCol
} from '@/utils/highchartsConfig.js'

describe('Tooltip Utils', () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  globalStore.currencySign = "¥"

  it('should format tooltip using tooltipFormatter', () => {
    const testData = {
      color: 'rgb(255, 0, 0, 0.7)',
      key: 'food',
      y: 200
    }
    const result = tooltipFormatter({ data: testData, hallCode: 'esb' })
    expect(result).toMatchSnapshot()
  })

  it('should format shared tooltip using tooltipShared', () => {
    const testData = [
      {
        color: 'rgba(245,105,84,1)',
        point: {
          series: {
            name: '活躍期'
          }
        },
        y: 0.595
      }
    ]
    const result = tooltipShared({ data: testData, date: '2323/11/11', hallCode: 'esb' })
    expect(result).toMatchSnapshot()
  })

  it('should format single shared tooltip using tooltipSingleShared', () => {
    const testData = [
      {
        color: 'rgba(245,105,84,1)',
        x: 'New BB體育-足球',
        y: 49662271.24
      }
    ]
    const result = tooltipSingleShared({ data: testData, hallCode: 'esb' })
    expect(result).toMatchSnapshot()
  })

  it('should format tooltip with added sign using tooltipAddSign', () => {
    const testData = [
      {
        color: 'rgba(245,105,84,1)',
        point: {
          series: {
            name: '活躍期'
          }
        },
        y: 0.595
      }
    ]
    const result = tooltipAddSign({ data: testData, date: '2323/11/11', sign: '@' })
    expect(result).toMatchSnapshot()
  })

  it('should format tooltip with added sign using tooltipAddSignForCol', () => {
    const testData = {
      color: 'rgb(245,105,84,0.7)',
      x: '21點',
      y: 6,
      series: {
        options: {
          borderColor: 'rgb(245,105,84,1)'
        }
      }
    }
    const result = tooltipAddSignForCol({ data: testData, sign: '@' })
    expect(result).toMatchSnapshot()
  })
})
