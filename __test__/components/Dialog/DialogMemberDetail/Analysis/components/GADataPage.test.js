import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Tab from '@/components/Tab.vue'
import GADataPage from '@/components/Dialog/DialogMemberDetail/Analysis/components/GADataPage.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'

describe('GADataPage.vue', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    const result1 = {
      status: {
        return_code: '0000',
        message: 'Successfully query_ga_page_path_rank'
      },
      result: [
        {
          page_path: '/m/new/login',
          hits_count: 36
        },
        {
          page_path: '/web/mobile/login',
          hits_count: 27
        }
      ]
    }
    const result2 = {
      status: {
        return_code: '0000',
        message: 'Successfully query_ga_data_source'
      },
      result: [
        {
          data_date: '2023-10-24',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        },
        {
          data_date: '2023-10-23',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        },
        {
          data_date: '2023-10-19',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        },
        {
          data_date: '2023-10-18',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        },
        {
          data_date: '2023-10-16',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        },
        {
          data_date: '2023-10-15',
          referral_path: '(not set)',
          campaign: '(not set)',
          source_medium: '(direct) / (none)',
          keyword: '(not set)',
          social_network: '(not set)'
        }
      ]
    }
    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/member/ga_page_path_rank':
          return Promise.resolve({ data: result1 })
        case '/api/auth/member/ga_data_source':
          return Promise.resolve({ data: result2 })
        default:
          return error
      }
    })
    wrapper = mount(GADataPage, {
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
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.vm.clickRankApiSuccess).toStrictEqual(false)
    expect(wrapper.vm.sourceDataApiSuccess).toStrictEqual(false)
    //等待異步完成
    await flushPromises()
    expect(wrapper.vm.clickRankApiSuccess).toStrictEqual(true)
    expect(wrapper.vm.sourceDataApiSuccess).toStrictEqual(true)

    const clickRankTableData = [
      { path: '/m/new/login', times: 36 },
      { path: '/web/mobile/login', times: 27 }
    ]
    expect(wrapper.vm.clickRankTableData).toStrictEqual(clickRankTableData)
    const sourceDataTableData = [
      {
        date: '2023-10-24',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      },
      {
        date: '2023-10-23',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      },
      {
        date: '2023-10-19',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      },
      {
        date: '2023-10-18',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      },
      {
        date: '2023-10-16',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      },
      {
        date: '2023-10-15',
        path: '(not set)',
        campaign: '(not set)',
        source: '(direct) / (none)',
        keyword: '(not set)',
        socialNetwork: '(not set)'
      }
    ]
    expect(wrapper.vm.sourceDataTableData).toStrictEqual(sourceDataTableData)
		
		//模擬點擊tab是否有改變
		await wrapper.findAll('.tabs li')[1].trigger('click')
		expect(wrapper.vm.currentTabs).toStrictEqual('sourceData')
  })
})
