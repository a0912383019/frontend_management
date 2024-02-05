import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import NotificationTables from '@/views/Home/components/NotificationTables.vue'
import { useDateStore } from '@/stores/dateConfig.js'
import { useGlobalStore } from '@/stores/global.js'
import ElementPlus, { dayjs } from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('NotificationTables.vue', () => {
  let wrapper = null
  let globalStore = null
  let dateStore = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  globalStore = useGlobalStore(pinia)
  dateStore = useDateStore(pinia)

  dateStore.date_range_picker_config_8.startDate = dayjs(1513823919228)
    .add(1, 'day')
    .subtract(7, 'day')
  dateStore.date_range_picker_config_8.endDate = dayjs(1513823919228)

  afterEach(() => {
    wrapper = null
  })

  it('Expected components render correctly', () => {
    globalStore.activeHall = {
      hall_name: '',
      hall_code: ''
    }
    wrapper = shallowMount(NotificationTables, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })
    //預期轉換後的資料
    const tabList = [
      { name: 'all', label: '全部' },
      { name: 'vip', label: 'VIP' },
      { name: 'caution', label: '警示' },
      { name: 'target', label: '觀測指標' },
      { name: 'game', label: '遊戲' }
    ]
    expect(wrapper.vm.tabList).toStrictEqual(tabList)

    const tableColumns = [
      { label: '類別', prop: 'category', minWidth: 90, align: 'center' },
      { label: '內容', prop: 'content', minWidth: 340, align: 'center' },
      { label: '日期', prop: 'date', minWidth: 110, align: 'center' },
      { label: '已讀', prop: 'read', align: 'center' }
    ]
    expect(wrapper.vm.searchDate).toStrictEqual('2017/12/15~2017/12/21')
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)

    //測試transformUser function
    const inputString = 'kissygj@941751483'
    const expectedResult = {
      user_name: 'kissygj',
      user_id: 941751483
    }
    const transformUser = wrapper.vm.transformUser(inputString)
    expect(transformUser).toEqual(expectedResult)
  })

  it('Is triggering watch and mock api as expected?', async () => {
    const getResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            message_id: 1942,
            kind: '1',
            content: '會員 #kissygj@941751483# 今天贏了 ¥42,149 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1945,
            kind: '2',
            content: '會員 #tyf235@941757304# 今天輸了 ¥984,924 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1946,
            kind: '1',
            content: '會員 #tyf235@941757304# 近七天贏了 ¥1,110,260 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1947,
            kind: '2',
            content: '會員 #kissygj@941751483# 近七天輸了 ¥271,754 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1952,
            kind: '2',
            content: '會員 #xie001f1@941777038# 近七天輸了 ¥337,619 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1953,
            kind: '2',
            content: '會員 #junejuneclub@941759256# 近期有點疲乏了',
            created_time: '2023-11-20'
          },
          {
            message_id: 1954,
            kind: '2',
            content: '會員 #brr0511417@948673512# 今天存款大幅度提升',
            created_time: '2023-11-20'
          },
          {
            message_id: 1955,
            kind: '4',
            content: 'PG電子 平台的 卡牌 遊戲今日虧損 ¥50,373 元',
            created_time: '2023-11-20'
          },
          {
            message_id: 1956,
            kind: '3',
            content: '會員 #vip88888888@941753330# 消失一陣子又回來玩了',
            created_time: '2023-11-20'
          }
        ]
      }
    }
    const spyGet = vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(getResult)

    const putResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    const spyPut = vi.spyOn(axiosGoInstance, 'put').mockResolvedValue(putResult)

    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }
    wrapper = shallowMount(NotificationTables, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    //等待異步完成
    await flushPromises()
    expect(spyGet).toHaveBeenCalledTimes(1)

    const tableAll = {
      0: [
        {
          category: 'VIP',
          content: '會員kissygj今天贏了 ¥42,149 元',
          date: '2023/11/20',
          msgId: 1942,
          contentCut: ['會員 ', 'kissygj@941751483', ' 今天贏了 ¥42,149 元'],
          kind: '1'
        },
        {
          category: '警示',
          content: '會員tyf235今天輸了 ¥984,924 元',
          date: '2023/11/20',
          msgId: 1945,
          contentCut: ['會員 ', 'tyf235@941757304', ' 今天輸了 ¥984,924 元'],
          kind: '2'
        },
        {
          category: 'VIP',
          content: '會員tyf235近七天贏了 ¥1,110,260 元',
          date: '2023/11/20',
          msgId: 1946,
          contentCut: ['會員 ', 'tyf235@941757304', ' 近七天贏了 ¥1,110,260 元'],
          kind: '1'
        },
        {
          category: '警示',
          content: '會員kissygj近七天輸了 ¥271,754 元',
          date: '2023/11/20',
          msgId: 1947,
          contentCut: ['會員 ', 'kissygj@941751483', ' 近七天輸了 ¥271,754 元'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員xie001f1近七天輸了 ¥337,619 元',
          date: '2023/11/20',
          msgId: 1952,
          contentCut: ['會員 ', 'xie001f1@941777038', ' 近七天輸了 ¥337,619 元'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員junejuneclub近期有點疲乏了',
          date: '2023/11/20',
          msgId: 1953,
          contentCut: ['會員 ', 'junejuneclub@941759256', ' 近期有點疲乏了'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員brr0511417今天存款大幅度提升',
          date: '2023/11/20',
          msgId: 1954,
          contentCut: ['會員 ', 'brr0511417@948673512', ' 今天存款大幅度提升'],
          kind: '2'
        },
        {
          category: '遊戲',
          content: 'PG電子 平台的 卡牌 遊戲今日虧損 ¥50,373 元',
          date: '2023/11/20',
          msgId: 1955,
          contentCut: ['PG電子 平台的 卡牌 遊戲今日虧損 ¥50,373 元'],
          kind: '4'
        },
        {
          category: '觀測指標',
          content: '會員vip88888888消失一陣子又回來玩了',
          contentCut: ['會員 ', 'vip88888888@941753330', ' 消失一陣子又回來玩了'],
          date: '2023/11/20',
          kind: '3',
          msgId: 1956
        }
      ],
      1: [
        {
          category: 'VIP',
          content: '會員kissygj今天贏了 ¥42,149 元',
          date: '2023/11/20',
          msgId: 1942,
          contentCut: ['會員 ', 'kissygj@941751483', ' 今天贏了 ¥42,149 元'],
          kind: '1'
        },
        {
          category: 'VIP',
          content: '會員tyf235近七天贏了 ¥1,110,260 元',
          date: '2023/11/20',
          msgId: 1946,
          contentCut: ['會員 ', 'tyf235@941757304', ' 近七天贏了 ¥1,110,260 元'],
          kind: '1'
        }
      ],
      2: [
        {
          category: '警示',
          content: '會員tyf235今天輸了 ¥984,924 元',
          date: '2023/11/20',
          msgId: 1945,
          contentCut: ['會員 ', 'tyf235@941757304', ' 今天輸了 ¥984,924 元'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員kissygj近七天輸了 ¥271,754 元',
          date: '2023/11/20',
          msgId: 1947,
          contentCut: ['會員 ', 'kissygj@941751483', ' 近七天輸了 ¥271,754 元'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員xie001f1近七天輸了 ¥337,619 元',
          date: '2023/11/20',
          msgId: 1952,
          contentCut: ['會員 ', 'xie001f1@941777038', ' 近七天輸了 ¥337,619 元'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員junejuneclub近期有點疲乏了',
          date: '2023/11/20',
          msgId: 1953,
          contentCut: ['會員 ', 'junejuneclub@941759256', ' 近期有點疲乏了'],
          kind: '2'
        },
        {
          category: '警示',
          content: '會員brr0511417今天存款大幅度提升',
          date: '2023/11/20',
          msgId: 1954,
          contentCut: ['會員 ', 'brr0511417@948673512', ' 今天存款大幅度提升'],
          kind: '2'
        }
      ],
      3: [
        {
          category: '觀測指標',
          content: '會員vip88888888消失一陣子又回來玩了',
          contentCut: ['會員 ', 'vip88888888@941753330', ' 消失一陣子又回來玩了'],
          date: '2023/11/20',
          kind: '3',
          msgId: 1956
        }
      ],
      4: [
        {
          category: '遊戲',
          content: 'PG電子 平台的 卡牌 遊戲今日虧損 ¥50,373 元',
          date: '2023/11/20',
          msgId: 1955,
          contentCut: ['PG電子 平台的 卡牌 遊戲今日虧損 ¥50,373 元'],
          kind: '4'
        }
      ]
    }
    expect(wrapper.vm.tableAll).toStrictEqual(tableAll)

    const fakeTarget = document.createElement('div')
    fakeTarget.classList.add('el-table__row')

    // 模擬事件對象
    const fakeEvent = { target: fakeTarget }
    // 呼叫 msgCheck 函數並傳遞模擬的事件
    wrapper.vm.msgCheck(fakeEvent, 1942)
    // 斷言 .remove-style 類是否被添加到 .el-table__row 上
    expect(fakeTarget.classList.contains('remove-style')).toBe(true)

    //等待異步完成
    await flushPromises()
    expect(spyPut).toHaveBeenCalledWith('/api/auth/home/smart_message_notification', {
      hall_name: wrapper.vm.activeHall.hall_code,
      message_id: 1942
    })
    expect(spyGet).toHaveBeenCalledTimes(2)

    //觸發搜尋watch
    wrapper.vm.searchText = 'junejuneclub'
    await flushPromises()
    expect(wrapper.vm.tableData).toStrictEqual([tableAll[2][3]])
    expect(wrapper.vm.tableDataLength).toStrictEqual(tableAll[0].length)

    //觸發切換tab watch
    const goToFirstPage = vi.fn()
    wrapper.vm.$refs.refTable.goToFirstPage = goToFirstPage
    wrapper.vm.currentTabs = 'vip'
    await flushPromises()
    expect(goToFirstPage).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toStrictEqual(tableAll[1])

    //觸發切換語系watch
    wrapper.vm.i18nLocale = 'en'
    await flushPromises()
    expect(spyGet).toHaveBeenCalledTimes(3)
  })
})
