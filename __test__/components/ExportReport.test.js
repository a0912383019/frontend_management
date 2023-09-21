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

    it('確認組件是否存在', async () => {
        //檢查元件是否渲染
        expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)

        //模擬按鈕點擊事件
        await wrapper.find('.export__button').trigger('click')

        //等待訊息提示出現
        await wrapper.vm.$nextTick()

        //檢查是否顯示了警告訊息
        expect(document.querySelector('.el-message').textContent).toContain(
            '匯出報表清單單元時，再回來補上'
        )
    })
})
