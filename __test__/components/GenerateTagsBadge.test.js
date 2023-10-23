import { it, describe, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import * as module from '@/utils/commonUtils.js'
import ElementPlus from 'element-plus'

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
            30001: {
              tag_type: 1
            }
          }
        }
      })
      .mockReturnValueOnce({
        tags_config: {
          esb: {
            30001: {
              tag_type: 2
            }
          }
        }
      })
  })

  // 掛載元件時是否有根據tag_type的不同去切換class
  it('Switch classes according to different tag_types', async () => {
    //第一次掛載wrapper
    wrapper = mount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '30001',
        badge_text_class: 'pink'
      },
      global: {
        plugins: [ElementPlus]
      }
    })
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-danger pink')

    //第二次掛載wrapper
    wrapper = mount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '30001',
        badge_text_class: 'pink'
      },
      global: {
        plugins: [ElementPlus]
      }
    })
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-green pink')
  })
})
