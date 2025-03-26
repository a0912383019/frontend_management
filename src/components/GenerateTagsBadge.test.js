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
    module.getSessionStorageEntity.mockReturnValue({
      tags_config: {
        10001: {
          tag_type: 1,
          tag_description: '人工定義為高價值會員'
        },
        30004: {
          tag_type: 3,
          tag_description: '近15個實動日，當日贏後下次會賭更大會員'
        },
        40001: {
          tag_type: 4,
          tag_description: 'AI 判定為行為異常且較容易贏錢的會員'
        },
        60001: {
          tag_type: 6,
          tag_description: '近14天中，累積獲利天數大於6天，且累積獲利大於該遊戲風險損益閾值的玩家'
        },
        90001: {
          tag_type: 9,
          tag_description: '測試結束之後就可以刪掉囉~~~~'
        }
      }
    })
  })

  // 掛載元件時是否有根據tag_type的不同去切換class
  it('Switch classes according to different tag_types', async () => {
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

    wrapper = shallowMount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '40001',
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
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-orange pink')

    // wrapper = shallowMount(GenerateTagsBadge, {
    //   props: {
    //     hall_name: 'esb',
    //     tag_code: '60001'
    //   },
    //   global: {
    //     stubs: {
    //       ElTooltip: {
    //         template: '<div><slot /></div>'
    //       }
    //     }
    //   }
    // })
    // expect(wrapper.vm.badge_class).toBe('badge badge-custom-danger ')

    wrapper = shallowMount(GenerateTagsBadge, {
      props: {
        hall_name: 'esb',
        tag_code: '90001'
      },
      global: {
        stubs: {
          ElTooltip: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
    expect(wrapper.vm.badge_class).toBe('badge badge-custom-tree-green ')
  })
})
