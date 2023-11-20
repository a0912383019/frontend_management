import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { i18n } from '@/global/i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import router from '@/router'
import SelectTag from '@/components/Filter/SelectTag.vue'
// import SelectTagDropdown from '@/components/Filter/SelectTagDropdown.vue'
import * as module from '@/utils/commonUtils.js'

describe('SelectTag', () => {
  let wrapper = null
  let spy
  beforeEach(() => {
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())

    //模擬第一次與第二次呼叫getSessionStorageEntity
    module.getSessionStorageEntity
      .mockReturnValueOnce({
        tagsConfig: {
          esb: {
            10001: {
              tag_type: 1,
              tag_description: '人工定義為高價值會員'
            }
          }
        }
      })
      .mockReturnValueOnce({
        tagsConfig: {
          esb: {
            30004: {
              tag_type: 3,
              tag_description: '近15個實動日，當日贏後下次會賭更大會員'
            }
          }
        }
      })

    wrapper = shallowMount(SelectTag, {
      setup() {
        const tagTextAry = []
        return {
          tagTextAry
        }
      },
      props: {
        modelValue: '10001'
      },
      global: {
        stubs: {
          SelectTagDropdown: {
            template: '<div><slot /></div>'
          }
        },
        plugins: [
          i18n,
          router,
          ElementPlus,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('expect', () => {
    console.log(wrapper.vm.tagTextAry)
    // console.log(wrapper.emitted('update:modelValue'))
    // expect(wrapper.vm.selectCategoryValue).toBe('')
  })
})
