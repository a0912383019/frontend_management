import { it, describe, expect, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import CustomTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/tagStatistics/CustomTable.vue'

describe('CustomTable', () => {
  let wrapper = null
  const tableData = [
    {
      tag_name: '長期會員',
      unit_people: 96,
      tag_code: '30096',
      bar_color: 'rgb(245,105,84,0.7)',
      is_selected: true
    },
    {
      tag_name: '慣用裝置-PC',
      unit_people: 89,
      tag_code: '30412',
      bar_color: 'rgb(0,166,90,0.7)',
      is_selected: true
    },
    {
      tag_name: '電子客',
      unit_people: 70,
      tag_code: '30010',
      bar_color: 'rgb(243,156,18,0.7)',
      is_selected: true
    },
    {
      tag_name: '乂煞氣DOGG氣煞乂',
      unit_people: 61,
      tag_code: '9289',
      bar_color: 'rgb(0,192,239,0.7)',
      is_selected: true
    },
    {
      tag_name: '欸冷人工標籤的拉改改',
      unit_people: 61,
      tag_code: '9459',
      bar_color: 'rgb(232,208,152,0.7)',
      is_selected: true
    }
  ]

  beforeEach(() => {
    wrapper = shallowMount(CustomTable, {
      global: {
        plugins: [i18n, ElementPlus]
      },
      props: {
        tableData: tableData,
        pageSize: 3
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('variables', async () => {
    expect(wrapper.vm.page).toStrictEqual({
      currentPage: 1,
      pageSize: 3
    })

    expect(wrapper.vm.pageTableData).toStrictEqual(tableData.splice(0, 3))
    wrapper.vm.updateCurrentPage(2)
    expect(wrapper.vm.page.currentPage).toStrictEqual(2)
    expect(wrapper.vm.pageTableData).toStrictEqual(tableData.splice(3, 5))
  })
})
