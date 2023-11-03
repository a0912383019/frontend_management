<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiListMemberTags } from '@/api/customerTagList.js'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { findHallIdMappingKey, checkTagUsage, formatDateDuration } from '@/utils/commonUtils.js'
import { ElNotification } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ExportCSV from './components/ExportCSV.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import Filter from './components/Filter.vue'
import { useDateStore } from '@/stores/dateConfig.js'

const { date_range_picker_config_1, date_range_picker_config_2 } = useDateStore()

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const apiSuccess = ref(false) //api是否成功

const refCustomTable = ref(null) //table ref

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const tableData = ref([])
const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(10) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數

const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.ag_name'),
      prop: 'ag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.user_level'),
      prop: 'user_level',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('tags.tags'),
      prop: 'tag_name_str',
      headerAlign: i18nLocale.value === 'en' ? 'left' : 'center',
      headerSlot: `
      <div class="page-customtag-type">
        <div class="page-customtag-type__item red">${t('tags.type_6')}</div>
        <div class="page-customtag-type__item blue">${t('tags.type_3')}</div>
        <div class="page-customtag-type__item green">${t('tags.type_1')}</div>
        <div class="page-customtag-type__item orange">${t('tags.type_4')}</div>
      </div>
      `,
      align: 'left',
      minWidth: '46%'
    },
    {
      label: t('data_name.register_date'),
      prop: 'register_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    }
  ]
})

const formData = reactive({
  member: '', //會員名稱
  selectAcount: '', //代理帳號
  selectLevel: 0, //會員層級
  customUserList: [], // 手動匯入名單的帳號
  activatedDate: formatDateDuration(
    dayjs(date_range_picker_config_1.startDate).format(t('date.format_date_rule')) +
      '~' +
      dayjs(date_range_picker_config_1.endDate).format(t('date.format_date_rule'))
  ), //實動日期
  registerDate: formatDateDuration(
    dayjs(date_range_picker_config_2.startDate).format(t('date.format_date_rule')) +
      '~' +
      dayjs(date_range_picker_config_2.endDate).format(t('date.format_date_rule'))
  ), //註冊日期
  searchTag: '', //包含標籤
  excludeTag: '', //排除標籤
  fuzzySearch: false //模糊搜尋
})

// 取得資料
const queryListMemberTags = async ({ searchType = '', filterType = false }) => {
  if (searchType !== 'page') {
    apiSuccess.value = false
    messageKey.value = 'loading'
  } else {
    refCustomTable.value.showTableLoading = true
  }
  try {
    const result = await apiListMemberTags({
      activated_date: formData['activatedDate'], //實動日期
      ag_name: formData['selectAcount'], //代理帳號
      custom_user_list: formData['customUserList'], // 手動匯入名單的帳號
      exclude_tag: formData['excludeTag'], //排除標籤
      fuzzy_search: formData['fuzzySearch'], //模糊搜尋
      hall_name: activeHall.hall_code,
      length: 10,
      locale: i18nLocale.value,
      records_total: apiRecordsTotal.value, // 前端頁面目前資料總數，0 or 不帶api都會重新拿取總資料數，如果有帶api就不會重拿，會回傳前端傳的數值
      search_date: formData['registerDate'], //註冊日期
      search_name: formData['member'], //會員名稱
      search_tag: formData['searchTag'], //包含標籤
      start: apiStart.value,
      user_level_id: formData['selectLevel'] //會員層級
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (searchType !== 'page') {
        apiSuccess.value = true
      } else {
        refCustomTable.value.showTableLoading = false
      }
      if (filterType) {
        ElNotification({
          title: t('msg.query_successful'),
          type: 'success'
        })
      }
      tableData.value = []
      tableData.value = transformListMemberTags(result.data.result.data)
      apiRecordsTotal.value = result.data.result.records_total
    } else if (return_code === '0001') {
      apiRecordsTotal.value = 0
      messageKey.value = 'noResult'
    } else {
      apiRecordsTotal.value = 0
      messageKey.value = 'queryFailed'
    }
  } catch (error) {
    console.log(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformListMemberTags = (data) => {
  let result = []
  data.map((item, index) => {
    let tempObj = {
      ...item,
      index,
      tag_name_str: [],
      tag_show: false,
      tag_button_show: false, // 按鈕是否顯示
      register_date: dayjs(item.register_date).format(t('date.format_datetime_rule')),
      operation: item.operation
    }
    // 處理tag_name_str
    let hall_name = findHallIdMappingKey(['BBIN'], {
      hall_id: item.hall_id,
      domain_id: item.domain_id
    })
    let tag_str_ary = item.tag_str ? item.tag_str.split(',') : []

    for (let i = 0; i < tag_str_ary.length; i++) {
      //  若標籤代碼禁用，則跳過不顯示
      if (checkTagUsage(hall_name, tag_str_ary[i])) {
        tempObj['tag_name_str'].push(tag_str_ary[i])
      }
    }

    // 如果標籤數量大於12，按鈕才會顯示
    if (tempObj['tag_name_str'].length > 12) {
      tempObj['tag_button_show'] = true
    }

    result.push(tempObj)
  })
  return result
}

//頁碼切換執行的內容
const updateCurrentPage = (data) => {
  apiDraw.value = data
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value
  queryListMemberTags({ searchType: 'page' })
}

const handleTagButtonClick = (item) => {
  // 如果直接修改value，會因為vue響應式關係導致資料排序錯亂，所以先複製資料再修改狀態，再將新的資料賦予上去
  const newData = [...tableData.value]
  newData[item.index]['tag_show'] = !newData[item.index]['tag_show']
  tableData.value = newData
}

// 篩選送出
const handleFilterSubmit = (data) => {
  apiRecordsTotal.value = 0 // 送出篩選清空前端總筆數，api重新取得
  formData['customUserList'] = data['custom_user_list']
  formData['member'] = data['member']
  formData['selectAcount'] = data['selectAcount']
  formData['selectLevel'] = data['selectLevel'] === '' ? 0 : data['selectLevel']
  formData['activatedDate'] = data['isActivedDateCheck'] === true ? data['activatedDate'] : ''
  formData['registerDate'] = data['registerDate']
  formData['searchTag'] = data['searchTag']
  formData['excludeTag'] = data['excludeTag']
  formData['fuzzySearch'] = data['fuzzySearch']
  queryListMemberTags({ filterType: true })
}

const key = ref(0)
watch(
  () => systemConfigIsOk.value,
  () => {
    key.value = Math.floor(Math.random() * 100)
  }
)

onMounted(() => {
  queryListMemberTags({ searchType: '' })
})
</script>
<template>
  <section class="cdp-section">
    <div class="flex items-center justify-between mb-20">
      <!-- justify-between -->
      <PageTitle icon="menuTag" :title="$t('sidebar.bbin_customer_tag_list')" />
      <div class="flex">
        <ExportCSV class="mr-10" :formData="formData" :total="apiRecordsTotal" />
        <Filter :key="key" @update:filter-submit="handleFilterSubmit" />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess === true">
      <CustomTable
        :defaultSort="{ prop: 'user_level', order: 'descending' }"
        :serverSide="true"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="apiLength"
        :tableTotal="apiRecordsTotal"
        :stripe="true"
        ref="refCustomTable"
        class="customTable2 customTagListTable"
        @update:currentPage="updateCurrentPage"
      >
        <template #user_name="scope">
          <div class="cdp-link-click" @click="updateMemberData(scope.row)">
            {{ scope.row.user_name }}
          </div>
        </template>
        <template #tag_name_str="scope">
          <div class="tags">
            <ul class="tags__list" :class="{ allShow: scope.row.tag_show }">
              <template v-for="(item, index) in scope.row.tag_name_str" :key="item">
                <li :class="{ hide: index > 11 }">
                  <GenerateTagsBadge
                    :key="key"
                    :hall_name="activeHall.hall_code"
                    :tag_code="item"
                  />
                </li>
              </template>
              <li
                class="tags__button"
                @click="handleTagButtonClick(scope.row)"
                v-if="scope.row.tag_button_show"
              >
                <el-tooltip
                  effect="dark"
                  :content="scope.row.tag_show ? t('tags.hide_some_tag') : t('tags.open_all_tag')"
                  placement="top"
                  :hide-after="0"
                >
                  {{ scope.row.tag_show ? 'close' : '⋯' }}
                </el-tooltip>
              </li>
            </ul>
          </div>
        </template>
        <template #register_date="scope">
          <div style="line-height: 1.3">
            {{ scope.row.register_date.split(' ')[0] }} <br />{{
              scope.row.register_date.split(' ')[1]
            }}
          </div>
        </template>
        <template #operation="scope">
          <div>
            <ButtonIcon
              class="detail-button"
              icon="magnifier"
              :isSvg="true"
              :name="$t('common.detail_short')"
              @click="updateMemberData(scope.row)"
            />
          </div>
        </template>
      </CustomTable>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.tags {
  display: flex;
  width: 100%;
  &__list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    // max-height: 56px;
    overflow: hidden;
    li {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .hide {
      display: none;
    }
    &.allShow {
      max-height: none;
      .hide {
        display: block;
      }
    }
  }
  &__button {
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      filter: drop-shadow(0 2px 2px $blue);
    }
  }
}
</style>
<style lang="scss">
.page-customtag-type {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  &__item {
    display: flex;
    align-items: center;
    margin-left: 6px;
    &::before {
      content: '';
      width: 10px;
      height: 10px;
      margin-right: 4px;
      border-radius: 50%;
    }
    &.green {
      color: $green;
      &::before {
        background-color: $green;
      }
    }
    &.red {
      color: $red;
      &::before {
        background-color: $red;
      }
    }
    &.blue {
      color: $blue;
      &::before {
        background-color: $blue;
      }
    }
    &.orange {
      color: $oragne;
      &::before {
        background-color: $oragne;
      }
    }
  }
}

.customTagListTable {
  button.detail-button {
    min-width: 80px;
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 62px;
    }
  }
}
</style>
