<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQuerySmallMesNote } from '@/api/home.js'
import { apiReadSmartMesNote } from '@/api/home.js'
import { useGlobalStore } from '@/stores/global.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import Tab from '@/components/Tab.vue'
import dayjs from 'dayjs'
import { formatDateDuration, errorRespond } from '@/utils/commonUtils.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import DialogMemberDetail from '@/components/Dialog/DialogMemberDetail/DialogMemberDetail.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()

//api是否成功
const allApiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const allMessageKey = ref('shortLoading')

const refDialogMemberDetail = ref(null) //會員明細Dialog組件ref

const apiIsCalled = ref([false, false, false, false, false])
const tableDatas = ref([[], [], [], [], []])

//當前顯示的tab
const currentTabs = ref('all')
const refTable = ref(null) // ref table
//tabs列表
const tabList = computed(() => {
  return [
    {
      name: 'all',
      label: t('home.all')
    },
    {
      name: 'vip',
      label: t('home.vip')
    },
    {
      name: 'caution',
      label: t('home.alert')
    },
    {
      name: 'target',
      label: t('home.metrics')
    },
    {
      name: 'game',
      label: t('home.games')
    }
  ]
})

const tableData = ref([])
//頁面點擊排名欄位
const tableColumns = computed(() => {
  return [
    {
      label: t('home.category'),
      prop: 'category',
      minWidth: 90,
      align: 'center'
    },
    {
      label: t('home.content'),
      prop: 'content',
      minWidth: 340,
      align: 'center'
    },
    {
      label: t('date.date'),
      prop: 'date',
      minWidth: 110,
      align: 'center'
    },
    {
      label: t('home.read'),
      prop: 'read',
      align: 'center'
    }
  ]
})

const search_date =
  dayjs().subtract(8, 'day').startOf('day').format(t('date.format_date_rule')) +
  '~' +
  dayjs().subtract(1, 'day').startOf('day').format(t('date.format_date_rule'))

//取得資料
const querySmallMesNote = async (kind = '0') => {
  allMessageKey.value = 'shortLoading'
  allApiSuccess.value = false
  if (activeHall.hall_code === '') return
  try {
    const result = await apiQuerySmallMesNote({
      hall_name: activeHall.hall_code,
      kind: kind,
      search_date: formatDateDuration(search_date),
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status

    if (return_code !== '9999') {
      if (return_code !== '0001') {
        allApiSuccess.value = true
        //整理及地圖對應的資料
        transformQuerySmallMesNote(result.data.result)
        switch (kind) {
          case '0':
            apiIsCalled.value[0] = true
            tableDatas.value[0] = tableData.value
            break
          case '1':
            apiIsCalled.value[1] = true
            tableDatas.value[1] = tableData.value
            break
          case '2':
            apiIsCalled.value[2] = true
            tableDatas.value[2] = tableData.value
            break
          case '3':
            apiIsCalled.value[3] = true
            tableDatas.value[3] = tableData.value
            break
          case '4':
            apiIsCalled.value[4] = true
            tableDatas.value[4] = tableData.value
            break
        }
      } else {
        allMessageKey.value = 'noResult'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
      allMessageKey.value = 'chartFailed'
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

//已讀
const readSmartMesNote = async (msgId, kind) => {
  try {
    const result = await apiReadSmartMesNote({
      hall_name: activeHall.hall_code,
      message_id: msgId
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      ElNotification({
        title: t('msg.updated_successfully'),
        type: 'success'
      })
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
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
  querySmallMesNote(kind)
}

const transformQuerySmallMesNote = (data) => {
  tableData.value = data.map((ele, idx) => {
    //給v-for的值
    const contentCut = ele.content.split('#')
    //給搜尋的值，原始值跟頁面呈現不一樣
    const displayContent = contentCut
      .map((ele) => {
        let newString = ele
        if (ele.match(/(.*?)@(.*?)/)) {
          newString = ele.split('@')[0]
        }
        return newString
      })
      .reduce((acc, val) => acc + val.trim(), '')

    return {
      category: tabList.value[ele.kind].label,
      content: displayContent,
      date: dayjs(ele.created_time).format(t('date.format_date_rule')),
      msgId: ele.message_id,
      contentCut: contentCut,
      kind: ele.kind
    }
  })
}

const msgCheck = (event, msgId, msgKind) => {
  event.target.closest('.el-table__row').classList.add('remove-style')
  const tabNameArr = tabList.value.map((ele) => ele.name)
  const tabKind = tabNameArr.indexOf(currentTabs.value)
  apiIsCalled.value[0] = false
  apiIsCalled.value[Number(msgKind)] = false
  readSmartMesNote(msgId, tabKind.toString())
}

//會員明細Dialog點擊
const handleMemberDetailClick = (val) => {
  //寫入store
  dialogMemberDetailStore.memberData = {}
  dialogMemberDetailStore.memberData = val
  refDialogMemberDetail.value.handleOpenDialog()
}

//雙#裡的字串拆成name跟id
const transformUser = (val) => {
  const user = {}
  user.user_name = val.split('@')[0]
  user.user_id = Number(val.split('@')[1])
  return user
}

onMounted(() => {
  querySmallMesNote()
})

watch([() => currentTabs.value, () => i18nLocale.value], () => {
  const tabNameArr = tabList.value.map((ele) => ele.name)
  const kind = tabNameArr.indexOf(currentTabs.value)
  refTable.value.goToFirstPage()
  if (!apiIsCalled.value[kind]) {
    querySmallMesNote(kind.toString())
  } else {
    tableData.value = tableDatas.value[kind]
  }
})
</script>
<template>
  <section class="cdp-section padding-bottom-10 h-444">
    <SectionTitle class="mb-10" :title="t('home.news')"></SectionTitle>
    <DialogMemberDetail ref="refDialogMemberDetail" />
    <el-row :gutter="20" class="mb-10">
      <el-col :span="24">
        <Tab :tabData="tabList" :activeName="currentTabs" v-model="currentTabs"></Tab>
      </el-col>
    </el-row>
    <CdpMessage
      :messageKey="allMessageKey"
      bg="white"
      v-if="allApiSuccess === false"
      :height="300"
      class="mt-25"
    />
    <el-row v-else :gutter="20" class="mb-20">
      <el-col :span="24">
        <CustomTable
          ref="refTable"
          :stripe="true"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :hasPagination="true"
          :serverSide="false"
          :pageSize="5"
          :search="true"
          class="customTable2"
          customSearchClass="home-notify"
        >
          <template v-slot:custom-search></template>
          <template #content="scope">
            <span v-for="(item, idx) in scope.row.contentCut" :key="idx">
              <a
                v-if="item.match(/(.*?)@(.*?)/)"
                class="cdp-link-click inline"
                @click="handleMemberDetailClick(transformUser(item))"
              >
                {{ transformUser(item).user_name }}
              </a>
              <span v-else>{{ item }}</span>
            </span>
          </template>
          <template #read="scope">
            <el-checkbox
              @click.once="msgCheck($event, scope.row.msgId, scope.row.kind)"
              size="large"
            />
          </template>
        </CustomTable>
      </el-col>
    </el-row>
  </section>
</template>
<style lang="scss" scoped>
:deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
  width: 22px;
  height: 22px;
  box-shadow: inset 2px 2px 2px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  transform: rotate(45deg) scale(1.5);
}

:deep(.el-checkbox__inner::after) {
  border-width: 2px;
  height: 7px;
  left: 8px;
  top: 4px;
}

.padding-bottom-10 {
  padding-bottom: 10px;
}

.text-underline {
  text-decoration: underline;
}

:deep(.remove-style) {
  text-decoration: line-through;
  color: #959595;
  td.el-table__cell {
    color: #afafaf;
  }
}

:deep(td.el-table__cell) {
  padding: 2px 0;
}
</style>