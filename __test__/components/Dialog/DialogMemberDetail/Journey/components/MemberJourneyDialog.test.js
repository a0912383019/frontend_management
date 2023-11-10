import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import MemberJourneyDialog from '@/components/Dialog/DialogMemberDetail/Journey/components/MemberJourneyDialog.vue'
import CdpIcon from '@/components/CdpIcon.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'

describe('MemberJourneyDialog.vue', () => {
  let wrapper = null
  let dateStore = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  beforeEach(() => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'put').mockResolvedValue(result)
    wrapper = mount(MemberJourneyDialog, {
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
      }
    })
    dateStore = useDateStore()
  })

  it('add new flag, mock api 0000', async () => {
    //開啟自訂旗標
    const type = 'add'
    wrapper.vm.dialogOpen({ type })
    await wrapper.vm.$nextTick()

    //只有確認按鈕
    expect(wrapper.findAllComponents(ButtonIcon)).toHaveLength(1)

    //建立帳戶與建立時間區塊不應該存在
    expect(wrapper.findComponent({ name: 'ElRow' }).exists()).toBe(false)

    //未異動前確認按鈕是否disabled
    expect(wrapper.vm.submitBtnDisabled).toBe(true)
    expect(wrapper.findAllComponents(ButtonIcon)[0].isDisabled()).toBe(true)

    //資料是否正確
    const addTypeDate = dayjs(dateStore.date_range_picker_config_4.maxDate).format('YYYY/MM/DD')
    expect(wrapper.vm.form.date).toBe(addTypeDate)
    expect(wrapper.vm.dialogType).toStrictEqual(type)
    expect(wrapper.vm.dialogVisible).toBe(true)

    //模擬新增旗標
    wrapper.vm.form.title = 'flag title'
    wrapper.vm.form.content = 'flag content'
    await wrapper.vm.handleBlur()

    //異動後確認按鈕是否可點擊
    expect(wrapper.vm.submitBtnDisabled).toBe(false)
    expect(wrapper.findAllComponents(ButtonIcon)[0].isDisabled()).toBe(false)
    expect(wrapper.vm.submitCheckVisible).toBe(false)

    //模擬點擊確認按鈕
    await wrapper.findAllComponents(ButtonIcon)[0].trigger('click')
    await flushPromises()
    expect(wrapper.vm.submitCheckVisible).toBe(true)
    expect(wrapper.findAllComponents(ButtonIcon)).toHaveLength(3)

    //模擬點擊再次確認按鈕
    await wrapper.findAllComponents(ButtonIcon)[2].trigger('click')
    await flushPromises()

    //確認clearForm是否有被觸發，資料被清空
    expect(wrapper.vm.form.date).toBe('')
    expect(wrapper.vm.form.title).toBe('')
    expect(wrapper.vm.form.content).toBe('')
    expect(wrapper.vm.dialogVisible).toBe(false)
    expect(wrapper.vm.submitCheckVisible).toBe(false)
    expect(wrapper.vm.notSaveVisible).toBe(false)
    expect(wrapper.vm.deleteVisible).toBe(false)
    expect(wrapper.vm.dialogType).toBe('')

    expect(wrapper.emitted('update:flag')).toBeTruthy()
  })

  it('edit flag and delete, mock api 0000', async () => {
    // //開啟自訂旗標
    const type = 'edit'
    const data = {
      date: '2023/11/06',
      title: 'Flaggi',
      content: 'I m flaggii',
      user: 'BI-CDP-Hulo',
      updatedTime: '2023/11/08 11:26:20'
    }
    wrapper.vm.dialogOpen({ type, data })
    await wrapper.vm.$nextTick()

    //有刪除跟確認按鈕
    expect(wrapper.findAllComponents(ButtonIcon)).toHaveLength(2)

    //建立帳戶與建立時間區塊應該存在
    expect(wrapper.findComponent({ name: 'ElRow' }).exists()).toBe(true)
    expect(wrapper.vm.form.date).toStrictEqual(data.date)
    expect(wrapper.vm.form.title).toStrictEqual(data.title)
    expect(wrapper.vm.form.content).toStrictEqual(data.content)
    expect(wrapper.vm.form.user).toStrictEqual(data.user)
    expect(wrapper.vm.form.updatedTime).toStrictEqual(data.updatedTime)
    expect(wrapper.vm.formOriginal.date).toStrictEqual(wrapper.vm.form.date)
    expect(wrapper.vm.formOriginal.title).toStrictEqual(wrapper.vm.form.title)
    expect(wrapper.vm.formOriginal.content).toStrictEqual(wrapper.vm.form.content)
    expect(wrapper.vm.dialogType).toStrictEqual(type)
    expect(wrapper.vm.dialogVisible).toBe(true)

    //未異動前確認按鈕是否disabled
    expect(wrapper.vm.submitBtnDisabled).toBe(true)
    expect(wrapper.findAllComponents(ButtonIcon)[1].isDisabled()).toBe(true)

    wrapper.vm.form.content = 'I m not flaggii'
    await wrapper.vm.handleBlur()

    //異動後確認按鈕是否可點擊
    expect(wrapper.vm.submitBtnDisabled).toBe(false)
    expect(wrapper.findAllComponents(ButtonIcon)[1].isDisabled()).toBe(false)
    expect(wrapper.vm.submitCheckVisible).toBe(false)

    //模擬點擊刪除按鈕
    await wrapper.findAllComponents(ButtonIcon)[0].trigger('click')
    await flushPromises()
    expect(wrapper.vm.deleteVisible).toBe(true)
    expect(wrapper.findAllComponents(ButtonIcon)).toHaveLength(4)

    //模擬點擊刪除再次確認按鈕
    await wrapper.findAllComponents(ButtonIcon)[3].trigger('click')
    await flushPromises()

    //確認clearForm是否有被觸發，資料被清空
    expect(wrapper.vm.form.date).toBe('')
    expect(wrapper.vm.form.title).toBe('')
    expect(wrapper.vm.form.content).toBe('')
    expect(wrapper.vm.dialogVisible).toBe(false)
    expect(wrapper.vm.submitCheckVisible).toBe(false)
    expect(wrapper.vm.notSaveVisible).toBe(false)
    expect(wrapper.vm.deleteVisible).toBe(false)
    expect(wrapper.vm.dialogType).toBe('')

    expect(wrapper.emitted('update:flag')).toBeTruthy()
  })
})
