import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import ActivityData from '@/views/ActivityAnalysisList/components/activityDetail/activityData/ActivityData.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ChildActivityList from '@/views/ActivityAnalysisList/components/ChildActivityList.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { apiActivityInfo, apiModifyActivity } from '@/api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createRouterMock } from 'vue-router-mock'

vi.mock('@/api', () => ({
  apiActivityInfo: vi.fn(),
  apiModifyActivity: vi.fn()
}))

describe('ActivityData', () => {
  let wrapper = null
  let activityStore
  const initChildData = vi.fn()

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })
    createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore()
    activityStore.initChildData = initChildData
    activityStore.childListData = []

    apiActivityInfo.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: {
          description: '',
          name: 'oa',
          purpose: '',
          operator_id: 249,
          operator_name: 'BI-CDP-Yu_Lan',
          created_time: '2025-02-04T02:41:51-04:00',
          detail_data: [
            {
              id: 98,
              name: 'oaoa',
              promotion_id: 0,
              original_id: 3,
              offer_id: 61,
              operator_id: 249,
              created_time: '2025-02-04T02:41:51-04:00',
              promotion_name: 'enoki-test-活動期間-隔日派發_簽到送_簽到活動_2024-03-19',
              promotion_start_date: '2024-03-19',
              promotion_end_date: '2024-04-03'
            },
            {
              id: 99,
              name: 'oaoaoa',
              promotion_id: 0,
              original_id: 4,
              offer_id: 61,
              operator_id: 249,
              created_time: '2025-02-04T02:41:51-04:00',
              promotion_name: 'test-即時-每週-累積-門檻_簽到送_簽到活動_2024-03-20',
              promotion_start_date: '2024-03-20',
              promotion_end_date: '2024-03-25'
            }
          ]
        }
      }
    })
    apiModifyActivity.mockResolvedValue({
      data: { status: { return_code: '0000' } }
    })

    wrapper = shallowMount(ActivityData, {
      global: {
        plugins: [i18n, ElementPlus, router],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(ChildActivityList).exists()).toBeTruthy()
    expect(wrapper.findComponent(CdpButton).exists()).toBeTruthy()
    expect(wrapper.findComponent(ConfirmBox).exists()).toBeTruthy()
  })

  it('confirmWidth & rules', () => {
    expect(wrapper.vm.confirmWidth).toStrictEqual(350)
    expect(wrapper.vm.rules).toStrictEqual({
      description: [
        {
          max: 1000,
          message: '活動說明內容過長(最多為1000個字元)'
        }
      ],
      name: [
        {
          message: '請輸入活動名稱',
          required: true
        },
        {
          max: 100,
          message: '活動名稱過長(最多為100個字元)'
        }
      ],
      purpose: [
        {
          max: 100,
          message: '活動目的內容過長(最多為100個字元)'
        }
      ]
    })
  })

  it('apiActivityInfo correctly & initFormAndData', async () => {
    await flushPromises()
    expect(initChildData).toBeCalledTimes(1)
    expect(apiActivityInfo).toHaveBeenCalledOnce()
    expect(wrapper.vm.validateForm.name).toStrictEqual('oa')
    expect(wrapper.vm.validateForm.purpose).toStrictEqual('')
    expect(wrapper.vm.validateForm.operatedName).toStrictEqual('BI-CDP-Yu_Lan')
    expect(wrapper.vm.validateForm.createdTime).toStrictEqual('2025/02/04 02:41:51')
    expect(wrapper.vm.validateForm.description).toStrictEqual('')
    expect(wrapper.vm.originalData).toStrictEqual({
      createdTime: '2025/02/04 02:41:51',
      description: '',
      name: 'oa',
      operatedName: 'BI-CDP-Yu_Lan',
      purpose: ''
    })
    expect(wrapper.vm.childListData).toStrictEqual([
      {
        created_time: '2025-02-04T02:41:51-04:00',
        id: 98,
        name: 'oaoa',
        offer_id: 61,
        operator_id: 249,
        original_id: 3,
        promotion_end_date: '2024-04-03',
        promotion_id: 0,
        promotion_name: 'enoki-test-活動期間-隔日派發_簽到送_簽到活動_2024-03-19',
        promotion_start_date: '2024-03-19'
      },
      {
        created_time: '2025-02-04T02:41:51-04:00',
        id: 99,
        name: 'oaoaoa',
        offer_id: 61,
        operator_id: 249,
        original_id: 4,
        promotion_end_date: '2024-03-25',
        promotion_id: 0,
        promotion_name: 'test-即時-每週-累積-門檻_簽到送_簽到活動_2024-03-20',
        promotion_start_date: '2024-03-20'
      }
    ])

    wrapper.vm.initFormAndData()
    expect(wrapper.vm.validateForm.name).toStrictEqual('')
    expect(wrapper.vm.validateForm.purpose).toStrictEqual('')
    expect(wrapper.vm.validateForm.operatedName).toStrictEqual('')
    expect(wrapper.vm.validateForm.createdTime).toStrictEqual('')
    expect(wrapper.vm.validateForm.description).toStrictEqual('')
    expect(wrapper.vm.originalData).toStrictEqual(null)
    expect(wrapper.vm.subActivities).toStrictEqual([])
    expect(initChildData).toBeCalledTimes(2)
  })

  it('edit correctly', async () => {
    await flushPromises()
    expect(wrapper.vm.editDisabled).toBeFalsy()

    expect(wrapper.vm.edit).toBeFalsy()
    wrapper.vm.handleEdit()
    expect(wrapper.vm.edit).toBeTruthy()

    expect(wrapper.vm.cancelEditBox).toBeFalsy()
    wrapper.vm.handleEditCancel()
    expect(wrapper.vm.cancelEditBox).toBeTruthy()

    let validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.formRef.validate = validate

    let clearValidate = vi.fn()
    wrapper.vm.$refs.formRef.clearValidate = clearValidate

    let validSubActivities = vi.fn().mockReturnValue(true)
    wrapper.vm.$refs.childRef.validSubActivities = validSubActivities

    const subActivitues = [{ name: 'jimmy', offer_id: 22, original_id: 33 }]
    let getSubActivities = vi.fn().mockReturnValue(subActivitues)
    wrapper.vm.$refs.childRef.getSubActivities = getSubActivities

    expect(wrapper.vm.confirmBox).toBeFalsy()
    expect(wrapper.vm.subActivities).toStrictEqual([])
    await wrapper.vm.handleEditConfirm()
    expect(clearValidate).toBeCalledTimes(1)
    expect(wrapper.vm.subActivities).toStrictEqual([
      {
        name: 'jimmy',
        offer_id: 22,
        original_id: 33
      }
    ])
    expect(wrapper.vm.confirmBox).toBeTruthy()
    expect(wrapper.vm.validClass).toStrictEqual({
      middleBlock: false,
      topBlock: false
    })

    let validateFalse = vi.fn((callback) => callback(false, { name: [expect.any(Object)] }))
    wrapper.vm.$refs.formRef.validate = validateFalse
    await wrapper.vm.handleEditConfirm()
    expect(clearValidate).toBeCalledTimes(2)
    expect(wrapper.vm.validClass).toStrictEqual({
      middleBlock: false,
      topBlock: true
    })
  })

  it('cancelExecute & confirmExecute', async () => {
    await flushPromises()
    let clearValidate = vi.fn()
    wrapper.vm.$refs.formRef.clearValidate = clearValidate

    wrapper.vm.cancelEditBox = true
    expect(wrapper.vm.cancelEditBox).toBeTruthy()
    wrapper.vm.cancelExecute()
    expect(wrapper.vm.cancelEditBox).toBeFalsy()

    wrapper.vm.validateForm.name = 'tom'
    wrapper.vm.validateForm.purpose = 'eat apple'
    wrapper.vm.validateForm.operatedName = 'eric'
    wrapper.vm.validateForm.createdTime = '2020/02/02'
    wrapper.vm.validateForm.description = 'smells good'
    wrapper.vm.edit = true
    wrapper.vm.cancelEditBox = true
    expect(wrapper.vm.validateForm.name).toStrictEqual('tom')
    expect(wrapper.vm.validateForm.purpose).toStrictEqual('eat apple')
    expect(wrapper.vm.validateForm.operatedName).toStrictEqual('eric')
    expect(wrapper.vm.validateForm.createdTime).toStrictEqual('2020/02/02')
    expect(wrapper.vm.validateForm.description).toStrictEqual('smells good')
    expect(wrapper.vm.edit).toBeTruthy()
    expect(wrapper.vm.cancelEditBox).toBeTruthy()

    wrapper.vm.confirmExecute()
    expect(wrapper.vm.validateForm.name).toStrictEqual('oa')
    expect(wrapper.vm.validateForm.purpose).toStrictEqual('')
    expect(wrapper.vm.validateForm.operatedName).toStrictEqual('BI-CDP-Yu_Lan')
    expect(wrapper.vm.validateForm.createdTime).toStrictEqual('2025/02/04 02:41:51')
    expect(wrapper.vm.validateForm.description).toStrictEqual('')
    expect(wrapper.vm.edit).toBeFalsy()
    expect(wrapper.vm.cancelEditBox).toBeFalsy()
  })

  it('cancelSaved & confirmSaved & api correctly', async () => {
    expect(wrapper.vm.confirmBox).toBeFalsy()

    wrapper.vm.confirmBox = true
    expect(wrapper.vm.confirmBox).toBeTruthy()

    wrapper.vm.cancelSaved()
    expect(wrapper.vm.confirmBox).toBeFalsy()
    expect(apiModifyActivity).toBeCalledTimes(0)

    wrapper.vm.confirmBox = true
    wrapper.vm.edit = true
    expect(wrapper.vm.confirmBox).toBeTruthy()
    expect(wrapper.vm.edit).toBeTruthy()

    wrapper.vm.confirmSaved()
    await flushPromises()
    expect(wrapper.vm.confirmBox).toBeFalsy()
    expect(apiModifyActivity).toBeCalledTimes(1)
    expect(wrapper.vm.edit).toBeFalsy()
  })

  it('organizeActivityDatail', () => {
    let subActivities = [
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33,
        other: null
      },
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33,
        other: null
      }
    ]
    wrapper.vm.subActivities = subActivities

    const subDetails = wrapper.vm.organizeActivityDatail()
    expect(subDetails).toStrictEqual([
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33
      },
      {
        name: 'aa',
        offer_id: 22,
        original_id: 33
      }
    ])
  })
})
