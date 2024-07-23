import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTargetGroupStore } from '@/stores/targetGroupAnalysis.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

describe('useSystemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mock('@/stores/dateConfig.js', () => ({
      useDateStore: vi.fn()
    }))
    const mockLastDate = {
      date_range_picker_config_1: {
        startDate: dayjs(1513823919228).add(1, 'day').subtract(1, 'month'),
        endDate: dayjs(1513823919228)
      }
    }
    useDateStore.mockReturnValue(mockLastDate)
  })

  it('should initialize targetNameRule & groupFilterDate & filtered correctly', async () => {
    // 取得 store 實例
    const targetGroupStore = useTargetGroupStore()

    const mockValidateTargetName = vi.fn()
    targetGroupStore.targetNameRule[1].validator = mockValidateTargetName
    expect(targetGroupStore.targetNameRule).toStrictEqual([
      {
        message: '請輸入目標名稱',
        required: true
      },
      {
        trigger: 'blur',
        validator: mockValidateTargetName
      }
    ])

    expect(targetGroupStore.groupFilterDate).toStrictEqual("2017-11-22 ~ 2017-12-21")

    expect(targetGroupStore.filtered).toStrictEqual(0)
  })

  it('test validateTargetName', () => {
    const targetGroupStore = useTargetGroupStore()

    const callback = vi.fn()

    const value1 = ''
    targetGroupStore.validateTargetName({}, value1, callback)
    expect(callback).toHaveBeenCalledWith(new Error('請輸入目標名稱'))

    const value2 = 'This is a very long target name'
    targetGroupStore.validateTargetName({}, value2, callback)
    expect(callback).toHaveBeenCalledWith(new Error('名稱過長(最多為20個字元)'))

    const value3 = 'correct name'
    targetGroupStore.validateTargetName({}, value3, callback)
    expect(callback).toHaveBeenCalled()
  })
})
