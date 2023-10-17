import { it, describe, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import LoadingAnimation from '@/components/Loading/LoadingAnimation.vue'
import CustomPagination from '@/components/Pagination/Pagination.vue'
import TotalPagination from '@/components/Pagination/TotalPagination.vue'
import ElementPlus from 'element-plus'
import { library } from '@/utils/fontawsome.js'

describe('CustomTable', () => {
  let wrapper = null
  const tableColumns = [
    {
      label: '類別',
      prop: 'category',
      minWidth: 90,
      align: 'center'
    },
    {
      label: '內容',
      prop: 'content',
      minWidth: 340,
      align: 'center'
    },
    {
      label: '日期',
      prop: 'date',
      minWidth: 110,
      align: 'center',
      sortable: 'custom'
    },
    {
      label: '已讀',
      prop: 'read',
      align: 'center'
    }
  ]
  const tableData = [
    {
      category: 'VIP',
      content: '會員aben1989f1今天贏了 ¥65,298 元',
      date: '2023/10/10',
      msgId: 1610,
      contentCut: ['會員 ', 'aben1989f1@941777360', ' 今天贏了 ¥65,298 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員hrzhou003今天贏了 ¥46,364 元',
      date: '2023/10/09',
      msgId: 1599,
      contentCut: ['會員 ', 'hrzhou003@941749016', ' 今天贏了 ¥46,364 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員q492587657今天贏了 ¥20,653 元',
      date: '2023/10/09',
      msgId: 1600,
      contentCut: ['會員 ', 'q492587657@941753012', ' 今天贏了 ¥20,653 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員heng777近七天贏了 ¥548,978 元',
      date: '2023/10/09',
      msgId: 1603,
      contentCut: ['會員 ', 'heng777@941748272', ' 近七天贏了 ¥548,978 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員lina1964111近七天贏了 ¥771,808 元',
      date: '2023/10/09',
      msgId: 1604,
      contentCut: ['會員 ', 'lina1964111@941754049', ' 近七天贏了 ¥771,808 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員heng777今天贏了 ¥255,596 元',
      date: '2023/10/08',
      msgId: 1593,
      contentCut: ['會員 ', 'heng777@941748272', ' 今天贏了 ¥255,596 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員lina1964111今天贏了 ¥187,030 元',
      date: '2023/10/08',
      msgId: 1594,
      contentCut: ['會員 ', 'lina1964111@941754049', ' 今天贏了 ¥187,030 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員lina1964111今天贏了 ¥230,127 元',
      date: '2023/10/07',
      msgId: 1588,
      contentCut: ['會員 ', 'lina1964111@941754049', ' 今天贏了 ¥230,127 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員aben1989f1今天贏了 ¥32,103 元',
      date: '2023/10/06',
      msgId: 1581,
      contentCut: ['會員 ', 'aben1989f1@941777360', ' 今天贏了 ¥32,103 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員kissygj今天贏了 ¥54,316 元',
      date: '2023/10/06',
      msgId: 1582,
      contentCut: ['會員 ', 'kissygj@941751483', ' 今天贏了 ¥54,316 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員kelaman今天贏了 ¥65,412 元',
      date: '2023/10/06',
      msgId: 1583,
      contentCut: ['會員 ', 'kelaman@941753409', ' 今天贏了 ¥65,412 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員lina1964111今天贏了 ¥178,606 元',
      date: '2023/10/05',
      msgId: 1572,
      contentCut: ['會員 ', 'lina1964111@941754049', ' 今天贏了 ¥178,606 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員xiaoyanyan今天贏了 ¥80,693 元',
      date: '2023/10/04',
      msgId: 1565,
      contentCut: ['會員 ', 'xiaoyanyan@941757089', ' 今天贏了 ¥80,693 元'],
      kind: '1'
    },
    {
      category: 'VIP',
      content: '會員lina1964111今天贏了 ¥36,851 元',
      date: '2023/10/04',
      msgId: 1566,
      contentCut: ['會員 ', 'lina1964111@941754049', ' 今天贏了 ¥36,851 元'],
      kind: '1'
    }
  ]

  beforeEach(() => {
    wrapper = mount(CustomTable, {
      props: {
        tableData: tableData,
        tableColumns: tableColumns,
        defaultSort: { prop: 'date', order: 'ascending' }
      },
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon,
          CdpIcon,
          LoadingAnimation,
          CustomPagination,
          TotalPagination
        }
      }
    })
  })

  it('確認組件是否存在', async () => {
    expect(wrapper.vm.searchTableData).toStrictEqual(tableData)
    expect(wrapper.vm.totalDataCount).toStrictEqual(tableData.length)

    await wrapper.setProps({
      search: true
    })
    wrapper.vm.searchValue = 'f'
    const searchTableDate = [
      {
        category: 'VIP',
        content: '會員aben1989f1今天贏了 ¥65,298 元',
        date: '2023/10/10',
        msgId: 1610,
        contentCut: ['會員 ', 'aben1989f1@941777360', ' 今天贏了 ¥65,298 元'],
        kind: '1'
      },
      {
        category: 'VIP',
        content: '會員aben1989f1今天贏了 ¥32,103 元',
        date: '2023/10/06',
        msgId: 1581,
        contentCut: ['會員 ', 'aben1989f1@941777360', ' 今天贏了 ¥32,103 元'],
        kind: '1'
      }
    ]

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.searchTableData).toStrictEqual(searchTableDate)
    expect(wrapper.vm.pageTableTotal).toStrictEqual(searchTableDate.length)
  })

  it('測試emit跟update', async () => {
    await wrapper.find('.ascending i.sort-caret').trigger('click')

    expect(wrapper.emitted('sort')).toBeTruthy()
    expect(wrapper.emitted('sort')[0]).toStrictEqual([{ prop: 'date', order: null }])

    wrapper.vm.updateCurrentPage(2)

    expect(wrapper.vm.page.currentPage).toBe(2)
    expect(wrapper.emitted('update:currentPage')).toBeTruthy()

    wrapper.vm.updatePageSize(10)

    expect(wrapper.vm.page.pageSize).toBe(10)
  })
})
