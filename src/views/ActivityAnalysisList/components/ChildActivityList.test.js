import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ChildActivityList from '@/views/ActivityAnalysisList/components/ChildActivityList.vue'
import { useActivityAnalysisStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import AddChild from '@/components/Button/AddButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'

describe('ChildActivityList', () => {
  let wrapper
  let analysisStore
  const date = new Date(2000, 1, 1, 13)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    createTestingPinia({ createSpy: vi.fn })
    analysisStore = useActivityAnalysisStore()

    wrapper = shallowMount(ChildActivityList, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        canEdit: true
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('components', () => {
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(AddChild).exists()).toBe(true)
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '子活動名稱',
        minWidth: '26%',
        prop: 'activity_detail_name'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '優惠名單',
        minWidth: '46%',
        prop: 'promotion_list'
      },
      {
        align: 'center',
        headerAlign: 'center',
        minWidth: '22%',
        prop: 'activity_date'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '6%',
        prop: 'operation'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('onMounted addChildActivity', () => {
    expect(wrapper.vm.addBtnDisabled).toStrictEqual(false)
    const subActivities = [
      {
        activity_date: '',
        detail_key: date.getTime(),
        disabled: false,
        name: '',
        name_valid: {
          msg: '',
          valid: true
        },
        offer_id: null,
        original_id: null,
        promotion_name: '',
        promotion_valid: {
          msg: '',
          valid: true
        }
      }
    ]
    expect(wrapper.vm.subActivities).toStrictEqual(subActivities)
  })

  it('deleteActivity', () => {
    wrapper.vm.subActivities = ['a', 'b', 'c']
    wrapper.vm.deleteActivity(1)
    expect(wrapper.vm.subActivities).toStrictEqual(['a', 'c'])
  })

  it('updatePromotion & clearActivityDate', () => {
    const val = JSON.stringify({
      start_time: '2025-02-07T00:00:00Z',
      end_time: '2125-02-14T23:59:59Z',
      promotion_name: 'New Year Sale',
      offer_id: 123,
      original_id: 456
    })

    const scope = { row: {} }
    wrapper.vm.updatePromotion(val, scope)
    expect(scope.row.activity_date).toStrictEqual('2025/02/07 ~ ⎻⎻⎻⎻/⎻⎻/⎻⎻')
    expect(scope.row.promotion_name).toStrictEqual('New Year Sale')
    expect(scope.row.offer_id).toStrictEqual(123)
    expect(scope.row.original_id).toStrictEqual(456)

    wrapper.vm.clearActivityDate(scope)
    expect(scope.row.activity_date).toStrictEqual('')
    expect(scope.row.promotion_name).toStrictEqual('')
    expect(scope.row.offer_id).toBeNull()
    expect(scope.row.original_id).toBeNull()
  })

  it('validSubActivities', () => {
    wrapper.vm.subActivities = [
      {
        name: 'Valid Activity',
        promotion_name: 'Promo 1',
        offer_id: 123,
        original_id: 456,
        name_valid: { valid: true, msg: '' },
        promotion_valid: { valid: true }
      }
    ]

    // 應該回傳 true 當所有子活動驗證通過
    expect(wrapper.vm.validSubActivities()).toBe(true)

    // 應該回傳 false 當 promotion_name 為空
    wrapper.vm.subActivities[0].promotion_name = ''
    expect(wrapper.vm.validSubActivities()).toBe(false)
    expect(wrapper.vm.subActivities[0].promotion_valid.valid).toBe(false)

    // 應該回傳 false 當 offer_id 或 original_id 為 null
    wrapper.vm.subActivities[0].offer_id = null
    expect(wrapper.vm.validSubActivities()).toBe(false)
    expect(wrapper.vm.subActivities[0].promotion_valid.valid).toBe(false)

    // 應該回傳 false 並顯示錯誤訊息當 name 為空
    wrapper.vm.subActivities[0].name = ''
    expect(wrapper.vm.validSubActivities()).toBe(false)
    expect(wrapper.vm.subActivities[0].name_valid.valid).toBe(false)
    expect(wrapper.vm.subActivities[0].name_valid.msg).toBe('請輸入子活動名稱')

    // 應該回傳 false 並顯示錯誤訊息當 name 超過 100 字
    wrapper.vm.subActivities[0].name = 'a'.repeat(101)
    expect(wrapper.vm.validSubActivities()).toBe(false)
    expect(wrapper.vm.subActivities[0].name_valid.valid).toBe(false)
    expect(wrapper.vm.subActivities[0].name_valid.msg).toBe('子活動名稱過長(最多為100個字元)')
  })

  it('getSubActivities', () => {
    const subActivities = ['abc']
    wrapper.vm.subActivities = subActivities
    expect(wrapper.vm.getSubActivities()).toStrictEqual(subActivities)
  })

  it('watch & transform correctly', () => {
    analysisStore.childListData = [
      {
        id: 135,
        name: 'arvin測試子活動名稱a0203115911',
        promotion_id: 0,
        original_id: 21741,
        offer_id: 33,
        operator_id: 0,
        created_time: '2025-02-06T04:57:06-04:00',
        promotion_name: '未開始未開始測試_實時優惠_自訂優惠_2025-01-18',
        promotion_start_date: '2025-01-18',
        promotion_end_date: '2025-02-28'
      }
    ]
    const subActivities = [
      {
        activity_date: '',
        detail_key: date.getTime(),
        disabled: false,
        name: '',
        name_valid: {
          msg: '',
          valid: true
        },
        offer_id: null,
        original_id: null,
        promotion_name: '',
        promotion_valid: {
          msg: '',
          valid: true
        }
      }
    ]
    expect(wrapper.vm.subActivities).toStrictEqual(subActivities)
  })

  it('max limit', async () => {
    expect(wrapper.vm.maxLimit).toBeFalsy()
    expect(wrapper.vm.addBtnDisabled).toBeFalsy()

    wrapper.vm.subActivities = [...Array(21).keys()]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.maxLimit).toBeTruthy()
    expect(wrapper.vm.addBtnDisabled).toBeTruthy()
  })
})
