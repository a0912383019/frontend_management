import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore, useUserAccountSettingStore } from '@/stores'

describe('useUserAccountSettingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.mock('@/../public/js/system_config.js', () => ({
      hall_config_dict: {
        BBIN: {
          sk2: {
            hall_id: 3820566,
            domain_id: 0,
            hall_code: 'sk2',
            hall_name: 'SK2',
            currency_sign: '¥'
          },
          '2w': {
            hall_id: 3820568,
            domain_id: 0,
            hall_code: '2w',
            hall_name: '双盈會',
            currency_sign: '¥'
          },
          sw: {
            hall_id: 3820327,
            domain_id: 0,
            hall_code: 'sw',
            hall_name: 'SAINT WEALTH',
            currency_sign: '¥'
          },
          bmw: {
            hall_id: 1,
            domain_id: 0,
            hall_code: 'bmw',
            hall_name: '寶馬',
            currency_sign: '¥'
          }
        }
      }
    }))

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

  it('test func generateHalls correctly', async () => {
    // 取得 store 實例
    const userAccountSettingStore = useUserAccountSettingStore()

    const newHallArr = userAccountSettingStore.generateHalls(['sw'])
    const expectContent = [
      {
        hallCode: 'sw',
        label: 'BBIN －【sw】SAINT WEALTH'
      },
      {
        hallCode: 'sk2',
        label: 'BBIN －【sk2】SK2'
      },
      {
        hallCode: '2w',
        label: 'BBIN －【2w】双盈會'
      },
      {
        hallCode: 'bmw',
        label: 'BBIN －【bmw】寶馬'
      }
    ]
    expect(newHallArr).toStrictEqual(expectContent)
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
