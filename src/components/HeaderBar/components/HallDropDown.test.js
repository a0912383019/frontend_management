import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useSystemStore } from '@/stores'
import { i18n } from '@/global/i18n'
import router from '@/router'
import * as module from '@/utils/commonUtils.js'
import HallDropDown from '@/components/HeaderBar/components/HallDropDown.vue'

describe('HallDropDown', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  const systemStore = useSystemStore(pinia)
  let dropDownList = [
    {
      hall_code: 'esx',
      hall_name: 'Esball',
      is_active: true
    },
    {
      hall_code: '802',
      hall_name: '金沙集团',
      is_active: false
    },
    {
      hall_code: '999',
      hall_name: '金沙Sands',
      is_active: false
    },
    {
      hall_code: 'bmw',
      hall_name: '寶馬',
      is_active: false
    }
  ]

  beforeEach(() => {
    vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    module.getSessionStorageEntity.mockReturnValueOnce({
      access_hall: 'esx,802,999,bmw'
    })

    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'Esball'
    }

    systemStore.hallConfigDict = {
      esx: {
        hall_name: 'Esball',
        hall_code: 'esx'
      },
      802: {
        hall_code: '802',
        hall_name: '金沙集团'
      },
      999: {
        hall_code: '999',
        hall_name: '金沙Sands'
      },
      bmw: {
        hall_code: 'bmw',
        hall_name: '寶馬'
      }
    }

    wrapper = shallowMount(HallDropDown, {
      global: {
        plugins: [i18n, router]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('checkActiveHall function', async () => {
    wrapper.vm.hallDropdownList = dropDownList
    let cahckResult = await wrapper.vm.checkActiveHall()
    await flushPromises()
    expect(cahckResult).toBe(0)
  })

  it('generateHeaderHallDropdown function', async () => {
    await flushPromises()
    expect(globalStore.activeHall.hall_name).toBe('Esball')
    expect(globalStore.activeHall.hall_code).toBe('esx')
    expect(wrapper.vm.hallDropdownList).toStrictEqual(dropDownList)
  })

  it('changeHeaderHall function', async () => {
    let changeHallObj = {
      hall_code: 'esx',
      hall_id: 6,
      hall_name: 'Esball',
      is_active: false
    }
    let result = [
      {
        hall_code: 'esx',
        hall_name: 'Esball',
        is_active: true
      },
      {
        hall_code: '802',
        hall_name: '金沙集团',
        is_active: false
      },
      {
        hall_code: '999',
        hall_name: '金沙Sands',
        is_active: false
      },
      {
        hall_code: 'bmw',
        hall_name: '寶馬',
        is_active: false
      }
    ]
    const restartTimer = vi.fn()
    wrapper.vm.$refs.countRef.restartTimer = restartTimer

    expect(restartTimer).toBeCalledTimes(0)

    wrapper.vm.changeHeaderHall(changeHallObj)
    await router.isReady()
    await flushPromises()
    expect(globalStore.activeHall.hall_name).toBe('Esball')
    expect(globalStore.activeHall.hall_code).toBe('esx')
    expect(wrapper.vm.hallDropdownList).toStrictEqual(result)
    expect(restartTimer).toBeCalledTimes(1)
    expect(wrapper.emitted('update:drop')).toStrictEqual([[false]])
  })
})
