<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryQARelatedData } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import {
  generateRGBColors,
  dynamicBackgroundColors,
  getHallCurrencySign,
  FormatNumber,
  formatNumberWithK,
  errorRespond
} from '@/utils/commonUtils.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const tableData = ref([])
//取得資料
const queryQARelatedData = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryQARelatedData({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code !== '0001') {
      if (return_code === '0000') {
        apiSuccess.value = true
        if (result.data.result.length !== 0) {
            const ary = [] //存放轉換後的資料
            // let nameArr = Object.keys(result.data.result)
            // console.log(nameArr)
            // for (let i = 0; i < nameArr.length; i++) {
            //     ary.push({
            //         name: t('customer_detail_info.' + nameArr[i]),
            //         value: result.data.result[nameArr[i]]
            //     })
            // }
            tableData.value = [
                {
                    name: t('customer_detail_info.page_views'),
                    value: result.data.result.page_views
                },
                {
                    name: t('customer_detail_info.promotion_clicks'),
                    value: result.data.result.promotion_clicks
                },
                {
                    name: t('customer_detail_info.service_contact_clicks'),
                    value: result.data.result.service_contact
                },
                {
                    name: t('customer_detail_info.visit_duration'),
                    value: (Math.floor(result.data.result.time_on_site / 86400) !== 0 ? 
                        Math.floor(result.data.result.time_on_site / 86400) + t('unit.day') + ' ' : '') +
                        (Math.floor(result.data.result.time_on_site % 86400 / 3600) !== 0 ? 
                        Math.floor(result.data.result.time_on_site % 86400 / 3600) + t('unit.hour') + ' ' : '') +
                        (Math.floor(result.data.result.time_on_site % 86400 % 3600 / 60) !== 0 ? 
                        Math.floor(result.data.result.time_on_site % 86400 % 3600 / 60) + t('unit.minute') + ' ' : '') +
                        Math.floor(result.data.result.time_on_site % 86400 % 3600 % 60) + t('unit.second')
                },
                {
                    name: t('customer_detail_info.total_bounces'),
                    value: result.data.result.total_bounces
                },
                {
                    name: t('customer_detail_info.total_sessions'),
                    value: result.data.result.total_sessions
                },
                {
                    name: t('customer_detail_info.bet_per_session'),
                    value: getHallCurrencySign('BBIN', activeHall.hall_code) + 
                        FormatNumber(result.data.result.per_session_bet_amount)
                }
            ]
            // tableData.value = ary
        } else {
          apiSuccess.value = false
          messageKey.value = 'noResult'
        }
      } else {
        messageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

onMounted(() => {
  queryQARelatedData()
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.ga_statistic_data')">
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <el-table :data="tableData" style="width: 100%" height="384" border size="large">
        <el-table-column
          fixed
          prop="name"
          :label="t('customer_detail_info.ga_statistic_value')"
          width="160"
        />
        <el-table-column prop="value" :label="t('customer_detail_info.ga_value')" />
      </el-table>
    </template>
  </section>
</template>
<style lang="scss" scoped>
.el-table--large {
  font-size: 15px !important;
}
</style>
