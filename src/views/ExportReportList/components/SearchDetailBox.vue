<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExportListStore, useGlobalStore } from '@/stores'
import FormTable from '@/components/CustomTable/FormTable.vue'
import { dayjs } from 'element-plus'
import { storeToRefs } from 'pinia'
import { iconStep } from '@/../public/js/system_config.js'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { tableConfig } = storeToRefs(globalStore)

const exportListStore = useExportListStore()
const { levelList, tag_description_dict } = exportListStore

const props = defineProps({
  reportDetail: {
    type: Object
  },
  detailBoxVisible: {
    type: Boolean,
    default: false
  }
})

const visibleBox = computed({
  get() {
    return props.detailBoxVisible
  },
  set(newValue) {
    emit('detailBoxClose')
    return newValue
  }
})

const emit = defineEmits(['detailBoxClose'])

const generateTags = (tagsString) => {
  if (!tagsString) return
  let subStrings = tagsString.split(';')
  let result = subStrings.map((ele) => {
    let subStringsPeriod = ele.split(',')
    return subStringsPeriod
      .map((item) => {
        return tag_description_dict.hall[item].tag_name
      })
      .join(', ')
  })
  result = result.join(' or ')

  let newSubStrings = result.split(',')
  let newMap = newSubStrings.map((ele) => {
    if (ele.indexOf(' or ') !== -1) {
      return '(' + ele + ')'
    }
    return ele
  })

  return newMap.join(', ')
}

const tableData = computed(() => {
  let tableData = []
  switch (props.reportDetail.type) {
    case 1: {
      tableData = tableDataType1.value
      break
    }
    case 2: {
      tableData = tableDataType2.value
      break
    }
    case 3: {
      tableData = tableDataType3.value
      break
    }
    case 4: {
      tableData = tableDataType4.value
      break
    }
    case 5: {
      tableData = tableDataType5.value
      break
    }
    case 8: {
      tableData = tableDataType8.value
      break
    }
    case 9: {
      tableData = tableDataType9.value
      break
    }
    case 9999: {
      tableData = []
      break
    }
  }

  return tableData
})

const memberDayStepName = (type) => {
  if (type === 0) {
    return 'manage_analysis.today_num'
  } else if (type === 1) {
    return 'manage_analysis.diff_pre_day'
  } else {
    return 'manage_analysis.today_add'
  }
}

const memberWeekStepName = (type) => {
  if (type === 0) {
    return 'vip_commercial_analysis.this_week_people_num'
  } else if (type === 1) {
    return 'vip_commercial_analysis.this_week_increase_people_num'
  } else {
    return 'vip_commercial_analysis.this_week_decrease_people_num'
  }
}

// 會員經營分析 type = 1
const tableDataType1 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: t(props.reportDetail.source)
    },
    {
      contentKey: t('data_name.member_name'),
      contentData: props.reportDetail.content.search_name
    },
    {
      contentKey: t('import_export_file.import'),
      contentData:
        props.reportDetail.content.custom_user_list &&
        props.reportDetail.content.custom_user_list.length !== 0
          ? t('common.yes')
          : t('common.no')
    },
    {
      contentKey: t('date.date'),
      contentData: `${dayjs(props.reportDetail.content.detail_date_start).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.detail_date_end).format(t('date.format_date_rule'))}`
    },
    {
      contentKey: t('manage_analysis.life_cycle_step_name'),
      contentData: tableConfig.value[props.reportDetail.content.life_cycle_analysis_step].step_name
    },
    {
      contentKey: t('user_export_report.click_type'),
      contentData: t(memberDayStepName(props.reportDetail.content.detail_type))
    }
  ]
})

// 會員標籤查詢 type = 2
const tableDataType2 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: t(props.reportDetail.source)
    },
    {
      contentKey: t('data_name.ag_name'),
      contentData: props.reportDetail.content.ag_name
    },
    {
      contentKey: t('data_name.user_level'),
      contentData: levelList[props.reportDetail.content.user_level_id]
    },
    {
      contentKey: t('data_name.active_date'),
      contentData:
        props.reportDetail.content.activated_date_start !== '' &&
        props.reportDetail.content.activated_date_end !== ''
          ? `${dayjs(props.reportDetail.content.activated_date_start).format(
              t('date.format_date_rule')
            )} ~ ${dayjs(props.reportDetail.content.activated_date_end).format(
              t('date.format_date_rule')
            )}`
          : ''
    },
    {
      contentKey: t('data_name.register_date'),
      contentData: `${dayjs(props.reportDetail.content.search_date_start).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.search_date_end).format(t('date.format_date_rule'))}`
    },
    {
      contentKey: t('data_name.member_name'),
      contentData: props.reportDetail.content.search_name
    },
    {
      slotKey: 'tags',
      contentKey: t('common.include_tags'),
      contentData: generateTags(props.reportDetail.content.search_tag)
    },
    {
      slotKey: 'tags',
      contentKey: t('common.exclude_tags'),
      contentData: generateTags(props.reportDetail.content.exclude_tag)
    },
    {
      contentKey: t('import_export_file.import'),
      contentData:
        props.reportDetail.content.custom_user_list &&
        props.reportDetail.content.custom_user_list.length !== 0
          ? t('common.yes')
          : t('common.no')
    },
    {
      contentKey: t('customer_tag_list.current_duration'),
      contentData: `${dayjs(props.reportDetail.content.current_date_start).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.current_date_end).format(t('date.format_date_rule'))}`
    },
    {
      contentKey: t('customer_tag_list.average_duration'),
      contentData: `${dayjs(props.reportDetail.content.average_date_start).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.average_date_end).format(t('date.format_date_rule'))}`
    },
    {
      contentKey: t('customer_tag_list.monthly_avg_duration'),
      contentData: `${dayjs(props.reportDetail.content.month_average_date_start).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.month_average_date_end).format(
        t('date.format_date_rule')
      )}`
    },
    {
      contentKey: t('customer_tag_list.average_type'),
      contentData:
        props.reportDetail.content.average_type === 'week'
          ? t('customer_tag_list.weekly_average')
          : t('customer_tag_list.daily_average')
    }
  ]
})

// VIP營運分析 活躍度分析 type = 3
const tableDataType3 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: `${t(props.reportDetail.source)} - ${t(
        'member_active_level.active_level_breakdown'
      )}`
    },
    {
      contentKey: t('data_name.member_name'),
      contentData: props.reportDetail.content.search_name
    },
    {
      contentKey: t('date.date'),
      contentData: `${dayjs(props.reportDetail.content.active_start_date).format(
        t('date.format_date_rule')
      )} ~ ${dayjs(props.reportDetail.content.active_end_date).format(t('date.format_date_rule'))}`
    },
    {
      contentKey: t('import_export_file.import'),
      contentData:
        props.reportDetail.content.custom_user_list &&
        props.reportDetail.content.custom_user_list.length !== 0
          ? t('common.yes')
          : t('common.no')
    },
    {
      slotKey: 'steps',
      contentKey: t('member_active_level.active_level'),
      contentData: {
        icon: iconStep(props.reportDetail.content.lively_level),
        iconStepName: t(
          'member_active_level.active_level_' + props.reportDetail.content.lively_level
        )
      }
    },
    {
      contentKey: t('user_export_report.click_type'),
      contentData: t(memberWeekStepName(props.reportDetail.content.detail_type))
    },
    {
      slotKey: 'tags',
      contentKey: t('common.include_tags'),
      contentData: props.reportDetail.content.vip_tag
        .map((item) => {
          return tag_description_dict.hall[item].tag_name
        })
        .join(', ')
    }
  ]
})

// VIP營運分析 日報表 type = 4
const tableDataType4 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: `${t(props.reportDetail.source)} - ${t('vip_commercial_analysis.day_report')}`
    },
    {
      contentKey: t('date.date'),
      contentData: dayjs(props.reportDetail.content.report_date).format(t('date.format_date_rule'))
    },
    {
      slotKey: 'tags',
      contentKey: t('common.include_tags'),
      contentData: props.reportDetail.content.vip_tag
        .map((item) => {
          return tag_description_dict.hall[item].tag_name
        })
        .join(', ')
    }
  ]
})

// VIP營運分析 週報表 type = 5
const tableDataType5 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: `${t(props.reportDetail.source)} - ${t('vip_commercial_analysis.week_report')}`
    },
    {
      contentKey: t('date.year'),
      contentData: props.reportDetail.content.search_year
    },
    {
      contentKey: t('date.month'),
      contentData: props.reportDetail.content.search_month
    },
    {
      contentKey: t('date.week'),
      contentData: props.reportDetail.content.search_week
    },
    {
      slotKey: 'tags',
      contentKey: t('common.include_tags'),
      contentData: props.reportDetail.content.vip_tag
        .map((item) => {
          return tag_description_dict.hall[item].tag_name
        })
        .join(', ')
    }
  ]
})

// 活動成效分析-子活動分析-詳細名單 type = 8
const tableDataType8 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: `${t(props.reportDetail.source)} - ${t(
        'activity_analysis.activity_compare_detail_table'
      )}`
    },
    {
      contentKey: t('activity_analysis.activity_name'),
      contentData: props.reportDetail.info.activity
    },
    {
      contentKey: t('activity_analysis.activity_detail_name'),
      contentData: props.reportDetail.info.activity_detail
    },
    {
      contentKey: t('activity_analysis.rewarded'),
      contentData: props.reportDetail.content.is_reward ? t('common.yes') : t('common.no')
    },
    {
      contentKey: t('data_name.member_name'),
      contentData: props.reportDetail.content.search_name
    }
  ]
})

// 活動成效分析-成長率圖表 type = 9
const tableDataType9 = computed(() => {
  return [
    {
      contentKey: t('user_export_report.source_page'),
      contentData: t('activity_analysis.export_nine_charts_name')
    },
    {
      contentKey: t('activity_analysis.analysis_cycle'),
      contentData: t(
        `tag_synchronization.activity_date_cycle_${props.reportDetail.content.interval_type}`
      )
    },
    {
      contentKey: t('activity_analysis.analysis_duration'),
      contentData:
        dayjs(props.reportDetail.content.start_date).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(props.reportDetail.content.end_date).format(t('date.format_date_rule'))
    },
    {
      contentKey: t('activity_analysis.reward_status'),
      contentData: props.reportDetail.content.is_reward
        ? t('activity_analysis.award')
        : t('activity_analysis.not_award')
    },
    {
      contentKey: t('activity_analysis.activity_name'),
      contentData: props.reportDetail.info.activity_names.join('、')
    }
  ]
})

// table 欄位
const tableColumns = computed(() => {
  return [
    {
      prop: 'contentKey',
      minWidth: i18nLocale.value === 'en' ? '40%' : '30%',
      align: 'right'
    },
    {
      prop: 'contentData',
      minWidth: i18nLocale.value === 'en' ? '60%' : '70%',
      align: 'left'
    }
  ]
})

const showTags = (tagString) => {
  if (tagString) {
    return tagString.split(' ')
  }
  return []
}

// dialog close callback
const handleCloseDialog = () => {
  emit('detailBoxClose')
}
</script>
<template>
  <div class="flex">
    <el-dialog
      v-model="visibleBox"
      class="cdp-dialog"
      :append-to-body="true"
      width="590"
      :title="$t('user_export_report.export_detail')"
      @close="handleCloseDialog"
    >
      <div class="cdp-dialog__content">
        <FormTable
          v-if="tableData.length !== 0"
          :tableData="tableData"
          :tableColumns="tableColumns"
        >
          <template #contentData="scope">
            <div v-if="scope.row.slotKey === 'tags'">
              <span
                class="tag-wrap"
                v-for="(item, idx) in showTags(scope.row.contentData)"
                :key="idx"
                >{{ item + ' ' }}</span
              >
            </div>
            <div v-else-if="scope.row.slotKey === 'steps'">
              <el-tooltip effect="dark" placement="right">
                <template #content>
                  <div class="page-customtag-type">
                    {{ scope.row.contentData.iconStepName }}
                  </div>
                </template>
                <font-awesome-icon
                  :class="['font-size-22', 'mt-6', 'ml-1', scope.row.contentData.icon.color]"
                  :icon="['fa-regular', scope.row.contentData.icon.icon]"
                />
              </el-tooltip>
            </div>
            <div v-else>{{ scope.row.contentData }}</div>
          </template>
        </FormTable>
        <div class="text-center" v-else>
          <span>此欄位不支援舊版匯出，無法顯示篩選條件</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tag-wrap {
  display: inline-block;
  white-space: pre-wrap;
}
.cdp-dialog {
  &__tab {
    margin-bottom: 15px;
    &.en {
      :deep(.tabs__item) {
        font-size: 14px;
      }
    }
  }
  &__content {
    border-radius: 5px;
    border: solid 1px #e6eaf2;
    background-color: #fff;
    padding: 20px;
  }
}
</style>
