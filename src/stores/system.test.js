import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  useSystemStore,
  useGlobalStore,
  useVipCommercialAnalysisStore,
  useDateStore
} from '@/stores'
import { useRouter } from 'vue-router'
import { apiLogout, apiRevoke } from '@/api'
import { dayjs } from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('useSystemStore', () => {
  let spyGet

  beforeEach(() => {
    vi.mock('vue-router')
    setActivePinia(createPinia())
    useRouter.mockReturnValue({
      push: vi.fn()
    })

    // mock date
    vi.mock('@/stores/dateConfig.js', () => ({
      useDateStore: vi.fn()
    }))
    const mockLastDate = {
      date_range_picker_config_4: {
        startDate: dayjs(1513823919228),
        endDate: dayjs(1513823919228)
      },
      date_range_picker_config_8: {
        startDate: dayjs(1513823919228),
        endDate: dayjs(1513823919228)
      },
      date_range_picker_config_9: {
        startDate: dayjs(1513823919228),
        endDate: dayjs(1513823919228)
      }
    }
    useDateStore.mockReturnValue(mockLastDate)
  })

  it('calls apiLogout and clears storage on storeLogout', async () => {
    const sessionStorageMock = {
      clear: vi.fn()
    }
    global.sessionStorage = sessionStorageMock
    const localStorageMock = {
      clear: vi.fn()
    }
    global.localStorage = localStorageMock
    // 用 mock 函数替换 apiLogout
    vi.mock('@/api/system.js', () => ({
      apiLogout: vi.fn(),
      apiRevoke: vi.fn()
    }))

    // 取得 store 實例
    const globalStore = useGlobalStore()
    const systemStore = useSystemStore()
    const vipCommercialAnalysisStore = useVipCommercialAnalysisStore()

    // mock resetState function
    const resetStateMock = vi.fn()
    vipCommercialAnalysisStore.resetState = resetStateMock

    //先改變globalStore.isLoading的值，之後確認是否有改變
    globalStore.isLoading = true
    expect(globalStore.isLoading).toBe(true)
    // 調用 storeLogout 方法
    await systemStore.storeLogout()
    expect(globalStore.isLoading).toBe(false)
    expect(apiLogout).toBeCalled()
    expect(apiRevoke).toBeCalled()
    expect(resetStateMock).toHaveBeenCalled()
    expect(useRouter().push).toHaveBeenCalledWith({ name: 'Login' })
    expect(sessionStorageMock.clear).toHaveBeenCalled()
    expect(localStorageMock.clear).toHaveBeenCalled()
  })

  it('queryHalls & hallConfigDict', async () => {
    const result = {
      data: {
        result: [
          {
            name: '寶馬-我是廳名',
            login_code: 'bmw',
            hall_id: 1
          },
          {
            name: '淘金盈-我是金',
            login_code: 'liv',
            hall_id: 5
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValue(result)

    const systemStore = useSystemStore()

    expect(spyGet).toBeCalledTimes(0)
    expect(systemStore.hallConfigDict).toStrictEqual({})

    await systemStore.queryHalls()

    const expectHallConfigDict = {
      bmw: {
        hall_code: 'bmw',
        hall_name: '寶馬-我是廳名'
      },
      liv: {
        hall_code: 'liv',
        hall_name: '淘金盈-我是金'
      }
    }
    expect(spyGet).toBeCalledTimes(1)
    expect(spyGet).toBeCalledWith('/api/auth/halls')
    expect(systemStore.hallConfigDict).toStrictEqual(expectHallConfigDict)
  })
})
