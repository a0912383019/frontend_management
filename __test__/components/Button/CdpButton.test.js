import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CdpButton from '@/components/Button/CdpButton.vue'

describe('CdpButton', () => {
    let wrapper = null

    wrapper = shallowMount(CdpButton, {
        props: {
            name: 'btn name',
            size: 'sm-120'
        }
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('確認組件是否渲染正確', () => {
        //檢查元件是否渲染
        expect(wrapper.vm.buttonClass).toStrictEqual('cdp-btn__sm-120')
        expect(wrapper.find('.cdp-btn').text()).toStrictEqual('btn name')
    })
})
