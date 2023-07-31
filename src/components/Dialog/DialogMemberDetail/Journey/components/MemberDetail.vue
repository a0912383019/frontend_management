<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberJourneyDetail } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { errorRespond } from '@/utils/commonUtils.js'
import { ElNotification, dayjs } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const popoverVisible = ref(false)

const sourceCheckList = ref([1, 2, 3]) // 預設為1,2,3全選

const tableData = ref([])
const tableColumns = computed(() => {
  return [
    {
      label: t('customer_detail_info.journey_detail_source'),
      prop: 'source',
      width: 140,
      align: 'center'
    },
    {
      label: t('date.date'),
      prop: 'date',
      width: 140,
      align: 'center'
    },
    {
      label: t('customer_detail_info.journey_detail_content'),
      prop: 'content',
      align: 'center'
    }
  ]
})

// 取得資料
const queryMemberJourneyDetail = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberJourneyDetail({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id,
      source: sourceCheckList.value,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status

    if (return_code !== '0001') {
      if (return_code === '0000') {
        apiSuccess.value = true
        transformMemberJourneyDetail(result.data.result)
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

// 轉換資料
const transformMemberJourneyDetail = (data) => {
  const result = data.map((item) => {
    return {
      source: getSource(item.source),
      date: dayjs(item.data_date).format(t('date.format_date_rule')),
      content: item.content
    }
  })
  tableData.value = []
  tableData.value = result
}

// 取得source對應的名稱
const getSource = (code) => {
  switch (code) {
    case 1:
      return t('customer_detail_info.rpa')
    case 2:
      return t('customer_detail_info.uxm')
    case 3:
      return t('customer_detail_info.cdp')
  }
}

const handleClick = () => {
  popoverVisible.value = false
  queryMemberJourneyDetail()
}

onMounted(() => {
  queryMemberJourneyDetail()
})

watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryMemberJourneyDetail()
  }
)
</script>
<template>
  <section class="cdp-section">
    <div class="flex justify-between mb-20">
      <SectionTitle class="mb-15" :title="t('customer_detail_info.member_journey_detail')">
      </SectionTitle>
      <el-popover
        placement="bottom-end"
        :visible="popoverVisible"
        :title="t('customer_detail_info.journey_detail_source')"
        :width="500"
        trigger="click"
        popper-class="cdp-popover"
      >
        <template #reference>
          <ButtonIcon
            icon="sliders"
            size="large"
            :name="t('common.advanced_filter')"
            @click="popoverVisible = !popoverVisible"
          />
        </template>
        <div class="drop">
          <div class="drop__item">
            <el-checkbox-group v-model="sourceCheckList" class="source-check-group">
              <div class="source-check-group__item">
                <el-checkbox class="cdp-checkbox" :label="1">
                  {{ $t('customer_detail_info.rpa') }}
                </el-checkbox>
              </div>
              <div class="source-check-group__item">
                <el-checkbox class="cdp-checkbox" :label="2">
                  {{ $t('customer_detail_info.uxm') }}
                </el-checkbox>
              </div>
              <div class="source-check-group__item">
                <el-checkbox class="cdp-checkbox" :label="3">
                  {{ $t('customer_detail_info.cdp') }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div class="drop__footer">
            <ButtonIcon
              icon="search"
              size="large large-120"
              :name="t('common.filter')"
              @click="handleClick"
            />
          </div>
        </div>
      </el-popover>
    </div>
    <div class="bottom-box">
      <CdpMessage :messageKey="messageKey" bg="white" :cover="true" v-if="apiSuccess === false" />
      <CustomTable
        v-else
        :stripe="true"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :hasPagination="false"
        tableHeight="310"
        class="customTable2"
        ref="refTable"
      >
      </CustomTable>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  min-height: 410px;
}
.bottom-box {
  position: relative;
  height: 310px;
}
.source-check-group {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: solid 1px #cfd8e6;
  background-color: #fff;
  &__item {
    flex: 1;
  }
}
.drop {
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
