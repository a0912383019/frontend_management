<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryGAPagePathRank } from '@/api/dialogMemberDetail.js'
import { apiQueryGADataSource } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import Tab from '@/components/Tab.vue'
import { errorRespond } from '@/utils/commonUtils.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

//api是否成功
const clickRankApiSuccess = ref(false)
const sourceDataApiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const clickRankMessageKey = ref('shortLoading')
const sourceDataMessageKey = ref('shortLoading')

//當前顯示的tab
const currentTabs = ref('clickRank')
//tabs列表
const tabList = computed(() => {
  return [
    {
      name: 'clickRank',
      label: t('customer_detail_info.page_clicks_ranking')
    },
    {
      name: 'sourceData',
      label: t('customer_detail_info.ga_source')
    }
  ]
})

const clickRankTableData = ref([])
//頁面點擊排名欄位
const clickRankTableColumns = computed(() => {
  return [
    {
      label: t('customer_detail_info.page_path'),
      prop: 'path',
      align: 'center'
    },
    {
      label: t('customer_detail_info.click_count'),
      prop: 'times',
      width: 130,
      align: 'center'
    }
  ]
})

const sourceDataTableData = ref([])
//GA來源資料欄位
const sourceDataTableColumns = computed(() => {
  return [
    {
      label: t('date.date'),
      prop: 'date',
      minWidth: '90',
      align: 'center'
    },
    {
      label: t('customer_detail_info.referral_path'),
      prop: 'path',
      minWidth: '230',
      align: 'center'
    },
    {
      label: t('customer_detail_info.campaign'),
      prop: 'campaign',
      minWidth: '150',
      align: 'center'
    },
    {
      label: t('customer_detail_info.source_medium'),
      prop: 'source',
      minWidth: '230',
      align: 'center'
    },
    {
      label: t('customer_detail_info.keyword'),
      prop: 'keyword',
      minWidth: '150',
      align: 'center'
    },
    {
      label: t('customer_detail_info.social_network'),
      prop: 'socialNetwork',
      minWidth: '150',
      align: 'center'
    }
  ]
})

//取得資料
const queryGAPagePathRank = async () => {
  clickRankMessageKey.value = 'shortLoading'
  clickRankApiSuccess.value = false
  try {
    const result = await apiQueryGAPagePathRank({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      clickRankApiSuccess.value = true
      //整理及地圖對應的資料
      transformGAPagePathRank(result.data.result)
      return
    } else if (return_code === '0001') {
      clickRankMessageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    } else {
      clickRankMessageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
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

//取得資料
const queryGADataSource = async () => {
  sourceDataMessageKey.value = 'shortLoading'
  sourceDataApiSuccess.value = false
  try {
    const result = await apiQueryGADataSource({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code !== '9999') {
      if (return_code !== '0001') {
        sourceDataApiSuccess.value = true
        //整理及地圖對應的資料
        transformGADataSource(result.data.result)
      } else {
        sourceDataMessageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
      sourceDataMessageKey.value = 'noResult'
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

const transformGAPagePathRank = (data) => {
  clickRankTableData.value = data.map((ele) => {
    return {
      path: ele.page_path,
      times: ele.hits_count
    }
  })
}

const transformGADataSource = (data) => {
  sourceDataTableData.value = data.map((ele) => {
    return {
      date: ele.data_date,
      path: ele.referral_path,
      campaign: ele.campaign,
      source: ele.source_medium,
      keyword: ele.keyword,
      socialNetwork: ele.social_network
    }
  })
}

onMounted(() => {
  queryGAPagePathRank()
  queryGADataSource()
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.ga_page_path')"></SectionTitle>
    <div>
      <el-row :gutter="20" class="mb-20">
        <el-col :span="8">
          <Tab :tabData="tabList" :activeName="currentTabs" v-model="currentTabs"></Tab>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <div v-show="currentTabs === 'clickRank'">
            <CdpMessage
              :messageKey="clickRankMessageKey"
              bg="white"
              v-if="clickRankApiSuccess === false"
            />
            <CustomTable
              v-else
              :stripe="true"
              :tableData="clickRankTableData"
              :tableColumns="clickRankTableColumns"
              :hasPagination="true"
              :pageSize="5"
              class="cdp-table"
              border="border"
            ></CustomTable>
          </div>
          <div v-show="currentTabs === 'sourceData'">
            <CdpMessage
              :messageKey="sourceDataMessageKey"
              bg="white"
              v-if="sourceDataApiSuccess === false"
            />
            <CustomTable
              v-else
              :stripe="true"
              :tableData="sourceDataTableData"
              :tableColumns="sourceDataTableColumns"
              :hasPagination="true"
              :pageSize="5"
              class="cdp-table"
              border="border"
            ></CustomTable>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>