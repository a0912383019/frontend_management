<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore, useGlobalStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiQueryActivityCompareDetail, apiQueryActivityBetAmountGrowthSpan } from '@/api'
import { errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipColumnSeparate } from '@/utils/highchartsConfig.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { dayjs } from 'element-plus'
import { latest_chart_color } from '@/../public/js/system_config.js'
import CurrencySignText from '@/components/CurrencySignText.vue'

const { t, locale } = useI18n()

const props = defineProps({
  activityId: {
    type: Number
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

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
      activity_detail_id_hide: currentChildAnalysis.id
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data) {
        tableData.value = transformCompareDetail(result.data.data.not_reward)
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
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const transformCompareDetail = (data) => {
  console.log(data)
}

onMounted(() => {
  queryActivityCompareDetail()
})
</script>
<template>
  <div>
    <CurrencySignText class="text-right mb-5" />
    <el-table :border="false" :stripe="true" class="activity-detail-table" style="width: 100%">
      <el-table-column
        prop="member_name"
        :label="$t('data_name.member_name')"
        min-width="11%"
        header-align="center"
      />
      <el-table-column :label="$t('activity_analysis.daily_comm')" header-align="center">
        <el-table-column
          prop="comm_before"
          :label="$t('activity_analysis.activity_before')"
          min-width="13%"
          header-align="center"
        />
        <el-table-column
          prop="comm_now"
          :label="$t('activity_analysis.activity_now')"
          min-width="13%"
          header-align="center"
        />
        <el-table-column
          prop="comm_after"
          :label="$t('activity_analysis.activity_after')"
          min-width="13%"
          header-align="center"
        />
      </el-table-column>
      <el-table-column :label="$t('activity_analysis.daily_profit')" header-align="center">
        <el-table-column
          prop="profit_before"
          :label="$t('activity_analysis.activity_before')"
          min-width="13%"
          header-align="center"
        />
        <el-table-column
          prop="profit_now"
          :label="$t('activity_analysis.activity_now')"
          min-width="13%"
          header-align="center"
        />
        <el-table-column
          prop="profit_after"
          :label="$t('activity_analysis.activity_after')"
          min-width="13%"
          header-align="center"
        />
      </el-table-column>
      <el-table-column
        prop="life_cycle_step"
        :label="$t('data_name.life_cycle_step')"
        min-width="11%"
        header-align="center"
      />
    </el-table>
  </div>
  <!-- <el-row :gutter="20">
    <el-col :span="8">
      <SectionTitle :title="$t('activity_analysis.member_participation')" class="mb-15">
        <template #tooltip>
          <div
            class="font-size-14"
            v-html="$t('activity_analysis.enter_member_participation_reminder')"
          ></div>
        </template>
      </SectionTitle>
      <CdpMessage :messageKey="memberPartiMessageKey" v-if="memberPartiApiSuccess === false" />
      <div v-else>
        <el-input
          v-model="participateRate"
          :formatter="(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/(,*)/g, '')"
          class="mb-10"
        >
          <template #suffix>
            <span>%</span>
          </template>
          <template #append>
            <el-button @click="handleSerach">
              <font-awesome-icon class="search__iconsearch" icon="fa-magnifying-glass" />
            </el-button>
          </template>
        </el-input>
        <CustomTable
          :stripe="false"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :hasPagination="false"
          :border="true"
          class="cdp-table customCommisionableTable"
        >
        </CustomTable>
      </div>
    </el-col>
    <el-col :span="16">
      <SectionTitle
        :title="$t('activity_analysis.commissionable_growth_duration_num')"
        class="mb-15"
      ></SectionTitle>
      <CdpMessage
        :messageKey="commissionableMessageKey"
        v-if="commissionableApiSuccess === false"
      />
      <template v-else>
        <div class="cursor-pointer">
          <highcharts :options="chartOptions"></highcharts>
        </div>
      </template>
    </el-col>
  </el-row> -->
</template>
<style lang="scss" scoped>
// :deep(.el-input__suffix-inner) {
//   color: rgb(59, 59, 59);
// }
//
</style>
<style lang="scss">
.activity-detail-table {
  border-radius: 5px;
  border: #f6f8fb;
  overflow: hidden;

  .el-table__border-left-patch {
    background-color: #ffffff;
    border-width: 2px;
  }
  &.el-table--border {
    .el-table__cell {
      border-width: 2px;
      border-right-color: #ffffff;
      border-left-color: #ffffff;
      border-bottom-color: #ffffff;
      border-top-color: #ffffff;
    }
    //   border: none;
    // border-bottom-color: #ffffff;

    &::before,
    &::after,
    .el-table__inner-wrapper::after,
    .el-table__inner-wrapper::before {
      border-width: 2px;
      background-color: #ffffff;
    }
    .el-table__cell {
      border-width: 2px;
      border-right-color: #ffffff;
    }
  }
  &.el-table {
    // td.el-table__cell,
    // th.el-table__cell {
    //   border-bottom-color: #e6eaf2;
    // }
    th.el-table__cell.is-leaf {
      border-width: 2px;
      border-bottom-color: #ffffff;
    }
    th.el-table__cell {
      border-width: 2px;
      background-color: #e9eef6;
      color: #3b4667;
    }
    thead.is-group tr:first-child th:nth-child(2n-1).el-table__cell {
      border-width: 2px;
      background-color: #dbe3f0;
    }
    thead.is-group tr:nth-child(2) th:nth-child(-n + 6):nth-child(n + 4).el-table__cell {
      border-width: 2px;
      background-color: #dbe3f0;
    }
    // .sort-caret {
    //   &.descending {
    //     border-top-color: #ccd3e0;
    //   }
    //   &.ascending {
    //     border-bottom-color: #ccd3e0;
    //   }
    // }
    // .descending {
    //   .sort-caret {
    //     &.descending {
    //       border-top-color: #868ea3;
    //     }
    //   }
    // }
    // .ascending {
    //   .sort-caret {
    //     &.ascending {
    //       border-bottom-color: #868ea3;
    //     }
    //   }
    // }
  }
  //   &.el-table--enable-row-hover {
  //     .el-table__body {
  //       tr {
  //         &:hover {
  //           > td.el-table__cell {
  //             background-color: rgba(107, 207, 223, 0.05);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   &.el-table--striped {
  //     .el-table__body {
  //       tr.el-table__row--striped {
  //         td.el-table__cell {
  //           background-color: #f4f6f9;
  //         }
  //       }
  //     }
  //   }
}
// .customCommisionableTable {
//   .el-table tbody .el-table__cell {
//     padding: 5px 0;
//     .cell {
//       line-height: normal;
//       min-height: 40px;
//     }
//   }
//   tr.el-table__row {
//     .cell {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }
//   }
// }
</style>
