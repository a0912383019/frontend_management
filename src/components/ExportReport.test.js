import { it, describe, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ExportReport from '@/components/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { i18n } from '@/global/i18n'

describe('ExportReport', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(ExportReport, {
      global: {
        plugins: [i18n],
        components: {
          ButtonIcon
        }
      }
    })
  })

  // 確認組件是否存在
  it('expect component', async () => {
    //檢查元件是否渲染
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
  })
})
