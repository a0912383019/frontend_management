import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  useSystemStore,
  useGlobalStore,
  useVipCommercialAnalysisStore,
  useExportListStore
} from '@/stores'
import { useRouter } from 'vue-router'
import { apiLogout } from '@/api/system.js'
import { dayjs } from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('useExportListStore', () => {
  let result
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('@/stores/global.js', () => ({
      useGlobalStore: vi.fn()
    }))
    const mockActiveHall = {
      activeHall: {
        hall_name: 'esb',
        hall_code: 'esb'
      }
    }
    useGlobalStore.mockReturnValue(mockActiveHall)

    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          ag_name: ['a001usd', 'a0110'],
          user_level: [
            {
              user_level_id: 3,
              user_level_name: '未分層'
            },
            {
              user_level_id: 4,
              user_level_name: '第1層'
            }
          ]
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
  })

  it('useExportListStore export correctly', async () => {
    const exportListStore = useExportListStore()
    expect(exportListStore.levelList).toStrictEqual([])
    expect(exportListStore.tag_description_dict).toStrictEqual({ hall: {} })

    await exportListStore.queryAgNameUserLevel()
    result.data.result.user_level.forEach(ele=>{
      expect(exportListStore.levelList[ele.user_level_id]).toStrictEqual(ele.user_level_name)
    })
  })
})
