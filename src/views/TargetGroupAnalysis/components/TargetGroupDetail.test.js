import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useTargetGroupStore } from '@/stores'
import TargetGroupDetail from '@/views/TargetGroupAnalysis/components/TargetGroupDetail.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import AddGroup from '@/components/Button/AddButton.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TargetData from '@/views/TargetGroupAnalysis/components/TargetData/TargetData.vue'
import AnalysisResult from '@/views/TargetGroupAnalysis/components/AnalysisResult/AnalysisResult.vue'

describe('TargetGroupDetail.vue', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(TargetGroupDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected variables correct', async () => {
    expect(wrapper.vm.currentTabs).toStrictEqual('TargetData')
    expect(wrapper.vm.tabList).toStrictEqual([
      {
        label: '目標資料',
        name: 'TargetData'
      },
      {
        label: '分析結果',
        name: 'AnalysisResult'
      }
    ])
    expect(wrapper.vm.currentTabComponent).toStrictEqual(TargetData)

    wrapper.vm.currentTabs = 'AnalysisResult'
    expect(wrapper.vm.currentTabs).toStrictEqual('AnalysisResult')
    expect(wrapper.vm.tabList).toStrictEqual([
      {
        label: '目標資料',
        name: 'TargetData'
      },
      {
        label: '分析結果',
        name: 'AnalysisResult'
      }
    ])
    expect(wrapper.vm.currentTabComponent).toStrictEqual(AnalysisResult)
  })

  it('test handleDialogClosed', async () => {
    wrapper.vm.currentTabs = 'AnalysisResult'
    expect(wrapper.vm.currentTabs).toStrictEqual('AnalysisResult')

    await wrapper.vm.handleDialogClosed()
    expect(wrapper.vm.currentTabs).toStrictEqual('TargetData')
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })
})
