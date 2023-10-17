import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { useSystemStore } from '@/stores/system.js'
import Account from '@/components/HeaderBar/components/Account.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import router from '@/router'

describe('Account', () => {
  let wrapper = null
  let systemStore = null
  let addEventListenerSpy = null
  let removeEventListenerSpy = null

  beforeEach(() => {
    const user_info = {
      user_name: 'BI-Yu',
      picture: 'https://lyudd.mm.mw'
    }
    sessionStorage.setItem('user_info', JSON.stringify(user_info))

    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    wrapper = shallowMount(Account, {
      global: {
        plugins: [
          router,
          i18n,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        provide: {
          sessionStorage
        }
      },
      components: {
        FontAwesomeIcon,
        CdpIcon
      }
    })
    systemStore = useSystemStore()
  })

  afterEach(() => {
    wrapper.unmount()
    systemStore = null
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)
  })

  it('預期渲染是否正確，函式是否正確呼叫', async () => {
    expect(wrapper.find('img').attributes('src')).toBe('https://lyudd.mm.mw')
    expect(wrapper.find('.accountbox__name').text()).toContain('BI-Yu')
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)

    const etarget = {
      target: document.createElement('div')
    }
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.dropdownVisible).toBe(false)

    etarget.target.className = 'targetDropDown'
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.dropdownVisible).toBe(true)

    await wrapper.find('.btn-reset').trigger('click')
    expect(systemStore.storeLogout).toHaveBeenCalled()
  })
})
