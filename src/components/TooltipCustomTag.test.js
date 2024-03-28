import { it, describe, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TooltipCustomTag from '@/components/TooltipCustomTag.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'

describe('CustomTagTooltip.vue', () => {
  it('tagsList and component renders correctly', () => {
    let wrapper = shallowMount(TooltipCustomTag, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        },
        stubs: {
          ElTooltip: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const tagsList = [
      {
        color: 'red',
        name: '風控'
      },
      {
        color: 'blue',
        name: '規則'
      },
      {
        color: 'orange',
        name: '機器'
      },
      {
        color: 'green',
        name: '人工'
      },
      {
        color: 'tree-green',
        name: '人工(管端)'
      }
    ]

    expect(wrapper.vm.tagsList).toStrictEqual(tagsList)
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
  })
})
