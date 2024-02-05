import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import ExportDialog from '@/components/ExportDialog.vue'
import { i18n } from '@/global/i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'

describe('ExportDialog', () => {
  let wrapper = null
  beforeEach(() => {
    const user_info = {
      user_name: 'test'
    }
    sessionStorage.setItem('user_info', JSON.stringify(user_info))
    sessionStorage.setItem('access_token', JSON.stringify('awdedwaefjihiu'))
    wrapper = shallowMount(ExportDialog, {
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
          FontAwesomeIcon,
          CdpIcon
        }
      },
      props: {
        modelValue: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // dialog 開啟狀態
  it('visibleValue', () => {
    expect(wrapper.vm.visibleValue).toBe(true)
  })

  // 前往匯出報表清單
  it('handleGo function', async () => {
    wrapper.vm.handleGo()
    // 等待路由準備
    await router.isReady()

    // 預期前往匯出報表清單頁面
    expect(router.currentRoute.value.path).toBe('/user-export-report')
  })

  // 關閉dialog
  it('handleCancel function', () => {
    wrapper.vm.handleCancel()
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
