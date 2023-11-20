import { it, describe, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useRouter } from 'vue-router'

describe('useSystemStore', () => {
  beforeEach(() => {
    vi.mock('vue-router')
    setActivePinia(createPinia())
    useRouter.mockReturnValue({
      push: vi.fn()
    })
  })

  it('calls storeHandleApiError and clears storage on storeLogout', async () => {
    const sessionStorageMock = {
      clear: vi.fn()
    }
    global.sessionStorage = sessionStorageMock
    const localStorageMock = {
      clear: vi.fn()
    }
    global.localStorage = localStorageMock

    // 取得 store 實例
    const globalStore = useGlobalStore()

    // 調用 storeHandleApiError 方法
    await globalStore.storeHandleApiError()
    expect(useRouter().push).toHaveBeenCalledWith({ name: 'Login' })
    expect(sessionStorageMock.clear).toHaveBeenCalled()
    expect(localStorageMock.clear).toHaveBeenCalled()

    const lobbyGroupConfig = {
      live: '視訊',
      prob: '電子',
      card: '棋牌',
      sport: '體育',
      lottery: '彩票',
      mahjong: '麻將'
    }
    expect(globalStore.lobbyGroupConfig).toStrictEqual(lobbyGroupConfig)
    const tableConfig = {
      0: {
        step_name: '尚未註冊',
        step_description: '',
        step_color: [128, 128, 192],
        step_icon: '',
        step_dot: ''
      },
      1: {
        step_name: '活躍期',
        step_color: [232, 70, 94],
        step_vue_icon: 'fa-solid fa-person-running',
        step_vue_dot_color: 'cdp-bg-paradisepink',
        step_description: '有「持續下注」會員'
      },
      2: {
        step_name: '新客成長期',
        step_color: [19, 91, 134],
        step_vue_icon: 'fa-solid fa-baby',
        step_vue_dot_color: 'cdp-bg-lapislazuli',
        step_description: '註冊或登入會員「產生下注或存款行為」'
      },
      3: {
        step_name: '最有價值成長期',
        step_color: [249, 180, 12],
        step_vue_icon: 'fa-solid fa-person-skating',
        step_vue_dot_color: 'cdp-bg-selectiveyellow',
        step_description: '有下注或存款行為會員「持續存款三次以上」'
      },
      4: {
        step_name: '即將流失回頭期',
        step_color: [243, 109, 48],
        step_vue_icon: 'fa-solid fa-person-hiking',
        step_vue_dot_color: 'cdp-bg-orangered',
        step_description: '「有些時間」沒有回來的會員「再度回來下注或存款」'
      },
      5: {
        step_name: '流失挽回期',
        step_color: [146, 41, 67],
        step_vue_icon: 'fa-solid fa-wheelchair',
        step_vue_dot_color: 'cdp-bg-redviolet',
        step_description: '「很久」沒有回來的會員「再度回來下注或存款」'
      },
      6: {
        step_name: '活躍衰退期',
        step_color: [62, 150, 169],
        step_vue_icon: 'fa-solid fa-bed-pulse',
        step_vue_dot_color: 'cdp-bg-bluemunsell',
        step_description: '有產生下注或存款行為的會員「有段時間」沒有回來'
      },
      7: {
        step_name: '流失期',
        step_color: [148, 195, 199],
        step_vue_icon: 'fa-solid fa-skull-crossbones',
        step_vue_dot_color: 'cdp-bg-opal',
        step_description: '有產生下注或存款行為的會員「很久」沒有回來'
      },
      null: {
        step_name: '未分類',
        step_description: '未分類',
        step_color: [128, 128, 192],
        step_icon: '',
        step_dot: ''
      }
    }
    expect(globalStore.tableConfig).toStrictEqual(tableConfig)
  })
})
