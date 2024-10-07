<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiListMemberTags } from '@/api/customerTagList.js'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import {
  checkTagUsage,
  formatDateDuration,
  getSessionStorageEntity,
  trimBack,
  orderTags
} from '@/utils/commonUtils.js'
import { ElNotification } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ExportCSV from './components/ExportCSV.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import Filter from './components/Filter.vue'
import { useDateStore } from '@/stores/dateConfig.js'
import TooltipCustomTag from '@/components/TooltipCustomTag.vue'

const { date_range_picker_config_1, date_range_picker_config_2 } = useDateStore()

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const apiSuccess = ref(false) //api是否成功

const refCustomTable = ref(null) //table ref
const refContent = ref(null)
const defineTagsWidth = 46 // 定義標籤欄位寬度百分比
const tagsColumnWidth = ref(0)

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const tableData = ref([])
const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(10) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數

const canvas = ref(null)

const tag_description_dict =
  getSessionStorageEntity('system_config').tags_config

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
      headerAlign: 'center',
      align: 'left',
      minWidth: defineTagsWidth + '%'
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
  tableData.value = []
  if (searchType !== 'page') {
    apiSuccess.value = false
    messageKey.value = 'loading'
  } else {
    refCustomTable.value.showTableLoading = true
  }
  try {
    const result = await apiListMemberTags({
      activated_date: formData['activatedDate'], //實動日期
      ag_name: formData['selectAcount'] === '0' ? '' : formData['selectAcount'], //代理帳號
      custom_user_list: formData['customUserList'], // 手動匯入名單的帳號
      exclude_tag: formData['excludeTag'], //排除標籤
      fuzzy_search: formData['fuzzySearch'], //模糊搜尋
      hall_name: activeHall.hall_code,
      length: 10,
      locale: i18nLocale.value,
      records_total: apiRecordsTotal.value, // 前端頁面目前資料總數，0 or 不帶api都會重新拿取總資料數，如果有帶api就不會重拿，會回傳前端傳的數值
      search_date: formData['registerDate'], //註冊日期
      search_name: formData['member'], //會員名稱
      search_tag: trimBack(formData['searchTag']), //包含標籤
      start: apiStart.value,
      user_level_id: parseInt(formData['selectLevel']) //會員層級
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
      tableData.value = transformListMemberTags(result.data.result.data)
      apiRecordsTotal.value = result.data.result.records_total
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiRecordsTotal.value = 0
        messageKey.value = 'noResult'
      } else {
        apiRecordsTotal.value = 0
        messageKey.value = 'queryFailed'
      }
    }
  } catch (error) {
    console.error(error)
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
  tagsColumnWidth.value = (refContent.value.offsetWidth * (defineTagsWidth / 100) - 48) * 2 // 取得標籤欄位內容總寬，預設顯示兩行所以 * 2
  let result = []
  let tagWidth = 0

  data.map((item, index) => {
    let tempObj = {
      ...item,
      index,
      tag_name_str: [],
      tag_transfrom_obj: [],
      tag_show: false,
      tag_button_show: false, // 按鈕是否顯示
      register_date:
        item.register_date === ''
          ? ''
          : dayjs(item.register_date).format(t('date.format_datetime_rule'))
    }

    let tag_str_ary = item.tag_str ? item.tag_str.split(',') : []

    for (let i = 0; i < tag_str_ary.length; i++) {
      //  若標籤代碼禁用，則跳過不顯示
      if (checkTagUsage(tag_str_ary[i])) {
        tempObj['tag_name_str'].push(tag_str_ary[i])
      }
    }
    // 將 6 開頭的風控標籤移動到最前面
    tempObj['tag_name_str'] = orderTags(tempObj['tag_name_str'])

    tempObj['tag_name_str'].forEach((item) => {
      let obj = {}
      obj['code'] = item
      obj['name'] = tag_description_dict[item]['tag_name']

      obj['width'] = getTextWidth(obj['name'])
      tagWidth = tagWidth + obj['width']
      if (tagsColumnWidth.value - tagWidth > obj['width']) {
        obj['hide'] = false
      } else {
        obj['hide'] = true
        tempObj['tag_button_show'] = true
      }
      tempObj['tag_transfrom_obj'].push(obj)
    })
    result.push(tempObj)
    tagWidth = 0
  })

  return result
}

// 取得文字總寬
const getTextWidth = (val) => {
  const text = val
  const context = canvas.value.getContext('2d')
  const tagPadding = 16 // left + right
  const tagMarginRight = 5

  // 設定字體大小及字體
  context.font = '13px Noto Sans TC'

  // 取得字串總寬 + padding + margin
  const charWidths = context.measureText(text).width + tagPadding + tagMarginRight
  return Math.floor(charWidths)
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

const key = ref(systemConfigIsOk.value)
watch(
  () => systemConfigIsOk.value,
  () => {
    if (!globalStore.hallChange) {
      key.value = Math.floor(Math.random() * 100)
    }
  }
)

onMounted(() => {
  queryListMemberTags({ searchType: '' })
})
</script>
<template>
  <section class="cdp-section mb-0">
    <canvas ref="canvas" style="display: none"></canvas>
    <div class="flex items-center justify-between mb-20" ref="refContent">
      <!-- justify-between -->
      <PageTitle icon="menuTag" :title="$t('sidebar.bbin_customer_tag_list')" />
      <div class="flex">
        <ExportCSV
          v-if="tableData.length !== 0"
          class="mr-10"
          :formData="formData"
          :total="apiRecordsTotal"
        />
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
          <div
            class="cdp-link-click"
            :class="{ 'line-through': scope.row.is_deleted === 1 }"
            @click="updateMemberData(scope.row)"
          >
            {{ scope.row.user_name }}
          </div>
        </template>
        <template #tag_name_str-header>
          <TooltipCustomTag />
        </template>
        <template #tag_name_str="scope">
          <div class="tags">
            <ul class="tags__list" :class="{ allShow: scope.row.tag_show }">
              <template v-for="item in scope.row.tag_transfrom_obj" :key="item">
                <li :class="{ hide: item.hide }">
                  <GenerateTagsBadge
                    :key="key"
                    :hall_name="activeHall.hall_code"
                    :tag_code="item.code"
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
                  :content="scope.row.tag_show ? $t('tags.hide_some_tag') : $t('tags.open_all_tag')"
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
.mb-0 {
  margin-bottom: 0 !important;
}

.tags {
  display: flex;
  width: 100%;
  &__list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
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
