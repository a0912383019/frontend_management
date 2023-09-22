import { it, describe, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PercentWithIcon from '@/components/PercentWithIcon.vue'

describe('PercentWithIcon', () => {
    let wrapper = null

    afterEach(() => {
        wrapper.unmount()
    })

    it('測試props default', () => {
        wrapper = shallowMount(PercentWithIcon, {
            global: {
                components: {
                    FontAwesomeIcon
                }
            }
        })
        expect(wrapper.vm.fontSizeClass).toContain('font-size-16')
        expect(wrapper.vm.color).toContain('cdp-text-light__slate__gray')
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
        expect(wrapper.find('.font-size-16').text()).toContain('-')
    })

    it('測試props hasColor = false', () => {
        wrapper = shallowMount(PercentWithIcon, {
            props: {
                percentData: '22',
                hasColor: false,
                iconSize: '16',
                fontSize: '18'
            },
            global: {
                components: {
                    FontAwesomeIcon
                }
            }
        })
        expect(wrapper.vm.iconSizeClass).toContain('font-size-16')
        expect(wrapper.vm.fontSizeClass).toContain('font-size-18')
        expect(wrapper.vm.color).toContain('cdp-text-light__slate__gray')
        expect(wrapper.vm.icon).toContain('fa-caret-up')
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
        expect(wrapper.find('.font-size-18').text()).toContain('22%')
    })

    it('測試props percentData = 0', () => {
        wrapper = shallowMount(PercentWithIcon, {
            props: {
                percentData: '0',
                hasColor: true,
                iconSize: '16',
                fontSize: '18'
            },
            global: {
                components: {
                    FontAwesomeIcon
                }
            }
        })
        expect(wrapper.vm.iconSizeClass).toContain('font-size-16')
        expect(wrapper.vm.fontSizeClass).toContain('font-size-18')
        expect(wrapper.vm.color).toContain('cdp-text-light__slate__gray')
        expect(wrapper.vm.icon).toContain('fa-caret-left')
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
        expect(wrapper.find('.font-size-18').text()).toContain('0%')
    })

    it('測試props percentData negative', () => {
        wrapper = shallowMount(PercentWithIcon, {
            props: {
                percentData: '-22',
                hasColor: true,
                iconSize: '16',
                fontSize: '18'
            },
            global: {
                components: {
                    FontAwesomeIcon
                }
            }
        })
        expect(wrapper.vm.iconSizeClass).toContain('font-size-16')
        expect(wrapper.vm.fontSizeClass).toContain('font-size-18')
        expect(wrapper.vm.color).toContain('text-danger')
        expect(wrapper.vm.icon).toContain('fa-caret-down')
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
        expect(wrapper.find('.font-size-18').text()).toContain('22%')
    })

    it('測試props percentData positive', () => {
        wrapper = shallowMount(PercentWithIcon, {
            props: {
                percentData: '22',
                hasColor: true,
                iconSize: '16',
                fontSize: '18'
            },
            global: {
                components: {
                    FontAwesomeIcon
                }
            }
        })
        expect(wrapper.vm.iconSizeClass).toContain('font-size-16')
        expect(wrapper.vm.fontSizeClass).toContain('font-size-18')
        expect(wrapper.vm.color).toContain('text-success')
        expect(wrapper.vm.icon).toContain('fa-caret-up')
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
        expect(wrapper.find('.font-size-18').text()).toContain('22%')
    })
})
