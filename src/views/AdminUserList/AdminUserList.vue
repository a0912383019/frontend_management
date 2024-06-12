<script setup>
import { ref, watch, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiListUserByAdmin, apiSimulateUserData } from '@/api'
import { useGlobalStore } from '@/stores'
import { storeToRefs } from 'pinia'
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
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall, userTypeConfig, userStatusConfig } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

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

const userType = ref('all')
const userStatus = ref('all')
const lastLoginTime = ref('')

const queryListUserByAdmin = async (filterData = null) => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  tableData.value = []
  try {
    const result = await apiListUserByAdmin({
      hall_name: activeHall.hall_code,
      user_name: filterData ? filterData.userName : '',
      user_type: filterData ? filterData.userType : userType.value,
      user_status: filterData ? filterData.userStatus : userStatus.value,
      last_login_date: filterData ? filterData.lastLoginTime : lastLoginTime.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        tableData.value = transformUserList(result.data.result)
      }
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      //   messageKey.value = 'noPermission' //更改message內容
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

const openAddDialog = () => {
  console.log('add account')
}

const searchAccount = (filterData) => {
  queryListUserByAdmin(filterData)
}

const userAccountVisible = ref(false)
const userData = reactive({})
const showAccountSetting = (userId, userName) => {
  console.log(userId, userName)
  userData.userId = userId
  userData.userName = userName
  userAccountVisible.value = true
}
const closeUserDialog = () => {
  userAccountVisible.value = false
}

const querySimulateUserData = (user_id) => {
  return new Promise((resolve, reject) => {
    apiSimulateUserData({ user_id })
      .then((result) => {
        const { return_code } = result.data.status
        if (return_code === '0000') {
          let userInfo = result.data.result
          let userInfoEntity = {
            user_id: userInfo.user_id,
            user_name: userInfo.user_name,
            user_type: userInfo.user_type,
            access_hall: userInfo.access_hall,
            user_picture: userInfo.picture,
            access_token: userInfo.token_type + ' ' + userInfo.access_token
          }
          resolve(userInfoEntity)
        } else {
          const failMsg = errorRespond(result.data.status)
          console.error(failMsg)
          reject(new Error(failMsg))
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response && error.response.status === 401) {
          globalStore.storeHandleApiError()
        }
        reject(error)
      })
  })
}

const simulationRoute = router.resolve({ name: 'Home' })
const simulationUser = (id) => {
  querySimulateUserData(id)
    .then((userInfoEntity) => {
      let curUserData = getSessionStorageEntity('user_info')
      let curUserToken = sessionStorage.access_token
      let simulateUserToken = userInfoEntity.access_token
      delete userInfoEntity.access_token

      //  將模擬的使用者資料更新至sessionStorage
      sessionStorage.setItem('user_info', JSON.stringify(userInfoEntity))
      sessionStorage.access_token = simulateUserToken

      //  開啟模擬視窗
      window.open(simulationRoute.href, 'CDP', 'height=960,width=1560')

      //  將目前的使用者資料更新回sessionStorage
      sessionStorage.setItem('user_info', JSON.stringify(curUserData))
      sessionStorage.access_token = curUserToken
    })
    .catch(() => {
      ElNotification({
        title: t('admin_user.demo_failed'),
        type: 'error'
      })
    })
}

const openDeleteBox = (id) => {
  console.log('delete ', id)
}

watch(
  () => systemConfigIsOk.value,
  () => {
    // queryAgNameUserLevel()
  }
)

onMounted(() => {
  queryListUserByAdmin()
})
</script>
<template>
  <section class="cdp-section mb-0">
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
              userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 1" class="cdp-text-celticblue">{{
              userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 8" class="cdp-text-harvestgold">{{
              userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === 9" class="cdp-text-red">{{
              userTypeConfig[scope.row.user_type]
            }}</span>
            <span v-if="scope.row.user_type === -1" class="cdp-text-eggmeal">{{
              userTypeConfig[scope.row.user_type]
            }}</span>
          </div>
        </template>
        <template #status="scope">
          <div class="font-size-14">
            <span v-if="scope.row.status === 0" class="cdp-text-lightgreen">{{
              userStatusConfig[scope.row.status]
            }}</span>
            <span v-if="scope.row.status === 1" class="cdp-text-red">{{
              userStatusConfig[scope.row.status]
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
              @click="simulationUser(scope.row.id)"
            />
            <ButtonIcon
              class="detail-button ml-5"
              color="red"
              icon="trash"
              :isSvg="true"
              :name="$t('common.delete')"
              @click="openDeleteBox(scope.row.id)"
            />
          </div>
        </template>
      </CustomTable>
      <UserAccountSetting
        v-model="userAccountVisible"
        :userId="userData.userId"
        :userName="userData.userName"
        @closeDialog="closeUserDialog"
      />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.customAdminTable {
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
<style lang="scss" scoped>
// email 超出cell寬度會自己斷行
:deep(.break-work) {
  .cell {
    word-break: break-all;
  }
}
</style>
