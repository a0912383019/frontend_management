import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import TargetGroupAnalysis from '@/views/TargetGroupAnalysis/TargetGroupAnalysis.vue'
import { useTargetGroupStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { createTestingPinia } from '@pinia/testing'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import AddTarget from '@/components/Button/AddButton.vue'
import Filter from '@/views/TargetGroupAnalysis/Filter.vue'
import { sortTableDate } from '@/utils/commonUtils.js'

describe('TargetGroupAnalysis.vue', () => {
  let wrapper = null
  let spyGet = null
  let spyDelete = null
  let targetStore = null

  beforeEach(() => {
    const date = new Date(2000, 1, 1, 13)
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const pinia = createTestingPinia({ createSpy: vi.fn })
    targetStore = useTargetGroupStore(pinia)

    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')
      const sortTableDate = vi.fn()

      return {
        ...actual,
        sortTableDate
      }
    })

    const getResult = {
      data: {
        result: [
          {
            can_operate: true,
            created_time: '2024-05-27 05:06:17',
            is_open: false,
            member_name: 'BI-CDP-Novia#3507',
            target_group_id: 'f1f0b479-18c6-4d0b-8e15-282a4ffb4c11',
            target_group_name: 'noviatest0527-111111',
            updated_time: '2024-05-27 05:08:18',
            updater_id: 307,
            uploader_id: 307
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    const deleteResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValue(getResult)
    spyDelete = vi.spyOn(axiosGoInstance, 'delete')
    spyDelete.mockResolvedValue(deleteResult)

    wrapper = shallowMount(TargetGroupAnalysis, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('test components exists', async () => {
    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(AddTarget).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)

    wrapper.vm.apiSuccess = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
  })

  it('test tableColumns & tableData & api called correctly', async () => {
    const tableColumns = [
      {
        label: '目標名稱',
        prop: 'target_group_name',
        headerAlign: 'center',
        align: 'center',
        minWidth: '30%'
      },
      {
        label: '建立帳戶',
        prop: 'member_name',
        headerAlign: 'center',
        align: 'center',
        minWidth: '15%'
      },
      {
        label: '建立時間',
        prop: 'createTime',
        headerAlign: 'center',
        align: 'center',
        minWidth: '20%',
        sortable: 'custom'
      },
      {
        label: '公開/非公開',
        prop: 'is_open',
        headerAlign: 'center',
        align: 'center',
        minWidth: '15%'
      },
      {
        label: '操作',
        prop: 'operation',
        headerAlign: 'center',
        align: 'center',
        minWidth: '20%'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)

    await flushPromises()
    expect(spyGet).toHaveBeenCalledOnce()
    expect(spyGet).toHaveBeenCalledWith('/api/auth/target_groups', expect.any(Object))
    expect(wrapper.vm.apiSuccess).toBe(true)
    const tableData = [
      {
        can_operate: true,
        createTime: '2024/05/27 05:06:17',
        created_time: '2024-05-27 05:06:17',
        is_open: false,
        member_name: 'BI-CDP-Novia#3507',
        target_group_id: 'f1f0b479-18c6-4d0b-8e15-282a4ffb4c11',
        target_group_name: 'noviatest0527-111111',
        updated_time: '2024-05-27 05:08:18',
        updater_id: 307,
        uploader_id: 307
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
    const sortParams = {
      order: 'descending',
      prop: 'createTime',
      tableData: [
        {
          can_operate: true,
          createTime: '2024/05/27 05:06:17',
          created_time: '2024-05-27 05:06:17',
          is_open: false,
          member_name: 'BI-CDP-Novia#3507',
          target_group_id: 'f1f0b479-18c6-4d0b-8e15-282a4ffb4c11',
          target_group_name: 'noviatest0527-111111',
          updated_time: '2024-05-27 05:08:18',
          updater_id: 307,
          uploader_id: 307
        }
      ]
    }
    expect(sortTableDate).toHaveBeenCalledWith(sortParams)
  })

  it('test open & close detail', async () => {
    expect(wrapper.vm.dialogVisible).toBe(false)
    const targetId = 'test-123'
    await wrapper.vm.openTargetDetail(targetId)
    expect(wrapper.vm.targetId).toStrictEqual(targetId)
    expect(wrapper.vm.dialogVisible).toBe(true)

    targetStore.tagGroupList = ['not empty']
    targetStore.groupFilterDate = ''
    expect(targetStore.tagGroupList).toStrictEqual(['not empty'])
    expect(targetStore.groupFilterDate).toStrictEqual('')

    await wrapper.vm.closeDialog()
    expect(wrapper.vm.dialogVisible).toBe(false)
    expect(targetStore.tagGroupList).toStrictEqual([])
    expect(targetStore.groupFilterDate).toStrictEqual('2000-01-01 ~ 2000-01-31')
  })

  it('test search with target name', async () => {
    expect(wrapper.vm.searchTargetGroupName).toStrictEqual('')
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(spyGet).toHaveBeenCalledWith('/api/auth/target_groups', expect.any(Object))

    const targetName = 'new target'
    await wrapper.vm.searchWithTargetName(targetName)
    expect(wrapper.vm.searchTargetGroupName).toStrictEqual(targetName)
    expect(spyGet).toHaveBeenCalledTimes(2)
  })

  it('test open & close add dialog', async () => {
    expect(targetStore.tagGroupList).toStrictEqual([])
    expect(wrapper.vm.addDialogVisible).toBe(false)

    await wrapper.vm.openAddDialog()
    expect(targetStore.tagGroupList).toStrictEqual([
      {
        custom_tag_str: '',
        custom_tags_id: '0',
        custom_tags_name: '',
        groupNameValid: true,
        tagGroupValid: true,
        validType: ''
      }
    ])
    expect(wrapper.vm.addDialogVisible).toBe(true)

    await wrapper.vm.closeAddDialog()
    expect(wrapper.vm.addDialogVisible).toBe(false)
  })

  it('test delete api', async () => {
    expect(wrapper.vm.deleteBox).toBe(false)
    expect(wrapper.vm.deleteName).toStrictEqual('')
    expect(wrapper.vm.deleteId).toStrictEqual('')

    const deleteName = 'del name'
    const deleteId = 'del-123'

    await wrapper.vm.openDeleteBox(deleteName, deleteId)
    expect(wrapper.vm.deleteName).toStrictEqual(deleteName)
    expect(wrapper.vm.deleteId).toStrictEqual(deleteId)
    expect(wrapper.vm.deleteBox).toBe(true)

    await wrapper.vm.cancelDelete()
    expect(wrapper.vm.deleteBox).toBe(false)

    await wrapper.vm.openDeleteBox(deleteName, deleteId)
    expect(wrapper.vm.deleteBox).toBe(true)
    await wrapper.vm.confirmDelete()
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledWith(`/api/auth/target_groups/${deleteId}`, expect.any(Object))
    expect(wrapper.vm.deleteBox).toBe(false)
  })
})
