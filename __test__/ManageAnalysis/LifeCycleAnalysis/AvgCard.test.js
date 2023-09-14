import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AvgCard from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/components/AvgCard.vue'

describe('AvgCard', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(AvgCard, {
      props: {
        itemBgColor: '#59b7c8',
        itemShadowColor: '#2b8696',
        cardBgColor: '#dceff2'
      },
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
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

  vi.spyOn(console, 'error').mockImplementation(() => {})

  it('測試 props 資料是否符合預期呈現', () => {
    let dataValue = {
      '--item-bg-color': '#59b7c8',
      '--item-shadow-color': '#2b8696',
      '--card-bg-color': '#dceff2'
    }
    expect(wrapper.vm.cssProps).toStrictEqual(dataValue)
  })
})
