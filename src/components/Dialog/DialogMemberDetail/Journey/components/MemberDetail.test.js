import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import MemberDetail from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberDetail.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CdpIcon from '@/components/CdpIcon.vue'
import ElementPlus from 'element-plus'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'

describe('GADetail.vue', () => {
  let wrapper = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        result: [
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-06',
            source: 1,
            content:
              '去過「PGG777,\ne賴 - 商城,\n至尊賭神賽,\nesb(電子大賽),\ne賴－論壇,\ne賴－資訊,\nB9(9VIP),\ne賴－首頁,\n體育競猜活動專頁」網站',
            created_time: '2023-11-07 08:00:25'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-06',
            source: 1,
            content: '參加『体育活动推广』 活動於『體育競猜活動專頁』 網站點擊『指定三串一』 按鈕 ',
            created_time: '2023-11-07 08:10:19'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-05',
            source: 1,
            content:
              '去過「e賴－首頁,\n體育競猜活動專頁,\ne賴－論壇,\n讓足球滾一會,\ne賴 - 商城,\ne賴－資訊,\n至尊賭神賽,\nesb(電子大賽),\nPGG777」網站',
            created_time: '2023-11-06 08:00:18'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-04',
            source: 1,
            content:
              '去過「體育競猜活動專頁,\ne賴－首頁,\ne賴－資訊,\ne賴 - 商城,\nPGG777,\ne賴－論壇」網站',
            created_time: '2023-11-05 08:00:20'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-03',
            source: 1,
            content:
              '去過「esb(電子大賽),\ne賴 - 商城,\n體育競猜活動專頁,\nPGG777,\ne賴－首頁,\n至尊賭神賽,\ne賴－資訊,\ne賴－論壇」網站',
            created_time: '2023-11-04 08:00:20'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-03',
            source: 2,
            content:
              '參加『赌神赛_单注倍数』 活動於『至尊賭神賽』 網站點擊『去查榜,\n 看规则』 按鈕 ',
            created_time: '2023-11-04 08:10:18'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-02',
            source: 2,
            content:
              '去過「PGG777,\ne賴 - 商城,\ne賴－資訊,\nB9(9VIP),\nesb(電子大賽),\ne賴－首頁,\n體育競猜活動專頁,\ne賴－論壇,\n至尊賭神賽」網站',
            created_time: '2023-11-03 08:00:25'
          },
          {
            hall_id: 3820698,
            domain_id: 0,
            data_date: '2023-11-01',
            source: 3,
            content:
              '去過「e賴－論壇,\ne賴－首頁,\n體育競猜活動專頁,\ne賴－資訊,\n至尊賭神賽,\nesb(電子大賽),\ne賴 - 商城」網站',
            created_time: '2023-11-02 08:00:21'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = mount(MemberDetail, {
      global: {
        plugins: [
          i18n,
          router,
          ElementPlus,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.findAllComponents(ButtonIcon)).toHaveLength(2)
    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    const tableData = [
      {
        source: '站外行為',
        date: '2023/11/06',
        content:
          '去過「PGG777,\n' +
          'e賴 - 商城,\n' +
          '至尊賭神賽,\n' +
          'esb(電子大賽),\n' +
          'e賴－論壇,\n' +
          'e賴－資訊,\n' +
          'B9(9VIP),\n' +
          'e賴－首頁,\n' +
          '體育競猜活動專頁」網站'
      },
      {
        source: '站外行為',
        date: '2023/11/06',
        content: '參加『体育活动推广』 活動於『體育競猜活動專頁』 網站點擊『指定三串一』 按鈕 '
      },
      {
        source: '站外行為',
        date: '2023/11/05',
        content:
          '去過「e賴－首頁,\n' +
          '體育競猜活動專頁,\n' +
          'e賴－論壇,\n' +
          '讓足球滾一會,\n' +
          'e賴 - 商城,\n' +
          'e賴－資訊,\n' +
          '至尊賭神賽,\n' +
          'esb(電子大賽),\n' +
          'PGG777」網站'
      },
      {
        source: '站外行為',
        date: '2023/11/04',
        content:
          '去過「體育競猜活動專頁,\ne賴－首頁,\ne賴－資訊,\ne賴 - 商城,\nPGG777,\ne賴－論壇」網站'
      },
      {
        source: '站外行為',
        date: '2023/11/03',
        content:
          '去過「esb(電子大賽),\ne賴 - 商城,\n體育競猜活動專頁,\nPGG777,\ne賴－首頁,\n至尊賭神賽,\ne賴－資訊,\ne賴－論壇」網站'
      },
      {
        source: '優惠',
        date: '2023/11/03',
        content: '參加『赌神赛_单注倍数』 活動於『至尊賭神賽』 網站點擊『去查榜,\n 看规则』 按鈕 '
      },
      {
        source: '優惠',
        date: '2023/11/02',
        content:
          '去過「PGG777,\n' +
          'e賴 - 商城,\n' +
          'e賴－資訊,\n' +
          'B9(9VIP),\n' +
          'esb(電子大賽),\n' +
          'e賴－首頁,\n' +
          '體育競猜活動專頁,\n' +
          'e賴－論壇,\n' +
          '至尊賭神賽」網站'
      },
      {
        source: '指標',
        date: '2023/11/01',
        content:
          '去過「e賴－論壇,\ne賴－首頁,\n體育競猜活動專頁,\ne賴－資訊,\n至尊賭神賽,\nesb(電子大賽),\ne賴 - 商城」網站'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })
})
