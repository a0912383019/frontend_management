<script setup>
import { onMounted, ref, computed, reactive, watch } from 'vue'
import { useActivityAnalysisStore, useGlobalStore, useDialogMemberDetailStore } from '@/stores'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiQueryActivityCompareDetail } from '@/api'
import { errorRespond, FormatNumber } from '@/utils/commonUtils.js'
import CurrencySignText from '@/components/CurrencySignText.vue'
import CustomPagination from '@/components/Pagination/Pagination.vue'
import TotalPagination from '@/components/Pagination/TotalPagination.vue'
import PercentWithIcon from '@/components/PercentWithIcon.vue'
import LifeCycleHistory from '@/components/Chart/LifeCycleHistory.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  },
  activityId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const tableData = ref([])

const apiSuccess = ref(false)
const messageKey = ref('loading')

const queryActivityCompareDetail = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiQueryActivityCompareDetail({
      hall_name: activeHall.hall_code,
      activity_id_hide: props.activityId,
      activity_detail_id_hide: currentChildAnalysis.id,
      search_name: activityStore.searchChildDetailMemberName,
      length: apiLength.value,
      draw: apiDraw.value,
      start: apiStart.value
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data) {
        tableData.value = []
        transformCompareDetail(result.data)
        apiSuccess.value = true
      } else {
        messageKey.value = 'noResult'
      }
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' // 更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' // 更改message內容
    }
  }
}

const transformCompareDetail = (data) => {
  tableTotal.value = data.not_reward_recordsTotal
  let result = []
  data.data.not_reward.forEach((ele) => {
    result.push({
      member_name: {
        user_name: ele.user_name,
        user_id: ele.user_id
      },
      comm_before: FormatNumber(ele.before_bet_amount_avg),
      comm_now: {
        val: FormatNumber(ele.current_bet_amount_avg),
        rate: FormatNumber(ele.current_bet_amount_rate)
      },
      comm_after: {
        val: FormatNumber(ele.after_bet_amount_avg),
        rate: FormatNumber(ele.after_bet_amount_rate)
      },
      profit_before: FormatNumber(ele.before_profit_avg),
      profit_now: {
        val: FormatNumber(ele.current_profit_avg),
        rate: FormatNumber(ele.current_profit_rate)
      },
      profit_after: {
        val: FormatNumber(ele.after_profit_avg),
        rate: FormatNumber(ele.after_profit_rate)
      },
      activity_detail_date: data.activity_detail_date
    })
  })

  tableData.value = result
}

const apiDraw = ref(1) // 第幾頁
const apiStart = ref(0) // 起始筆數
const apiLength = ref(20) // 每頁顯示筆數

// 頁碼相關
const page = reactive({
  currentPage: 1,
  pageSize: 20
})

const updateCurrentPage = (val) => {
  apiDraw.value = val
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value
  queryActivityCompareDetail()
  page.currentPage = val
}

const updatePageSize = (val) => {
  page.pageSize = val
}

const tableTotal = ref(0)
const pageTableTotal = computed(() => {
  if (tableTotal.value === 0) {
    return tableData.value.length
  } else {
    return tableTotal.value
  }
})

const handleTableSort = (data) => {
  console.log(data)
}

const chartShow = ref(false)
const memberStepData = reactive({
  member_name: null,
  member_id: null,
  member_step_detail_date: null
})

const handleStepClick = (row) => {
  memberStepData.member_name = row.member_name.user_name
  memberStepData.member_id = row.member_name.user_id
  memberStepData.member_step_detail_date = row.activity_detail_date

  chartShow.value = true
}

onMounted(() => {
  queryActivityCompareDetail()
})

watch(
  () => activityStore.isChildDetailListFiltered,
  () => {
    queryActivityCompareDetail()
  }
)
</script>
<template>
  <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
  <div v-else>
    <CurrencySignText class="text-right mb-5" />
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'comm_before', order: 'descending' }"
      @sort-change="handleTableSort"
      :border="false"
      :stripe="true"
      class="activity-detail-table"
      style="width: 100%"
    >
      <el-table-column
        prop="member_name"
        :label="$t('data_name.member_name')"
        min-width="12%"
        align="center"
        header-align="center"
      >
        <template #default="scope">
          <span class="cdp-link-click" @click="updateMemberData(scope.row.member_name)">
            {{ scope.row.member_name.user_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity_analysis.daily_comm')" header-align="center">
        <el-table-column
          prop="comm_before"
          :label="$t('activity_analysis.activity_before')"
          sortable
          min-width="14%"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="comm_now"
          :label="$t('activity_analysis.activity_now')"
          sortable
          min-width="13%"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <div>
              {{ scope.row.comm_now.val }}
              <br />
              <PercentWithIcon
                :percentData="scope.row.comm_now.rate"
                iconSize="12"
                fontSize="14"
                fontWeight="normal"
              ></PercentWithIcon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comm_after"
          :label="$t('activity_analysis.activity_after')"
          sortable
          min-width="13%"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <div>
              {{ scope.row.comm_after.val }}
              <br />
              <PercentWithIcon
                :percentData="scope.row.comm_after.rate"
                iconSize="12"
                fontSize="14"
                fontWeight="normal"
              ></PercentWithIcon>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="$t('activity_analysis.daily_profit')" header-align="center">
        <el-table-column
          prop="profit_before"
          :label="$t('activity_analysis.activity_before')"
          sortable
          min-width="14%"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <span :class="{ 'text-danger': scope.row.profit_before.indexOf('-') !== -1 }">
              {{ scope.row.profit_before }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profit_now"
          :label="$t('activity_analysis.activity_now')"
          sortable
          min-width="13%"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <div>
              <span :class="{ 'text-danger': scope.row.profit_now.val.indexOf('-') !== -1 }">
                {{ scope.row.profit_now.val }}
              </span>
              <br />
              <PercentWithIcon
                :percentData="scope.row.profit_now.rate"
                iconSize="12"
                fontSize="14"
                fontWeight="normal"
              ></PercentWithIcon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="profit_after"
          :label="$t('activity_analysis.activity_after')"
          sortable
          min-width="13%"
          align="center"
          header-align="center"
        >
          <template #default="scope">
            <div>
              <span :class="{ 'text-danger': scope.row.profit_after.val.indexOf('-') !== -1 }">
                {{ scope.row.profit_after.val }}
              </span>
              <br />
              <PercentWithIcon
                :percentData="scope.row.profit_after.rate"
                iconSize="12"
                fontSize="14"
                fontWeight="normal"
              ></PercentWithIcon>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="life_cycle_step"
        :label="$t('data_name.life_cycle_step')"
        min-width="8%"
        header-align="center"
      >
        <template #default="scope">
          <ButtonIcon
            @click="handleStepClick(scope.row)"
            class="step-button"
            icon="history"
            :isSvg="true"
            :name="$t('custom_tags_setting.history')"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="chartShow"
      class="cdp-dialog"
      :destroy-on-close="true"
      :append-to-body="true"
      :title="$t('manage_analysis.member_life_cycle_history')"
    >
      <div class="cdp-dialog__content">
        <LifeCycleHistory
          :memberId="memberStepData.member_id"
          :detailDate="memberStepData.member_step_detail_date"
          :userName="memberStepData.member_name"
        />
      </div>
    </el-dialog>
    <div class="paginationBox">
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="pageTableTotal"
        layout="prev, pager, next"
        class="cdp-pagination"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
      />
      <TotalPagination :page="page.currentPage" :pageSize="page.pageSize" :total="pageTableTotal" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.activity-detail-table) {
  border-radius: 5px;
  border: #f6f8fb;
  overflow: hidden;

  .el-table__border-left-patch {
    background-color: #ffffff;
    border-width: 2px;
  }
  &.el-table--border {
    &::before,
    &::after,
    .el-table__inner-wrapper::after,
    .el-table__inner-wrapper::before {
      background-color: #ffffff;
    }
    thead {
      .el-table__cell {
        border-width: 2px;
        border-right-color: #ffffff;
        border-left-color: #ffffff;
        border-bottom-color: #ffffff;
        border-top-color: #ffffff;
      }
      .el-table__cell {
        border-width: 2px;
        border-right-color: #ffffff;
      }
    }
    tbody {
      td.el-table__cell {
        border: none;
      }
    }
  }
  &.el-table {
    thead {
      &.is-group {
        th.el-table__cell {
          background-color: #e9eef6;
          color: #3b4667;
        }
        tr:first-child th:nth-child(2n-1).el-table__cell {
          border-width: 2px;
          background-color: #dbe3f0;
        }
        tr:nth-child(2) th:nth-child(-n + 6):nth-child(n + 4).el-table__cell {
          border-width: 2px;
          background-color: #dbe3f0;
        }
      }
    }
    tbody .el-table__cell {
      padding: 5px 0;
      .cell {
        line-height: normal;
        min-height: 44px;
      }
    }
    tr.el-table__row {
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &.el-table__row--striped td {
        background: #f3f6f9;
      }
    }
    .sort-caret {
      &.descending {
        border-top-color: #ccd3e0;
      }
      &.ascending {
        border-bottom-color: #ccd3e0;
      }
    }
    .descending {
      .sort-caret {
        &.descending {
          border-top-color: #868ea3;
        }
      }
    }
    .ascending {
      .sort-caret {
        &.ascending {
          border-bottom-color: #868ea3;
        }
      }
    }
  }
    &.el-table--enable-row-hover {
      .el-table__body {
        tr {
          &:hover {
            > td.el-table__cell {
              background-color: rgba(107, 207, 223, 0.05);
            }
          }
        }
      }
    }
    &.el-table--striped {
      .el-table__body {
        tr.el-table__row--striped {
          td.el-table__cell {
            background-color: #f4f6f9;
          }
        }
      }
    }
  .step-button {
    min-width: 80px !important;
  }
}
</style>
