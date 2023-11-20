import { it, describe, expect, vi, beforeEach } from 'vitest'
import { useSystemStore } from '@/stores/system.js'
import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useRouter } from 'vue-router'
import { apiLogout } from '@/api/system.js'

describe('useSystemStore', () => {
  beforeEach(() => {
    vi.mock('vue-router')
    setActivePinia(createPinia())
    useRouter.mockReturnValue({
      push: vi.fn()
    })
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
      apiLogout: vi.fn()
    }))

    // 取得 store 實例
    const globalStore = useGlobalStore()
    const systemStore = useSystemStore()

    //先改變globalStore.isLoading的值，之後確認是否有改變
    globalStore.isLoading = true
    expect(globalStore.isLoading).toBe(true)
    // 調用 storeLogout 方法
    await systemStore.storeLogout()
    expect(globalStore.isLoading).toBe(false)
    expect(apiLogout).toBeCalled()
    expect(useRouter().push).toHaveBeenCalledWith({ name: 'Login' })
    expect(sessionStorageMock.clear).toHaveBeenCalled()
    expect(localStorageMock.clear).toHaveBeenCalled()
  })
})
