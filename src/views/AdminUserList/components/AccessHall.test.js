import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import ExportCSV from '@/views/CustomerTagList/components/ExportCSV.vue'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ExportDialog from '@/components/ExportDialog.vue'
import AccessHall from '@/views/AdminUserList/components/AccessHall.vue'
import FormTitle from '@/components/Title/FormTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('AccessHall', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const getResult = {
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
    spyGet.mockResolvedValue(getResult)

    wrapper = shallowMount(AccessHall, {
      global: {
        plugins: [i18n, ElementPlus]
      },
      props: {
        userHalls: ['bmw']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('expect components', async () => {
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'ElTree' }).exists()).toBe(true)
    expect(wrapper.findComponent(FormTitle).exists()).toBe(true)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElTree' }).exists()).toBe(false)
  })

  it('generateHallsFromApi', async () => {
    await wrapper.vm.$nextTick()

    const apiHallsArr = [
      {
        hall_id: 1,
        login_code: 'bmw',
        name: '寶馬-我是廳名'
      },
      {
        hall_id: 5,
        login_code: 'liv',
        name: '淘金盈-我是金'
      }
    ]
    const allHallsTree = [
      {
        hallCode: 'bmw',
        label: 'BBIN －【bmw】寶馬-我是廳名'
      },
      {
        hallCode: 'liv',
        label: 'BBIN －【liv】淘金盈-我是金'
      }
    ]
    const allHallCode = ['bmw', 'liv']

    expect(wrapper.vm.apiHallsArr).toStrictEqual(apiHallsArr)
    expect(wrapper.vm.allHallsTree).toStrictEqual(allHallsTree)
    expect(wrapper.vm.allHallCode).toStrictEqual(allHallCode)
  })

  it('allowDrop', async () => {
    let draggingNode = { level: 1 }
    const type = 'next'
    const canDrop1 = wrapper.vm.allowDrop(draggingNode, null, type)

    expect(canDrop1).toBeTruthy()

    draggingNode.level = 2
    const canDrop2 = wrapper.vm.allowDrop(draggingNode, null, type)

    expect(canDrop2).toBeFalsy()
  })

  it('treeProps', async () => {
    expect(wrapper.vm.treeProps.disabled()).toBeTruthy()
    await wrapper.setProps({ edit: true })
    expect(wrapper.vm.treeProps.disabled()).toBeFalsy()
  })
})
