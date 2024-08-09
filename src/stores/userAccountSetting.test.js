import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore, useUserAccountSettingStore } from '@/stores'

describe('useUserAccountSettingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mock('@/stores/global.js', () => ({
      useGlobalStore: vi.fn()
    }))
    const mockActiveHall = {
      userTypeConfig: {
        '-1': 'GM',
        0: '一般使用者',
        1: '進階使用者',
        8: '遊戲廳管理員',
        9: '系統管理員'
      },
      userStatusConfig: {
        0: '停用',
        1: '啟用'
      }
    }
    useGlobalStore.mockReturnValue(mockActiveHall)
  })

  it('test selectUserTypeOptions', () => {
    const userAccountSettingStore = useUserAccountSettingStore()
    const expectTypeOptions = [
      {
        label: '一般使用者',
        value: '0'
      },
      {
        label: '進階使用者',
        value: '1'
      },
      {
        label: '遊戲廳管理員',
        value: '8'
      },
      {
        label: '系統管理員',
        value: '9'
      },
      {
        label: 'GM',
        value: '-1'
      }
    ]
    expect(userAccountSettingStore.selectUserTypeOptions).toEqual(expectTypeOptions)
  })

  it('test selectUserStatusOptions', () => {
    const userAccountSettingStore = useUserAccountSettingStore()
    const expectStatusOptions = [
      {
        label: '停用',
        value: '0'
      },
      {
        label: '啟用',
        value: '1'
      }
    ]
    expect(userAccountSettingStore.selectUserStatusOptions).toEqual(expectStatusOptions)
  })
})
