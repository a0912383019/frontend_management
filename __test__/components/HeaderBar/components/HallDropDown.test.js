import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import router from '@/router'
import * as module from '@/utils/commonUtils.js'
import HallDropDown from '@/components/HeaderBar/components/HallDropDown.vue'

describe('HallDropDown', () => {
  let wrapper = null
  let spy
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  let dropDownList = [
    {
      hall_id: 6,
      domain_id: 0,
      hall_code: 'esx',
      hall_name: 'Esball',
      currency_sign: '¥',
      is_active: true
    },
    {
      hall_id: 3819866,
      domain_id: 0,
      hall_code: '802',
      hall_name: '金沙集团',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 3820600,
      domain_id: 0,
      hall_code: '999',
      hall_name: '金沙Sands',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 1,
      domain_id: 0,
      hall_code: 'bmw',
      hall_name: '寶馬',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 3820431,
      domain_id: 0,
      hall_code: '15',
      hall_name: '新葡京娱乐城',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 3820240,
      domain_id: 0,
      hall_code: '18',
      hall_name: 'GALAXY TM銀河貴賓會',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 3819875,
      domain_id: 0,
      hall_code: '22',
      hall_name: '金沙娛樂場jinsha macao',
      currency_sign: '¥',
      is_active: false
    },
    {
      hall_id: 3820455,
      domain_id: 0,
      hall_code: '31',
      hall_name: '银河娱乐城',
      currency_sign: '¥',
      is_active: false
    }
  ]

  beforeEach(() => {
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())

    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'Esball'
    }

    module.getSessionStorageEntity.mockReturnValueOnce({
      access_hall: 'esx,802,999,bmw,15,18,22,31'
    })

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
      currency_sign: '¥',
      domain_id: 0,
      hall_code: 'esx',
      hall_id: 6,
      hall_name: 'Esball',
      is_active: false
    }
    let result = [
      {
        hall_id: 6,
        domain_id: 0,
        hall_code: 'esx',
        hall_name: 'Esball',
        currency_sign: '¥',
        is_active: true
      },
      {
        hall_id: 3819866,
        domain_id: 0,
        hall_code: '802',
        hall_name: '金沙集团',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 3820600,
        domain_id: 0,
        hall_code: '999',
        hall_name: '金沙Sands',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 1,
        domain_id: 0,
        hall_code: 'bmw',
        hall_name: '寶馬',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 3820431,
        domain_id: 0,
        hall_code: '15',
        hall_name: '新葡京娱乐城',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 3820240,
        domain_id: 0,
        hall_code: '18',
        hall_name: 'GALAXY TM銀河貴賓會',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 3819875,
        domain_id: 0,
        hall_code: '22',
        hall_name: '金沙娛樂場jinsha macao',
        currency_sign: '¥',
        is_active: false
      },
      {
        hall_id: 3820455,
        domain_id: 0,
        hall_code: '31',
        hall_name: '银河娱乐城',
        currency_sign: '¥',
        is_active: false
      }
    ]
    await wrapper.vm.changeHeaderHall(changeHallObj)
    expect(globalStore.activeHall.hall_name).toBe('Esball')
    expect(globalStore.activeHall.hall_code).toBe('esx')
    expect(wrapper.vm.hallDropdownList).toStrictEqual(result)
    expect(wrapper.emitted('update:drop')).toStrictEqual([[false]])
  })
})
