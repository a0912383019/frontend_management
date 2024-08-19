<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  apiListUserByAdmin,
  apiSimulateUserDataPhp,
  apiSimulateUserDataGo,
  apiDeleteUserByAdmin
} from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification, dayjs } from 'element-plus'
import {
  sortTableDate,
  sortTableData,
  errorRespond,
  getSessionStorageEntity
} from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import AddAccount from '@/components/Button/AddButton.vue'
import Filter from '@/views/AdminUserList/Filter.vue'
import UserAccountSetting from '@/views/AdminUserList/UserAccountSetting.vue'
import AddUserAccount from '@/views/AdminUserList/AddUserAccount.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()

const globalStore = useGlobalStore()

const tableData = ref([])
const apiLength = ref(10) //一頁幾筆

const tableColumns = computed(() => {
  return [
    {
      label: t('user_detail_info.account_name'),
      prop: 'account_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '15%'
    },
    {
      label: t('data_name.email'),
      prop: 'email',
      headerAlign: 'center',
      align: 'center',
      colClass: 'break-work',
      minWidth: '20%'
    },
    {
      label: t('user_detail_info.user_type'),
      prop: 'user_type',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.status'),
      prop: 'status',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    },
    {
      label: t('data_name.login_num'),
      prop: 'login_num',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%',
      sortable: 'custom'
    },
    {
      label: t('user_detail_info.last_login_time'),
      prop: 'last_login_time',
      headerAlign: 'center',
      align: 'center',
      minWidth: '13%',
      sortable: 'custom'
    },
    {
      label: t('common.operation'),
      prop: 'operation',
      headerAlign: 'center',
      align: 'center',
      minWidth: '20%'
    }
  ]
})

const apiSuccess = ref(false)
const messageKey = ref('loading')

const queryListUserByAdmin = async (filterData = null) => {
  let userName = null
  let userType = null
  let userStatus = null
  let lastLoginTime = null

  if (filterData !== null) {
    userName = filterData.userName
    userType = filterData.userType === 'all' ? null : filterData.userType
    userStatus = filterData.userStatus === 'all' ? null : filterData.userStatus
    lastLoginTime = filterData.lastLoginTime
  }

  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiListUserByAdmin({
      name: userName,
      user_type: userType,
      user_status: userStatus,
      last_login_date: lastLoginTime
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        tableData.value = transformUserList(result.data.result)
      }
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      apiSuccess.value = false
      tableData.value = []
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
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

const transformUserList = (data) => {
  return data.map((ele) => {
    return {
      id: ele.id,
      account_name: ele.name,
      email: ele.email,
      user_type: ele.user_type,
      status: ele.user_status,
      login_num: ele.login_num,
      last_login_time:
        ele.last_login_date === null
          ? '-'
          : dayjs(ele.last_login_date).format(t('date.format_datetime_rule'))
    }
  })
}

// 自定義排序執行的內容
const upadteCurrentSort = ({ prop, order }) => {
  if (prop === 'login_num') {
    sortTableData({ prop, order, tableData: tableData.value })
  } else if (prop === 'last_login_time') {
    sortTableDate({ prop, order, tableData: tableData.value })
  }
}

const addAccountVisible = ref(false)

const closeAddDialog = () => {
  addAccountVisible.value = false
}

const openAddDialog = () => {
  addAccountVisible.value = true
}

const searchAccount = (filterData) => {
  queryListUserByAdmin(filterData)
}

const userAccountVisible = ref(false)
const userData = reactive({
  userId: null,
  userName: ''
})

const showAccountSetting = (userId, userName) => {
  userData.userId = userId
  userData.userName = userName
  userAccountVisible.value = true
}

const closeUserDialog = () => {
  userData.userId = null
  userData.userName = ''
  userAccountVisible.value = false
}

const querySimulateUserData = async (user_id) => {
  const [phpResponse, goResponse] = await Promise.all([
    apiSimulateUserDataPhp({
      user_id
    }),
    apiSimulateUserDataGo({
      user_id
    })
  ])

  const { return_code: phpReturnCode } = phpResponse.data.status
  const { return_code: goReturnCode } = goResponse.data.status

  if (phpReturnCode === '0000' && goReturnCode === '0000') {
    simulationUser(phpResponse.data.result, goResponse.data.result)
  } else {
    const failMsg = errorRespond(result.data.status)
    console.error(failMsg)
    ElNotification({
      title: t('admin.demo_failed'),
      type: 'error'
    })
  }
}

// 設定模擬畫面要倒轉的路由
const simulationRoute = router.resolve({
  name: 'Home',
  query: {
    simulate: true
  }
})

const simulationUser = (phpData, goData) => {
  const { token_type: phpTokenType, access_token: phpAccessToken } = phpData
  const {
    user_id,
    user_name,
    user_type,
    access_hall,
    picture,
    token_type: goTokenType,
    access_token: goAccessToken
  } = goData
  let user_info_entity = {
    user_id,
    user_name,
    user_type,
    access_hall,
    picture
  }

  let curUserData = getSessionStorageEntity('user_info')
  let curUserTokenPhp = sessionStorage.access_token
  let curUserTokenGo = sessionStorage.access_token_go

  let simulateUserTokenPhp = phpTokenType + ' ' + phpAccessToken
  let simulateUserTokenGo = goTokenType + ' ' + goAccessToken

  //  將模擬的使用者資料更新至sessionStorage
  sessionStorage.setItem('user_info', JSON.stringify(user_info_entity))
  sessionStorage.setItem('access_token', simulateUserTokenPhp)
  sessionStorage.setItem('access_token_go', simulateUserTokenGo)

  //  開啟模擬視窗
  window.open(simulationRoute.href, 'CDP', 'height=960,width=1560')

  //  將目前的使用者資料更新回sessionStorage
  sessionStorage.setItem('user_info', JSON.stringify(curUserData))
  sessionStorage.setItem('access_token', curUserTokenPhp)
  sessionStorage.setItem('access_token_go', curUserTokenGo)
}

const reloadList = () => {
  userAccountVisible.value = false
  addAccountVisible.value = false
  queryListUserByAdmin()
}

const deleteUserByAdmin = async (user_id) => {
  try {
    const result = await apiDeleteUserByAdmin({
      user_id
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.delete_successful'),
        type: 'success'
      })
      initDeleteUser()
      queryListUserByAdmin()
    } else {
      ElNotification({
        title: t('msg.delete_failed'),
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
        title: t('msg.delete_failed'),
        type: 'error'
      })
    }
  }
}

const deleteBox = ref(false) // 刪除彈窗
const deleteId = ref(null)
const deleteName = ref('') // 要刪除的名稱
const openDeleteBox = (id, name) => {
  deleteId.value = id
  deleteName.value = name
  deleteBox.value = true
}

const cancelDelete = () => {
  initDeleteUser()
  deleteBox.value = false
}

const confirmDelete = () => {
  deleteUserByAdmin(deleteId.value)
  deleteBox.value = false
}

const initDeleteUser = () => {
  deleteId.value = null
  deleteName.value = ''
}

onMounted(() => {
  queryListUserByAdmin()
})
</script>
<template>
  <section class="cdp-section">
    <div class="flex items-center justify-between mb-20" ref="refContent">
      <PageTitle icon="menuUser" :title="$t('sidebar.admin_user_list')" />
      <div class="flex">
        <AddAccount class="mr-10" :name="$t('admin_user.add_account')" @click="openAddDialog" />
        <Filter @searchAccount="searchAccount" />
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div class="cdp-section-in" v-else>
      <SectionTitle class="mb-16" :title="$t('user_detail_info.account_overview')"></SectionTitle>
      <CustomTable
        :serverSide="false"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="apiLength"
        :stripe="true"
        class="customTable2 customAdminTable"
        @sort="upadteCurrentSort"
      >
        <template #account_name="scope">
          <div
            class="font-size-14 cdp-link-click"
            @click="showAccountSetting(scope.row.id, scope.row.account_name)"
          >
            <span>{{ scope.row.account_name }}</span>
          </div>
        </template>
        <template #user_type="scope">
          <div class="font-size-14">
            <span v-if="scope.row.user_type === 0" class="cdp-text-shamrockgreen">{{
              globalStore.userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 1" class="cdp-text-celticblue">{{
              globalStore.userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 8" class="cdp-text-harvestgold">{{
              globalStore.userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 9" class="cdp-text-red">{{
              globalStore.userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === -1" class="cdp-text-eggmeal">{{
              globalStore.userTypeConfig[scope.row.user_type]
            }}</span>
          </div>
        </template>
        <template #status="scope">
          <div class="font-size-14">
            <span v-if="scope.row.status === 0" class="cdp-text-lightgreen">{{
              globalStore.userStatusConfig[scope.row.status]
            }}</span>
            <span v-if="scope.row.status === 1" class="cdp-text-red">{{
              globalStore.userStatusConfig[scope.row.status]
            }}</span>
          </div>
        </template>
        <template #operation="scope">
          <div>
            <ButtonIcon
              class="detail-button mr-5"
              icon="computer"
              :isSvg="true"
              :name="$t('admin_user.demo')"
              @click="querySimulateUserData(scope.row.id)"
            />
            <ButtonIcon
              class="detail-button ml-5"
              color="red"
              icon="trash"
              :isSvg="true"
              :name="$t('common.delete')"
              @click="openDeleteBox(scope.row.id, scope.row.account_name)"
            />
          </div>
        </template>
      </CustomTable>
      <UserAccountSetting
        v-model="userAccountVisible"
        :userId="userData.userId"
        :userName="userData.userName"
        @closeDialog="closeUserDialog"
        @updateSuccess="reloadList"
      />
    </div>
  </section>
  <AddUserAccount
    v-model="addAccountVisible"
    @closeAddDialog="closeAddDialog"
    @addSuccess="reloadList"
  />
  <ConfirmBox
    color="red"
    v-model="deleteBox"
    :title="$t('modal.delete')"
    @cancelExecute="cancelDelete"
    @confirmExecute="confirmDelete"
  >
    <template v-slot:text-body>
      {{ $t('modal.are_you_sure_to_delete') + '「' + deleteName + '」?' }}
    </template>
  </ConfirmBox>
</template>
<style lang="scss" scoped>
// email 超出cell寬度會自己斷行
:deep(.break-work) {
  .cell {
    word-break: break-all;
  }
}
:deep(.customAdminTable) {
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
