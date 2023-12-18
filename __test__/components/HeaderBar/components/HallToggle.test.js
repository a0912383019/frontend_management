import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import HallToggle from '@/components/HeaderBar/components/HallToggle.vue'

describe('HallToggle', () => {
  let wrapper = null
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)

  beforeEach(() => {
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'Esball'
    }
    wrapper = shallowMount(HallToggle, {
      global: {
        plugins: [i18n, router],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('html', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
