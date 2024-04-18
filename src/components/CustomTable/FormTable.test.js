import { it, describe, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ElementPlus from 'element-plus'

describe('CustomTable', () => {
  let wrapper = null
  const tableColumns = [
    {
      prop: 'contentKey',
      minWidth: '30%',
      align: 'right'
    },
    {
      prop: 'contentData',
      minWidth: '70%',
      align: 'left'
    }
  ]

  const tableData = [
    {
      contentKey: '來源頁面',
      contentData: 'VIP 營運分析 - 日報表'
    },
    {
      contentKey: '日期',
      contentData: '2024/04/16'
    },
    {
      contentKey: '包含標籤',
      contentData: 'VIP客, 深耕客'
    }
  ]

  beforeEach(() => {
    wrapper = shallowMount(CustomTable, {
      props: {
        tableData: tableData,
        tableColumns: tableColumns,
      },
      global: {
        plugins: [i18n, ElementPlus]
      }
    })
  })

  it('Test pageTableData', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.pageTableData).toStrictEqual(tableData)
  })
})
