import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import AdminUserList from '@/views/AdminUserList/AdminUserList.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import AddAccount from '@/components/Button/AddButton.vue'
import Filter from '@/views/AdminUserList/Filter.vue'
import UserAccountSetting from '@/views/AdminUserList/UserAccountSetting.vue'
import AddUserAccount from '@/views/AdminUserList/AddUserAccount.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import axiosInstance from '@/api/axiosInstance.js'
import router from '@/router'
import { sortTableData, sortTableDate } from '@/utils/commonUtils.js'

describe('AdminUserList', () => {
  let wrapper = null
  let spyGet
  let spyPost
  let spyDelete
  let setItemSpy
  const simulateUserId = 24

  const mocks = vi.hoisted(() => {
    return {
      sortTableData: vi.fn(),
      sortTableDate: vi.fn()
    }
  })

  vi.mock('@/utils/commonUtils.js', async () => {
    const actual = await vi.importActual('@/utils/commonUtils.js')
    return {
      ...actual,
      getSessionStorageEntity: vi.fn().mockReturnValue({
        user_id: 221,
        user_name: 'BI-CDP-Yuyu',
        user_type: 9,
        access_hall: 'esx,rb,b9,jg',
        picture: 'https://google.picture.yuyu'
      }),
      sortTableData: mocks.sortTableData,
      sortTableDate: mocks.sortTableDate
    }
  })

  vi.mock('@/router', async () => {
    const actual = await vi.importActual('@/router')
    return {
      ...actual,
      resolve: vi.fn(() => ({ href: 'http://localhost/home' }))
    }
  })

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    useGlobalStore(pinia)

    setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    sessionStorage.access_token = 'original_php_token'
    sessionStorage.access_token_go = 'original_go_token'

    const result1 = {
      status: {
        return_code: '0000',
        message: 'success'
      },
      result: [
        {
          id: 236,
          name: 'BI-CDP-Xinlia #3622',
          email: 'xinlia_li@mail.chungyo.net',
          user_type: 0,
          user_status: 0,
          access_hall_name:
            'esx,15,18,22,31,44,51,55,56,63,66,68,98,99,100,106,123,154,284,294,304,333,334,349,362,369,377,389,399,437,456,506,520,555,558,590,608,629,634,666,710,711,713,757,777,788,802,808,888,899,914,940,999,sk2,2w,sw,bmw,bes,mdr,es2,ezw,ese,gy,geg,cx9,pid,jx,hf8,tbh,jy8,b99,jyh,b8,oh,hg1,v88,mo,lh,51k,pg,by,sjs,blf,xb1,hgw,crc,ios,jsi,rb,am7,ybh,ask,y8y,sd,dd,oz,am,k56,yh1,da,blh,rrc,com,y99,ns,mng,ra,fh9,gh,six,jsp,ksh,bbg,top,bin,wns,bt,jsh,ttt,yun,ok,sbd,zz,mm,sun,flw,dhy,v99,y88,dkk,mmm,mka,chn,aom,pp,xj,jnh,F58,xxx,js,a99,gx8,yh6,st,vn,yr,mgm,hy,mf,ppk,dz,tz,yf,wm8,bf8,8jt,yg,yt8,wbo,eee,008,ddd,h9,veb,da8,bbi,xle,097,a9,win,jk,js6,amj,b88,bk2,xg,fa,qh,hf9,yl6,bme,dsn,ds,qq,nc,dyl,www,jsa,qaz,ir,lzl,bc,hx6,fff,ja,tm,jb,jd8,ns8,jsy,hl,bo8,xsd,am9,wy,dct,b9,yb,yh,098,by3,yl,8f,ga,tai,hh5,hdd,yl8,xjp,hh,dc,scc,001,089,ya,pj,yh8,lx,jg,hj,tss,js8,vip,jsx,sss,spc,jw,yd,ag,jmh',
          google_picture_url:
            'https://lh3.googleusercontent.com/a/ACg8ocIqq548koo9ZeUahrsyepMWsgJnPcPrhSw_xGySOGkCH9WSWhSp=s96-c',
          login_num: 191,
          last_login_date: '2024-08-13 05:46:58',
          created_time: '2023-04-24 23:01:59',
          updated_time: '2024-07-16 04:51:49'
        },
        {
          id: simulateUserId,
          name: 'BI-CDP-士傑(#3151)',
          email: 'danny_su@mail.chungyo.net',
          user_type: 9,
          user_status: 0,
          access_hall_name: 'esx,389,sw,bmw,hf8,mf,xjp,hh,jg,bbi,rb',
          google_picture_url:
            'https://lh3.googleusercontent.com/a/ACg8ocLRX_23J-tR4hcsy_Q3cDCC9tELdM9EE9kIq6ETx5i52pkFQ2gB=s96-c',
          login_num: 738,
          last_login_date: '2024-08-13 20:33:04',
          created_time: '2023-05-08 20:45:27',
          updated_time: '2024-01-28 21:32:44'
        }
      ]
    }

    const result2 = {
      result: {
        access_token: 'a.a.a.a',
        token_type: 'bearer',
        expires_in: 3600,
        user_id: simulateUserId,
        user_name: 'BI-CDP-Danny',
        user_type: 9,
        user_status: 0,
        access_hall: 'esx,389,sw,bmw,hf8,mf,xjp,hh,jg,bbi,rb',
        picture: 'https://google.picture.danny'
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    const result3 = {
      result: {
        access_token: 'b.b.b.b.b',
        token_type: 'bearer'
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    const result4 = {
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/admin/users':
          return Promise.resolve({ data: result1 })
        case `/api/auth/admin/user/${simulateUserId}/token`:
          return Promise.resolve({ data: result2 })
      }
    })
    spyPost = vi.spyOn(axiosInstance, 'post').mockResolvedValue({ data: result3 })
    spyDelete = vi.spyOn(axiosGoInstance, 'delete').mockResolvedValue({ data: result4 })

    wrapper = shallowMount(AdminUserList, {
      global: {
        plugins: [i18n, router, ElementPlus]
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(AddAccount).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(UserAccountSetting).exists()).toBe(true)
    expect(wrapper.findComponent(AddUserAccount).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '帳戶名稱',
        minWidth: '15%',
        prop: 'account_name'
      },
      {
        align: 'center',
        colClass: 'break-work',
        headerAlign: 'center',
        label: 'Email',
        minWidth: '20%',
        prop: 'email'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '帳戶類型',
        minWidth: '12%',
        prop: 'user_type'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '狀態',
        minWidth: '8%',
        prop: 'status'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '登入次數',
        minWidth: '12%',
        prop: 'login_num',
        sortable: 'custom'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '最後登入時間',
        minWidth: '13%',
        prop: 'last_login_time',
        sortable: 'custom'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '20%',
        prop: 'operation'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('searchAccount & queryListUserByAdmin and tableData transformed correctly', async () => {
    const filterData = {
      userName: 'Yuyu',
      userType: 9,
      userStatus: 'all',
      lastLoginTime: null
    }
    wrapper.vm.searchAccount(filterData)
    await flushPromises()

    expect(spyGet).toHaveBeenCalledWith('/api/auth/admin/users', {
      params: {
        last_login_date: null,
        name: 'Yuyu',
        user_status: null,
        user_type: 9
      }
    })

    const tableData = [
      {
        account_name: 'BI-CDP-Xinlia #3622',
        email: 'xinlia_li@mail.chungyo.net',
        id: 236,
        last_login_time: '2024/08/13 05:46:58',
        login_num: 191,
        status: 0,
        user_type: 0
      },
      {
        account_name: 'BI-CDP-士傑(#3151)',
        email: 'danny_su@mail.chungyo.net',
        id: simulateUserId,
        last_login_time: '2024/08/13 20:33:04',
        login_num: 738,
        status: 0,
        user_type: 9
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('upadteCurrentSort', () => {
    expect(sortTableData).toHaveBeenCalledTimes(0)
    wrapper.vm.upadteCurrentSort({ prop: 'login_num', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()

    expect(sortTableDate).toHaveBeenCalledTimes(0)
    wrapper.vm.upadteCurrentSort({ prop: 'last_login_time', order: 'descending' })
    expect(sortTableDate).toHaveBeenCalled()
  })

  it('closeAddDialog & openAddDialog', () => {
    expect(wrapper.vm.addAccountVisible).toBeFalsy()
    wrapper.vm.openAddDialog()
    expect(wrapper.vm.addAccountVisible).toBeTruthy()
    wrapper.vm.closeAddDialog()
    expect(wrapper.vm.addAccountVisible).toBeFalsy()
  })

  it('showAccountSetting & closeUserDialog', () => {
    expect(wrapper.vm.userAccountVisible).toBeFalsy()
    expect(wrapper.vm.userData.userId).toStrictEqual(null)
    expect(wrapper.vm.userData.userName).toStrictEqual('')

    wrapper.vm.showAccountSetting(24, 'yuyu')
    expect(wrapper.vm.userAccountVisible).toBeTruthy()
    expect(wrapper.vm.userData.userId).toStrictEqual(24)
    expect(wrapper.vm.userData.userName).toStrictEqual('yuyu')

    wrapper.vm.closeUserDialog()
    expect(wrapper.vm.userAccountVisible).toBeFalsy()
    expect(wrapper.vm.userData.userId).toStrictEqual(null)
    expect(wrapper.vm.userData.userName).toStrictEqual('')
  })

  it('querySimulateUserData', async () => {
    global.open = vi.fn()
    wrapper.vm.querySimulateUserData(simulateUserId)

    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(spyPost).toHaveBeenCalledWith('/api/auth/get_simulate_user_data', {
      user_id: simulateUserId
    })
    expect(spyGet).toHaveBeenCalledWith(`/api/auth/admin/user/${simulateUserId}/token`)
    expect(setItemSpy).toBeCalledWith(
      'user_info',
      JSON.stringify({
        user_id: simulateUserId,
        user_name: 'BI-CDP-Danny',
        user_type: 9,
        access_hall: 'esx,389,sw,bmw,hf8,mf,xjp,hh,jg,bbi,rb',
        picture: 'https://google.picture.danny'
      })
    )
    expect(setItemSpy).toBeCalledWith('access_token', 'bearer b.b.b.b.b')
    expect(setItemSpy).toBeCalledWith('access_token_go', 'bearer a.a.a.a')

    expect(window.open).toBeCalled()
    expect(window.open).toHaveBeenCalledWith('/home?simulate=true', 'CDP', 'height=960,width=1560')

    expect(setItemSpy).toBeCalledWith(
      'user_info',
      JSON.stringify({
        user_id: 221,
        user_name: 'BI-CDP-Yuyu',
        user_type: 9,
        access_hall: 'esx,rb,b9,jg',
        picture: 'https://google.picture.yuyu'
      })
    )
    expect(setItemSpy).toBeCalledWith('access_token', 'original_php_token')
    expect(setItemSpy).toBeCalledWith('access_token_go', 'original_go_token')
  })

  it('reloadList', () => {
    wrapper.vm.userAccountVisible = true
    wrapper.vm.addAccountVisible = true
    expect(wrapper.vm.userAccountVisible).toBeTruthy()
    expect(wrapper.vm.addAccountVisible).toBeTruthy()
    expect(spyGet).toBeCalledTimes(1) // onMounted 會呼叫第一次

    wrapper.vm.reloadList()
    expect(wrapper.vm.userAccountVisible).toBeFalsy()
    expect(wrapper.vm.addAccountVisible).toBeFalsy()
    expect(spyGet).toBeCalledTimes(2)
  })

  it('test delete', async () => {
    expect(wrapper.vm.deleteBox).toBeFalsy()
    expect(wrapper.vm.deleteId).toStrictEqual(null)
    expect(wrapper.vm.deleteName).toStrictEqual('')

    // 模擬打開刪除確認視窗
    wrapper.vm.openDeleteBox(24, 'tom')
    expect(wrapper.vm.deleteBox).toBeTruthy()
    expect(wrapper.vm.deleteId).toStrictEqual(24)
    expect(wrapper.vm.deleteName).toStrictEqual('tom')

    // 取消刪除
    wrapper.vm.cancelDelete()
    expect(wrapper.vm.deleteBox).toBeFalsy()
    expect(wrapper.vm.deleteId).toStrictEqual(null)
    expect(wrapper.vm.deleteName).toStrictEqual('')

    // 模擬打開刪除確認視窗
    wrapper.vm.openDeleteBox(24, 'tom')
    expect(wrapper.vm.deleteBox).toBeTruthy()
    expect(wrapper.vm.deleteId).toStrictEqual(24)
    expect(wrapper.vm.deleteName).toStrictEqual('tom')
    expect(spyDelete).toBeCalledTimes(0)

    // 確認刪除
    wrapper.vm.confirmDelete()
    await flushPromises()
    expect(spyDelete).toBeCalledTimes(1)
    expect(wrapper.vm.deleteBox).toBeFalsy()
    expect(wrapper.vm.deleteId).toStrictEqual(null)
    expect(wrapper.vm.deleteName).toStrictEqual('')
  })
})
