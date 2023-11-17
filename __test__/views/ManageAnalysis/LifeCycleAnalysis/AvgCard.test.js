import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AvgCard from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/components/AvgCard.vue'

describe('AvgCard', () => {
  let wrapper = null
  const propsTitle = '測試標題'
  const propsPrice = '100'

  beforeEach(() => {
    wrapper = shallowMount(AvgCard, {
      props: {
        title: propsTitle,
        price: propsPrice,
        itemBgColor: '#59b7c8',
        itemShadowColor: '#2b8696',
        cardBgColor: '#dceff2'
      },
      global: {
        components: {
          FontAwesomeIcon,
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試 props 資料是否符合預期呈現
  it('test props', () => {
    let dataValue = {
      '--item-bg-color': '#59b7c8',
      '--item-shadow-color': '#2b8696',
      '--card-bg-color': '#dceff2'
    }
    expect(wrapper.vm.cssProps).toStrictEqual(dataValue)
  })

  // 驗證 card__title 是否與 props title 一致
  it('Verify whether card__title is consistent with props title', () => {
    let elCardTitle = wrapper.find('.card__title')
    expect(elCardTitle.text()).toBe(propsTitle)
  })

  // 驗證 card__price 是否與 props price 一致
  it('Verify whether card__price is consistent with props price', () => {
    let elCardPrice = wrapper.find('.card__price')
    expect(elCardPrice.text()).toBe(propsPrice)
  })
})
