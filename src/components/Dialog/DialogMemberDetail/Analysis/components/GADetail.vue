<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryGARelatedData } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { getHallCurrencySign, FormatNumber, errorRespond } from '@/utils/commonUtils.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const tableData = ref([])
//定義欄位
const tableColumns = computed(() => {
  return [
    {
      label: t('customer_detail_info.ga_statistic_value'),
      prop: 'name',
      width: 160,
      align: 'center'
    },
    {
      label: t('customer_detail_info.ga_value'),
      prop: 'value',
      align: 'center'
    }
  ]
})

//取得資料
const queryGARelatedData = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryGARelatedData({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      //整理table對應的資料
      transformTableData(result.data.result)
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformTableData = (data) => {
  console.log(data)
  tableData.value = [
    {
      name: t('customer_detail_info.page_views'),
      value: FormatNumber(data.page_views.toString())
    },
    {
      name: t('customer_detail_info.promotion_clicks'),
      value: data.promotion_clicks
    },
    {
      name: t('customer_detail_info.service_contact_clicks'),
      value: data.service_contact
    },
    {
      name: t('customer_detail_info.visit_duration'),
      value:
        (Math.floor(data.time_on_site / 86400) !== 0
          ? Math.floor(data.time_on_site / 86400) + t('unit.day') + ' '
          : '') +
        (Math.floor((data.time_on_site % 86400) / 3600) !== 0
          ? Math.floor((data.time_on_site % 86400) / 3600) + t('unit.hour') + ' '
          : '') +
        (Math.floor(((data.time_on_site % 86400) % 3600) / 60) !== 0
          ? Math.floor(((data.time_on_site % 86400) % 3600) / 60) + t('unit.minute') + ' '
          : '') +
        Math.floor(((data.time_on_site % 86400) % 3600) % 60) +
        t('unit.second')
    },
    {
      name: t('customer_detail_info.total_bounces'),
      value: data.total_bounces
    },
    {
      name: t('customer_detail_info.total_sessions'),
      value: data.total_sessions
    },
    {
      name: t('customer_detail_info.bet_per_session'),
      value:
        data.per_session_bet_amount === '-'
          ? data.per_session_bet_amount
          : getHallCurrencySign('BBIN', activeHall.hall_code) +
            FormatNumber(data.per_session_bet_amount)
    }
  ]
}

onMounted(() => {
  queryGARelatedData()
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="$t('customer_detail_info.ga_statistic_data')">
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <CustomTable
        :stripe="false"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :hasPagination="false"
        tableHeight="320"
        class="cdp-table"
        border="border"
      >
      </CustomTable>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
