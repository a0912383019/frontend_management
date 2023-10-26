<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiUpdateCustomFlag } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/commonUtils.js'
import { ElNotification, dayjs } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { date_range_picker_config_4 } = useDateStore()

const { t } = useI18n()

const emit = defineEmits(['update:flag'])

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const dialogVisible = ref(false) // dialog 開啟狀態
const submitCheckVisible = ref(false) // 確認送出的dialog
const notSaveVisible = ref(false) // 尚未儲存的dialog
const deleteVisible = ref(false) // 刪除的dialog
const submitBtnDisabled = ref(true) // 送出按鈕disabled

const dateMinDate = ref(dayjs(dialogMemberDetailRangeDate.value.split(' ~ ')[0])) // 最小日期
const dateMaxDate = ref(dayjs(date_range_picker_config_4.maxDate)) // 最大日期

// 日曆可選的日期
const disabledDate = (day) => {
  return day < dateMinDate.value || day > dateMaxDate.value
}

// dialog狀態 add, edit
const dialogType = ref('add')

const refForm = ref(null)

// 表單資料
const form = reactive({
  date: '',
  title: '',
  content: '',
  user: '',
  updatedTime: ''
})

// 用來做表單有無異動的比對
const formOriginal = reactive({
  date: '',
  title: '',
  content: ''
})

// 用來做表單dialog關閉前來存放的資料
const formTemp = reactive({
  date: '',
  title: '',
  content: ''
})

// 日期異動
const handleDateChange = (date) => {
  formTemp.date = date
}

const updateCustomFlag = async (type) => {
  let formTitle = form.title
  let notificationTitle = t('msg.updated_successfully')
  if (type === 'delete') {
    formTitle = ''
    notificationTitle = t('msg.delete_successful')
  }
  try {
    const result = await apiUpdateCustomFlag({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id,
      flag_date: formatDate(form.date),
      flag_title: formTitle,
      flag_content: form.content
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: notificationTitle,
        type: 'success'
      })
      return Promise.resolve('update success')
    } else {
      return Promise.reject('error')
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

// 送出前檢查
const handleCheckSubmit = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      submitCheckVisible.value = true
    }
  })
}

// 送出
const handleSubmit = (type) => {
  if (form.title !== '' && form.content !== '') {
    updateCustomFlag(type)
      .then(() => {
        clearForm()
        dialogVisible.value = false
        submitCheckVisible.value = false
        notSaveVisible.value = false
        deleteVisible.value = false
        dialogType.value = ''
        emit('update:flag')
      })
      .catch((err) => {
        console.error(err)
      })
  } else {
    form.date = formTemp.date
    form.title = formTemp.title
    form.content = formTemp.content
    dialogVisible.value = true
  }
}

// 刪除
const handleDelete = () => {
  deleteVisible.value = true
}

// 欄位移除焦點
const handleBlur = () => {
  if (
    formOriginal.date !== form.date ||
    formOriginal.title !== form.title ||
    formOriginal.content !== form.content
  ) {
    submitBtnDisabled.value = false
  } else {
    submitBtnDisabled.value = true
  }
}

// 開啟dialog
const dialogOpen = ({ type, data }) => {
  if (type === 'add') {
    form.date = dayjs(dateMaxDate.value).format(t('date.format_date_rule'))
  }
  if (type === 'edit') {
    // 編輯旗標，帶入資料
    form.date = data.date
    form.title = data.title
    form.content = data.content
    form.user = data.user
    form.updatedTime = data.updatedTime
  }

  // 儲存當前資料，作為後續比對資料是否有異動
  formOriginal.date = form.date
  formOriginal.title = form.title
  formOriginal.content = form.content

  dialogType.value = type
  dialogVisible.value = true
}

const handleDialogClose = () => {
  submitBtnDisabled.value = true
  formTemp.date = form.date
  formTemp.title = form.title
  formTemp.content = form.content
  if (
    formOriginal.date !== form.date ||
    formOriginal.title !== form.title ||
    formOriginal.content !== form.content
  ) {
    notSaveVisible.value = true
  }

  clearForm()
}

const clearForm = () => {
  form.date = ''
  form.title = ''
  form.content = ''
  form.user = ''
  form.updatedTime = ''

  formOriginal.date = ''
  formOriginal.title = ''
  formOriginal.content = ''
}

defineExpose({ dialogOpen })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog journey-dialog"
      :append-to-body="true"
      :title="$t('customer_detail_info.custom_flag')"
      :destroy-on-close="true"
      @close="handleDialogClose"
    >
      <div class="cdp-dialog__content">
        <el-form :model="form" ref="refForm" label-position="top">
          <el-form-item :label="$t('customer_detail_info.flag_date')" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              :disabled-date="disabledDate"
              :format="$t('date.format_date_rule')"
              :value-format="$t('date.format_date_rule')"
              :disabled="dialogType === 'edit' ? true : false"
              popper-class="cdp-datepicker-single"
              class="cdp-datepicker-single-input full"
              :clearable="false"
              :editable="false"
              @blur="handleBlur"
              @change="handleDateChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :label="$t('customer_detail_info.flag_title')"
            :rules="[
              {
                required: true,
                message: $t('customer_detail_info.blank_flag_title_error_msg'),
                trigger: 'blur'
              },
              {
                max: 8,
                required: true,
                message: $t('customer_detail_info.flag_title_length_limit_error_msg'),
                trigger: 'blur'
              }
            ]"
            prop="title"
          >
            <el-input
              v-model="form.title"
              :placeholder="$t('customer_detail_info.input_flag_title')"
              @blur="handleBlur"
              class="cdp-input"
            />
          </el-form-item>
          <el-form-item
            :label="$t('customer_detail_info.flag_content')"
            :rules="[
              {
                required: true,
                message: $t('customer_detail_info.blank_flag_content_error_msg'),
                trigger: 'blur'
              },
              {
                max: 800,
                required: true,
                message: $t('customer_detail_info.flag_content_length_limit_error_msg'),
                trigger: 'blur'
              }
            ]"
            prop="content"
          >
            <el-input
              v-model="form.content"
              type="textarea"
              :placeholder="$t('customer_detail_info.input_flag_content')"
              @blur="handleBlur"
              class="cdp-textarea"
            />
          </el-form-item>
          <el-row :gutter="15" v-if="dialogType === 'edit'">
            <el-col :span="12">
              <el-form-item :label="$t('customer_detail_info.flag_operator')" prop="user">
                <el-input v-model="form.user" class="cdp-input cdp-input-disabled" readonly>
                  <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('data_name.created_time')" prop="updatedTime">
                <el-input v-model="form.updatedTime" class="cdp-input cdp-input-disabled" readonly>
                  <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="flex justify-end w-full">
          <ButtonIcon
            :name="$t('modal.delete')"
            color="red"
            @click="handleDelete"
            class="mr-5"
            v-if="dialogType === 'edit'"
          />
          <ButtonIcon
            :name="$t('modal.confirm')"
            type="submit"
            color="blue"
            @click="handleCheckSubmit(refForm)"
            :disabled="submitBtnDisabled"
          />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="submitCheckVisible"
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
              {{ $t('customer_detail_info.flag_date') }}：
            </div>
            <div class="inner-dialog__list__text">{{ form.date }}</div>
          </li>
          <li>
            <div class="inner-dialog__list__title">
              {{ $t('customer_detail_info.flag_title') }}：
            </div>
            <div class="inner-dialog__list__text">{{ form.title }}</div>
          </li>
          <li>
            <div class="inner-dialog__list__title">
              {{ $t('customer_detail_info.flag_content') }}：
            </div>
            <div class="inner-dialog__list__text">{{ form.content }}</div>
          </li>
        </ul>
        <div class="inner-dialog__button">
          <ButtonIcon color="gray" :name="$t('modal.modify')" @click="submitCheckVisible = false" />
          <ButtonIcon color="blue" :name="$t('modal.confirm')" @click="handleSubmit" />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="deleteVisible"
      width="300"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      class="cdp-confirm-dialog"
    >
      <div class="inner-dialog">
        <div class="inner-dialog__icon"><img src="@/assets/images/alert-1.png" alt="" /></div>
        <div class="inner-dialog__title cdp-text-red">
          {{ $t('modal.delete') }}
        </div>
        <div class="text-center mb-30">
          {{ $t('modal.are_you_sure_to_delete') }}
          「
          {{ form.date }} {{ $t('customer_detail_info.custom_flag') }}
          」？
        </div>
        <div class="inner-dialog__button">
          <ButtonIcon
            color="gray"
            :bg="false"
            :name="$t('modal.cancel')"
            @click="deleteVisible = false"
          />
          <ButtonIcon
            color="red"
            :name="$t('modal.confirm')"
            @click="handleSubmit('delete'), (notSaveVisible = false)"
          />
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="notSaveVisible"
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
          {{ $t('modal.not_yet_saved') }}
        </div>
        <div class="text-center mb-30">{{ $t('modal.do_you_want_to_save_changes') }}</div>
        <div class="inner-dialog__button">
          <ButtonIcon
            color="gray"
            :name="$t('modal.do_not_save')"
            @click="clearForm(), (notSaveVisible = false)"
          />
          <ButtonIcon
            color="blue"
            :name="$t('modal.save')"
            @click="handleSubmit(), (notSaveVisible = false)"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__content {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #e6eaf2;
  }
}
</style>
<style lang="scss">
.journey-dialog {
  width: 100%;
  max-width: 580px;
}
</style>
