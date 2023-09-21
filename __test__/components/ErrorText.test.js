import { it, describe, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ErrorText from '@/components/ErrorText.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

library.add(faExclamationTriangle)

describe('ErrorText', () => {
    let wrapper = null
    const message = 'This is an error message'
    beforeEach(() => {
        wrapper = mount(ErrorText, {
            global: {
                components: {
                    FontAwesomeIcon
                }
            },
            slots: {
                default: message,
            },
        });
    })

    it('確認組件是否存在', () => {
        //檢查渲染的訊息
        expect(wrapper.text()).toContain(message);

        //檢查元件是否渲染
        expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
    })
})
