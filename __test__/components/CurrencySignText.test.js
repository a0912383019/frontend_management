import { it, describe, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import router from '@/router'
import CurrencySignText from '@/components/CurrencySignText.vue'
import { createTestingPinia } from '@pinia/testing'

describe('CurrencySignText', () => {
    let wrapper = null

    beforeEach(() => {
        wrapper = shallowMount(CurrencySignText, {
            global: {
                plugins: [i18n, router, createTestingPinia(
                    {
                        createSpy: vi.fn
                    }
                )]
            }
        })
    })

    it('觸發watch，確認資料轉變', async () => {
        wrapper.vm.activeHall.hall_code = 'esb'
        await wrapper.vm.$nextTick()

        const currencyObject = {
            currency: 'currency.currency',
            currencySign: 'currency.currency_¥',
            currencySignText: '¥'
        }

        const currencyHtml = '<div> (幣別： 人民幣¥) </div>'
        expect(wrapper.vm.currencyObj).toStrictEqual(currencyObject)
        expect(wrapper.vm.isReady).toBe(true)
        expect(wrapper.find('div').html()).toBe(currencyHtml)
    })
})
