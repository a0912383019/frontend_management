import { it, describe, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import * as module from '@/utils/commonUtils.js'

describe('GenerateTagsBadge', () => {
  let wrapper = null
  let spy

  beforeEach(() => {
    spy = vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())

    //模擬第一次與第二次呼叫getSessionStorageEntity
    module.getSessionStorageEntity
      .mockReturnValueOnce({
        tags_config: {
          esb: {
            10001: {
              tag_type: 1,
              tag_description: '人工定義為高價值會員'
            }
          }
        }
      })
      .mockReturnValueOnce({
        tags_config: {
          esb: {
            30004: {
              tag_type: 3,
              tag_description: '近15個實動日，當日贏後下次會賭更大會員'
            }
          }
        }
      })
  })

  // 掛載元件時是否有根據tag_type的不同去切換class
  it('Switch classes according to different tag_types', async () => {
    //第一次掛載wrapper
    wrapper = shallowMount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '10001',
        badge_text_class: 'pink'
      },
      global: {
        stubs: {
          ElTooltip: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-green pink')

    //第二次掛載wrapper
    wrapper = shallowMount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '30004',
        badge_text_class: 'pink'
      },
      global: {
        stubs: {
          ElTooltip: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-blue pink')
  })
})
