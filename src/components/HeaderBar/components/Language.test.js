import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import Language from '@/components/HeaderBar/components/Language.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'

describe('Language', () => {
  let wrapper = null
  let addEventListenerSpy = null
  let removeEventListenerSpy = null

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    wrapper = shallowMount(Language, {
      global: {
        plugins: [i18n],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClicks)
  })

  // 預期渲染與開啟下拉是否正確，函式是否正確呼叫
  it('test component, test function', async () => {
    expect(wrapper.vm.i18nLocale).toStrictEqual('zh-TW')
    expect(wrapper.vm.langLabel).toBe('繁體中文')
    expect(wrapper.vm.options[1].active).toBe(true)
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleDocumentClicks)

    const etarget = {
      target: document.createElement('div')
    }
    await wrapper.vm.handleDocumentClicks(etarget)
    expect(wrapper.vm.dropdownVisibles).toBe(false)

    etarget.target.className = 'targetDropDowns'
    await wrapper.vm.handleDocumentClicks(etarget)
    expect(wrapper.vm.dropdownVisibles).toBe(true)

    await wrapper.findAll('.lang__dropdown button')[0].trigger('click')
    expect(wrapper.vm.dropdownVisibles).toBe(false)
    expect(wrapper.vm.i18nLocale).toStrictEqual('en')
    expect(wrapper.vm.langLabel).toBe('English')
    expect(wrapper.vm.options[0].active).toBe(true)
  })
})
