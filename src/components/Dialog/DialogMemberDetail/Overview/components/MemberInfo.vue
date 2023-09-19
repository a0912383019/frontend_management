<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  apiQueryMemberInfo,
  apiQueryMemberLifeCycle,
  apiUpdateMemberTagsEnable
} from '@/api/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import {
  getSessionStorageEntity,
  checkTagUsage,
  generateTagMultiSelect,
  errorRespond
} from '@/utils/commonUtils.js'
import { system_admin } from '@/../public/js/system_config.js'
import { dayjs, ElNotification } from 'element-plus'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import BoxLoading from '@/components/Loading/BoxLoading.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { tableConfig } = storeToRefs(globalStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()

const apiMemberData = reactive({}) //存放api資料

const boxIsLoading = ref(true)

const userType = ref(getSessionStorageEntity('user_info').user_type)

//取得會員基本資料
const queryMemberInfo = async () => {
  boxIsLoading.value = true //顯示loading
  try {
    const result = await apiQueryMemberInfo({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id
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
      boxIsLoading.value = false //載入完成 移除loading
    } else if (return_code === '0001') {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    boxIsLoading.value = true //顯示loading
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

const tagSelectValue = ref([]) //標籤下拉選擇的內容
const tagSelectOptions = ref([]) //標籤下拉選單
let tagDict = reactive({})
//會員明細標籤處理
const includeTags = ref('')
const includeTagsText = ref('')
const confirmTagsText = ref('') //修改後的標籤
const tagIsEdit = ref(false) //確認標籤目前是否為編輯狀態
const tagStrList = ref([])
const transformMemberInfoTagStr = (data) => {
  let has_tag_ary = data ? data.split(',') : []
  has_tag_ary.forEach((item) => {
    //  若標籤代碼禁用，則跳過不顯示
    if (checkTagUsage(activeHall.hall_code, item)) {
      tagStrList.value.push(item)
    }
  })

  //取得標籤
  tagDict = generateTagMultiSelect({ hall_name: activeHall.hall_code }) //檢查標籤，排除禁用
  //產生標籤下拉選單
  generateSelectData()

  // 取得包含標籤
  get_include_tags(has_tag_ary)
}

const handleTagIsEdit = (status) => {
  if (status) {
    //true 進入編輯內容
    tagIsEdit.value = status
  } else {
    // false 送出編輯內容
    tagInnerDialogVisible.value = true
    transformConfirmTagsText()
  }
}

const tagInnerDialogVisible = ref(false) //inner dialog開啟狀態
const handleInnerTagIsEdit = (status) => {
  tagInnerDialogVisible.value = false
  switch (status) {
    case 'confirm':
      updateMemberTagsEnable()
      break
  }
}

//取得修改後標籤的文字
const transformConfirmTagsText = () => {
  let lastIndex = tagSelectValue.value.length - 1
  confirmTagsText.value = []
  tagSelectValue.value.forEach((item, index) => {
    confirmTagsText.value = confirmTagsText.value + tagDict[item]['tag_name']
    if (index !== lastIndex) {
      confirmTagsText.value = confirmTagsText.value + '、'
    }
  })
}

const updateMemberTagsEnable = async () => {
  try {
    const result = await apiUpdateMemberTagsEnable({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id,
      user_name: apiMemberData.user_name,
      user_tags_original: includeTags.value,
      user_tags_new: tagSelectValue.value.join(',')
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      pageInit()
      ElNotification({
        message: t('msg.updated_successfully'),
        type: 'success'
      })
      tagIsEdit.value = false // 將標籤切回一般狀態顯示
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

//產生標籤下拉選單
const generateSelectData = () => {
  let result = []
  Object.entries(tagDict).map((item) => {
    result.push({
      label: item[1]['tag_name'],
      value: item[1]['tag_key'],
      disabled: false,
      ...item[1]
    })
  })
  tagSelectOptions.value = []
  tagSelectOptions.value = result
}

// 標籤select change事件
const handleTagChange = () => {
  // 取得config
  let tagConfig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

  // 將選項全部先取消disabled
  for (let i = 0; i < tagSelectOptions.value.length; i++) {
    tagSelectOptions.value[i]['disabled'] = false
  }

  // 目前選擇的標籤list
  for (let i = 0; i < tagSelectValue.value.length; i++) {
    // 該標籤的互斥標籤list
    if (tagConfig[tagSelectValue.value[i]].mutual_tags_code != null) {
      // 互斥表
      let mutualTagAry = tagConfig[tagSelectValue.value[i]].mutual_tags_code.split(',')
      for (let j = 0; j < tagSelectOptions.value.length; j++) {
        // 該option有在互斥列表裡面就disable
        if (mutualTagAry.indexOf(tagSelectOptions.value[j]['value']) !== -1) {
          tagSelectOptions.value[j]['disabled'] = true
        }
      }
    }
  }
}

// 取得包含標籤
const get_include_tags = (hasTags) => {
  hasTags.forEach((item) => {
    if (tagDict[item] !== undefined) {
      if (includeTagsText.value !== '') {
        includeTags.value = includeTags.value + ',' + item
        includeTagsText.value = includeTagsText.value + '、' + tagDict[item]['tag_name']
      } else {
        includeTags.value = item
        includeTagsText.value = tagDict[item]['tag_name']
      }
      //下拉選單塞入預設值
      tagSelectValue.value.push(item)
    }
  })
}

//取得會員生命週期資訊
const queryMemberLifeCycle = async () => {
  try {
    const result = await apiQueryMemberLifeCycle({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id,
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
  tagSelectValue.value = []
  tagSelectOptions.value = []
  includeTags.value = ''
  includeTagsText.value = ''
  tagStrList.value = []
}

onMounted(() => {
  pageInit()
})
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8" class="mb-10">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.ag_name') }}</div>
        <el-input v-model="apiMemberData.ag_name" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-10">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.user_level') }}</div>
        <el-input v-model="apiMemberData.user_level" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-10">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.register_date') }}</div>
        <el-input
          v-model="apiMemberData.register_date"
          class="cdp-input cdp-input-disabled"
          readonly
        >
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-10">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.life_cycle') }}</div>
        <el-input v-model="apiMemberData.life_cycle" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-10" v-if="userType === system_admin">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.phone_number') }}</div>
        <el-input v-model="apiMemberData.user_phone" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="8" class="mb-10" v-if="userType === system_admin">
        <div class="cdp-text-blue mb-5">{{ $t('data_name.email') }}</div>
        <el-input v-model="apiMemberData.user_mail" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="24" class="mb-10">
        <div class="cdp-text-blue mb-5">{{ $t('tags.tags') }}</div>
        <div v-show="!tagIsEdit">
          <div class="tags relative">
            <transition>
              <BoxLoading v-show="boxIsLoading" />
            </transition>
            <div class="tags__box">
              <ul class="tags__list">
                <li v-for="(item, index) in tagStrList" :key="index">
                  <GenerateTagsBadge :hall_name="activeHall.hall_code" :tag_code="item" />
                </li>
              </ul>
            </div>
            <CdpButton
              class="tags__button custom-bg-dark__blue"
              :name="t('common.edit')"
              @click="handleTagIsEdit(true)"
            />
          </div>
        </div>
        <div v-show="tagIsEdit">
          <div class="tags">
            <el-select
              v-model="tagSelectValue"
              @change="handleTagChange"
              multiple
              class="cdp-tag-select mr-6"
            >
              <el-option
                v-for="item in tagSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
            <CdpButton
              class="tags__button custom-bg-dark__blue"
              :name="t('modal.confirm')"
              @click="handleTagIsEdit(false)"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-model="tagInnerDialogVisible"
      width="300"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      class="cdp-confirm-dialog"
    >
      <div class="inner-dialog">
        <div class="inner-dialog__icon"><img src="@/assets/images/alert-2.png" alt="" /></div>
        <div class="inner-dialog__title cdp-text-light-blue">
          {{ $t('modal.confirm_correct_desc') }}
        </div>
        <ul class="inner-dialog__list ul-reset">
          <li>
            <div class="inner-dialog__list__title">
              {{ $t('customer_detail_info.member_name') }}
            </div>
            <div class="inner-dialog__list__text">{{ apiMemberData.user_name }}</div>
          </li>
          <li>
            <div class="inner-dialog__list__title">
              {{ $t('customer_detail_info.updated_tags') }}：
            </div>
            <div class="inner-dialog__list__text">
              {{ confirmTagsText }}
            </div>
          </li>
          <li>
            <div class="inner-dialog__list__title">
              {{ $t('customer_detail_info.original_tags') }}：
            </div>
            <div class="inner-dialog__list__text">
              {{ includeTagsText }}
            </div>
          </li>
        </ul>
        <div class="inner-dialog__button">
          <CdpButton
            class="cdp__modal-btn__cancel"
            :name="t('modal.modify')"
            @click="handleInnerTagIsEdit('modify')"
          />
          <CdpButton
            class="cdp__modal-btn__submit"
            :name="t('modal.confirm')"
            @click="handleInnerTagIsEdit('confirm')"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tags {
  display: flex;
  &__box {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    width: 100%;
    margin-right: 5px;
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
</style>
<style lang="scss">
.cdp-tag-select {
  width: 100%;
  .el-tag {
    background-color: $blue;
    color: #fff;
    border-radius: 30px;
    .el-icon {
      color: #fff;
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
</style>
