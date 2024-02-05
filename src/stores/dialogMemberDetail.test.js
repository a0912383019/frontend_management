import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

describe('useSystemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mock('@/stores/dateConfig.js', () => ({
      useDateStore: vi.fn()
    }))
    const mockLastDate = {
      date_range_picker_config_7: {
        startDate: dayjs(1513823919228).add(1, 'day').subtract(3, 'month'),
        endDate: dayjs(1513823919228)
      }
    }
    useDateStore.mockReturnValue(mockLastDate)
  })

  it('should initialize dialogMemberDetailRangeDate correctly', async () => {
    // 取得 store 實例
    const dialogMemberDetailStore = useDialogMemberDetailStore()

    expect(dialogMemberDetailStore.dialogMemberDetailRangeDate).toBe('2017-09-22 ~ 2017-12-21')
    expect(dialogMemberDetailStore.state.memberData).toStrictEqual({})

    const userData = {
      user_name: 'tyf235',
      user_id: 941757304
    }
    dialogMemberDetailStore.updateMemberData(userData)
    expect(dialogMemberDetailStore.state.memberData).toStrictEqual(userData)
    expect(dialogMemberDetailStore.showMemberDialog).toBe(true)
  })
})
