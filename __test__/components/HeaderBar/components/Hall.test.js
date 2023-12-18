import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import Hall from '@/components/HeaderBar/components/Hall.vue'

describe('Hall', () => {
  let wrapper = null
  let addEventListenerSpy = null
  let removeEventListenerSpy = null

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    wrapper = shallowMount(Hall, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)
  })

  it('closeDrop function', async () => {
    await wrapper.vm.closeDrop()
    expect(wrapper.vm.isDropOpen).toBe(false)
  })

  it('handleDocumentClick functin', async () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClick)

    const etarget = {
      target: document.createElement('div')
    }
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.isDropOpen).toBe(false)

    etarget.target.className = 'targetHallBox'
    await wrapper.vm.handleDocumentClick(etarget)
    expect(wrapper.vm.isDropOpen).toBe(true)
  })
})
