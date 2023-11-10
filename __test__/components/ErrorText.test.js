import { it, describe, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ErrorText from '@/components/ErrorText.vue'
import { library } from '@/utils/fontawsome.js'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

library.add(faExclamationTriangle)

describe('ErrorText', () => {
  let wrapper = null
  const message = 'This is an error message'

  beforeEach(() => {
    wrapper = shallowMount(ErrorText, {
      global: {
        components: {
          FontAwesomeIcon
        }
      },
      slots: {
        default: message
      }
    })
  })

  // 確認組件是否存在
  it('expect component', () => {
    //檢查渲染的訊息
    expect(wrapper.text()).toContain(message)

    //檢查元件是否渲染
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
  })
})
