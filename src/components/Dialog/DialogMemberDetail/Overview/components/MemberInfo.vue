<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberInfo, apiQueryMemberLifeCycle } from '@/api/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { getSessionStorageEntity, checkTagUsage, errorRespond } from '@/utils/commonUtils.js'
import { system_admin } from '@/../public/js/system_config.js'
import { dayjs, ElNotification } from 'element-plus'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { tableConfig } = storeToRefs(globalStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()

const apiMemberData = reactive({}) //存放api資料

const userType = ref(getSessionStorageEntity('user_info').user_type)

const apiSuccess = ref(false)

//取得會員基本資料
const queryMemberInfo = async () => {
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberInfo({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      const { ag_name, user_name, user_level, register_date, user_phone, user_mail, tag_str } =
        result.data.result
      apiMemberData.user_name = user_name
      apiMemberData.ag_name = ag_name
      apiMemberData.user_level = user_level
      apiMemberData.register_date = dayjs(register_date).format(t('date.format_datetime_rule'))
      apiMemberData.user_phone = user_phone
      apiMemberData.user_mail = user_mail
      transformMemberInfoTagStr(tag_str) //處理標籤
      apiSuccess.value = true
    } else if (return_code === '0001') {
      transformMemberInfoTagStr() //處理標籤
      apiSuccess.value = true
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
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  }
}

//會員明細標籤處理
const tagStrList = ref([])
const transformMemberInfoTagStr = (data) => {
  let has_tag_ary = data ? data.split(',') : []
  has_tag_ary.forEach((item) => {
    //  若標籤代碼禁用，則跳過不顯示
    if (checkTagUsage(activeHall.hall_code, item)) {
      tagStrList.value.push(item)
    }
  })
}

//取得會員生命週期資訊
const queryMemberLifeCycle = async () => {
  try {
    const result = await apiQueryMemberLifeCycle({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id,
      data_date: dayjs().subtract(2, 'day').format('YYYY-MM-DD') // 預設取當下日期前兩天為條件
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiMemberData.life_cycle = tableConfig.value[result.data.result['this_day_step']]['step_name']
    } else if (return_code === '0001') {
      // 該會員沒有生命週期紀錄
      apiMemberData.life_cycle = t('common.none')
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
        title: t('msg.query_failed'),
        type: 'error'
      })
    }
  }
}

//初始化
const pageInit = () => {
  handleEmptyData()
  queryMemberInfo()
  queryMemberLifeCycle()
}

//清空資料
const handleEmptyData = () => {
  tagStrList.value = []
}

onMounted(() => {
  pageInit()
})
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8" class="mb-15">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.ag_name') }}</div>
        <el-input v-model="apiMemberData.ag_name" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-15">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.user_level') }}</div>
        <el-input v-model="apiMemberData.user_level" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-15">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.register_date') }}</div>
        <el-input
          v-model="apiMemberData.register_date"
          class="cdp-input cdp-input-disabled"
          readonly
        >
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-15">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.life_cycle') }}</div>
        <el-input v-model="apiMemberData.life_cycle" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-15" v-if="userType === system_admin">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.phone_number') }}</div>
        <el-input v-model="apiMemberData.user_phone" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-15" v-if="userType === system_admin">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.email') }}</div>
        <el-input v-model="apiMemberData.user_mail" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="24" class="mb-15">
        <div class="cdp-text-blue mb-3">{{ $t('tags.tags') }}</div>
        <div class="loading-tag" v-show="!apiSuccess">
          <LoadingBox size="md" color="blue" />
        </div>
        <div v-show="apiSuccess">
          <div class="tags relative">
            <div class="tags__box">
              <ul class="tags__list">
                <li v-for="(item, index) in tagStrList" :key="index">
                  <GenerateTagsBadge :hall_name="activeHall.hall_code" :tag_code="item" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.loading-tag {
  width: 20px;
  margin: 10px auto;
}
.tags {
  display: flex;
  align-items: end;
  &__box {
    display: flex;
    min-height: 35px !important;
    justify-content: flex-start;
    align-content: center;
    width: 100%;
    padding: 14px 14px 8px 14px;
    border-radius: 5px;
    border: solid 1px #cfd8e6;
    background-color: rgba(207, 216, 230, 0.2);
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    li {
      list-style-type: none;
      margin-right: 6px;
      margin-bottom: 6px;
    }
  }
  &__button {
    flex-shrink: 0;
  }
}
.minH-80 {
  :deep(.el-input__wrapper) {
    min-height: 80px !important;
  }
}
.cdp-input {
  :deep(.el-input__inner) {
    cursor: default !important;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0 !important;
  }
}
</style>
<style lang="scss">
.cdp-tag-select {
  width: 100%;
  .el-tag {
    background-color: $blue;
    color: #404040;
    border-radius: 30px;
    .el-icon {
      color: #909399;
    }
    &.is-closable {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  }
  &.el-select {
    .el-select-tags-wrapper {
      &.has-prefix {
        padding-left: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
  }
  .el-input {
    &__inner {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
}
.top15per {
  top: 15%;
}
</style>
