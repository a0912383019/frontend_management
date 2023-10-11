import { it, describe, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import DotsSM from '@/components/Dots/DotsSM.vue'

describe('ButtonIcon', () => {
    const wrapper = shallowMount(DotsSM)

    it('DotsSM', () => {
        expect(wrapper.find('.dots').exists()).toBe(true)
    })
})
