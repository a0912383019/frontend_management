<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiListMemberTags } from '@/api/customerTagList.js'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { dayjs } from 'element-plus'
import { findHallIdMappingKey, checkTagUsage, formatDateDuration } from '@/utils/commonUtils.js'
import { ElNotification } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ExportCSV from './components/ExportCSV.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import DialogMemberDetail from '@/components/Dialog/DialogMemberDetail/DialogMemberDetail.vue'
import Filter from './components/Filter.vue'
import { useDateStore } from '@/stores/dateConfig.js'

const { date_range_picker_config_1, date_range_picker_config_2 } = useDateStore()

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()

const apiSuccess = ref(false) //api是否成功

const refDialogMemberDetail = ref(null) //會員明細Dialog組件ref
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
      minWidth: '9%'
    },
    {
      label: t('data_name.ag_name'),
      prop: 'ag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '9%'
    },
    {
      label: t('data_name.user_level'),
      prop: 'user_level',
      headerAlign: 'center',
      align: 'center',
      minWidth: '9%'
    },
    {
      label: t('tags.tags'),
      prop: 'tag_name_str',
      headerAlign: 'center',
      headerSlot: `
      <div class="page-customtag-type">
        <div class="page-customtag-type__item red">${t('tags.type_1')}</div>
        <div class="page-customtag-type__item blue">${t('tags.type_3')}</div>
        <div class="page-customtag-type__item orange">${t('tags.type_4')}</div>
      </div>
      `,
      align: 'left',
      minWidth: '43%'
    },
    {
      label: t('data_name.register_date'),
      prop: 'register_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
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
      records_total: 0,
      search_date: formData['registerDate'], //註冊日期
      search_name: formData['member'], //會員名稱
      search_tag: formData['searchTag'], //包含標籤
      start: apiStart.value,
      user_level_id: formData['selectLevel'] === '' ? 0 : formData['selectLevel'] //會員層級
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
      messageKey.value = 'noResult'
    } else {
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

//會員明細Dialog點擊
const handleMemberDetailClick = (val) => {
  //寫入store
  dialogMemberDetailStore.memberData = {}
  dialogMemberDetailStore.memberData = val
  sessionStorage.member_data = ''
  sessionStorage.member_data = JSON.stringify(val)
  refDialogMemberDetail.value.handleOpenDialog()
}

const handleTagButtonClick = (item) => {
  // 如果直接修改value，會因為vue響應式關係導致資料排序錯亂，所以先複製資料再修改狀態，再將新的資料賦予上去
  const newData = [...tableData.value]
  newData[item.index]['tag_show'] = !newData[item.index]['tag_show']
  tableData.value = newData
}

const handleFilterSubmit = (data) => {
  formData['customUserList'] = data['custom_user_list']
  formData['member'] = data['member']
  formData['selectAcount'] = data['selectAcount']
  formData['selectLevel'] = data['selectLevel']
  formData['activatedDate'] = data['isActivedDateCheck'] === true ? data['activatedDate'] : ''
  formData['registerDate'] = data['registerDate']
  formData['searchTag'] = data['searchTag']
  formData['excludeTag'] = data['excludeTag']
  formData['fuzzySearch'] = data['fuzzySearch']
  queryListMemberTags({ filterType: true })
}

onMounted(() => {
  queryListMemberTags({ searchType: '' })
})
</script>
<template>
  <section class="cdp-section">
    <div class="flex items-center justify-between mb-20">
      <!-- justify-between -->
      <PageTitle icon="fas fa-tags" :title="t('sidebar.bbin_customer_tag_list')" />
      <div class="flex">
        <ExportCSV class="mr-10" :total="apiRecordsTotal" />
        <Filter @update:filter-submit="handleFilterSubmit" />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess === true">
      <DialogMemberDetail ref="refDialogMemberDetail" />
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
          <div class="cdp-link-click" @click="handleMemberDetailClick(scope.row)">
            {{ scope.row.user_name }}
          </div>
        </template>
        <template #tag_name_str="scope">
          <div class="tags">
            <ul class="tags__list" :class="{ allShow: scope.row.tag_show }">
              <template v-for="(item, index) in scope.row.tag_name_str" :key="item">
                <li :class="{ hide: index > 11 }">
                  <GenerateTagsBadge :hall_name="activeHall.hall_code" :tag_code="item" />
                </li>
              </template>
              <li
                class="tags__button"
                @click="handleTagButtonClick(scope.row)"
                v-if="scope.row.tag_button_show"
              >
                {{ scope.row.tag_show ? 'close' : '。。。' }}
              </li>
            </ul>
          </div>
        </template>
        <template #operation="scope">
          <div>
            <ButtonIcon
              icon="eye"
              :name="t('common.detail')"
              @click="handleMemberDetailClick(scope.row)"
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
  &__list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    li {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .hide {
      display: none;
    }
    &.allShow {
      .hide {
        display: block;
      }
    }
  }
  &__button {
    cursor: pointer;
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
    &.red {
      color: #e06672;
      &::before {
        background-color: #e8465e;
      }
    }
    &.blue {
      color: #4f7dc5;
      &::before {
        background-color: #135b86;
      }
    }
    &.orange {
      color: #ee9546;
      &::before {
        background-color: #f9b40c;
      }
    }
  }
}

.customTagListTable {
  .el-table .cell {
  }
}
</style>
