<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Papa from 'papaparse'

const { t } = useI18n()

const emit = defineEmits(['update:files'])

// input file ref
const refInputFile = ref(null)
// 檔名
const fileName = ref('')
// 檔案
const fileData = ref(null)

const errorAccountText = ref('')
const errorDateText = ref('')
const errorEnableText = ref('')

// 判斷檔案副檔名
const isCSVFile = ref(true)

// 不合規定的帳號陣列
const notOkAccountData = ref([])

// 帳號是否符合規定
const isParseFile = ref(true)

// submit
const isSubmit = ref(false)

// 檢查副檔名是否為CSV
const checkCSVFile = (data) => {
  let name = data.split('.').pop()
  if (!/^(csv)$/.test(name)) {
    //如果不是csv，isCSVFile改為false
    isCSVFile.value = false
  } else {
    isCSVFile.value = true
  }
}

// 處理選擇好的檔案
const handleFileChange = (element) => {
  const file = element.target.files[0]
  notOkAccountData.value = []
  errorAccountText.value = ''
  errorDateText.value = ''
  errorEnableText.value = ''

  if (file !== undefined) {
    fileData.value = file
    fileName.value = file['name']
    parseFile(file)
  } else {
    dialogClose()
  }

  refInputFile.value.value = ''
}

// 檢查 CSV內的 帳號是否符合規定
const parseFile = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      checkCSVFile(fileName.value)
      if (
        results.meta.fields[0] === 'user_name' &&
        results.meta.fields[1] === 'data_date' &&
        results.meta.fields[2] === 'enable'
      ) {
        checkFileDetail(results.data)
      } else {
        isParseFile.value = false
        errorAccountText.value = t(
          'import_export_file.header_needs_to_be_user_name_data_date_enable'
        )
      }

      if (isParseFile.value && isCSVFile.value) {
        isSubmit.value = true
      } else {
        isSubmit.value = false
      }
    }.bind()
  })
}

// 檢查帳號
const checkFileDetail = (data) => {
  let isDateOk = true
  let isEnableOk = true
  let isAccountOk = true
  data.forEach((item, index) => {
    let isRegexDateOk = regexDate(item['data_date'])
    let isRegexEnableOk = regexEnable(item['enable'])
    let isRegexAccountOk = regexAccount(item['user_name'])

    if (isRegexDateOk === false) {
      isDateOk = false
    }
    if (isRegexEnableOk === false) {
      isEnableOk = false
    }
    if (isRegexAccountOk === false) {
      let tempObj = {
        no: index + 2,
        name: item['user_name'],
        note: ''
      }
      isAccountOk = false

      tempObj['note'] = t('import_export_file.user_account_illegal')
      if (regexSpace(item['user_name'])) {
        // 檢查帳號是否有包含空白
        tempObj['note'] = t('import_export_file.user_name_contains_spaces')
      }
      notOkAccountData.value.push(tempObj)
    }
  })

  if (isDateOk === false) errorDateText.value = t('import_export_file.validator_date')
  if (isEnableOk === false) errorEnableText.value = t('import_export_file.validator_enable')
  if (isAccountOk === false) errorAccountText.value = t('import_export_file.user_name_is_invalid')
  isParseFile.value = isDateOk && isEnableOk && isAccountOk
}

// 檢查帳號的正規表達式
const regexAccount = (val) => {
  // 合法帳號為小寫英文字母＋數字
  const validate = /^[a-z0-9]*$/
  return validate.test(val)
}

// 檢查帳號是否有包含空白
const regexSpace = (val) => {
  const validate = /\s/
  return validate.test(val)
}

// 檢查日期的正規表達式
const regexDate = (val) => {
  const validate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  return validate.test(val)
}

// 檢查Enable的正規表達式
const regexEnable = (val) => {
  const validate = /^[01]$/
  return validate.test(val)
}

// dialog close
const dialogClose = () => {
  //dialod 關閉 清空檔案
  fileName.value = ''
  fileData.value = null
  notOkAccountData.value = []
  errorAccountText.value = ''
  errorDateText.value = ''
  errorEnableText.value = ''
  isCSVFile.value = true
  //清空 input file value
  refInputFile.value.value = ''
}

// 送出
const handleSubmit = () => {
  if (isCSVFile.value) {
    emit('update:files', fileData.value)
  }
}

defineExpose({ dialogClose })
</script>
<template>
  <div class="upload" :class="{ error: !isCSVFile }">
    <div class="upload__icon"><img src="@/assets/images/upload.svg" alt="" /></div>
    <label class="upload__btn" for="uploadFile" v-if="fileName === ''">
      {{ $t('import_export_file.select_import_file') }}
    </label>
    <div class="upload__box" v-else>
      <label class="upload__filename" for="uploadFile">
        <span>{{ fileName }}</span>
      </label>
      <button class="upload__submit" :disabled="!isSubmit" @click="handleSubmit">+</button>
    </div>
    <input
      type="file"
      ref="refInputFile"
      id="uploadFile"
      class="upload__input"
      v-on:change="handleFileChange"
      accept=".csv"
    />
    <div class="upload__text">{{ $t('import_export_file.only_csv_file') }}</div>
    <div class="upload__error-text" v-if="errorDateText">
      {{ errorDateText }}
    </div>
    <div class="upload__error-text" v-if="errorEnableText">
      {{ errorEnableText }}
    </div>
    <div class="upload__error-text" v-if="errorAccountText">
      {{ errorAccountText }}
    </div>
    <el-table :data="notOkAccountData" style="width: 100%" v-if="notOkAccountData.length > 0">
      <el-table-column prop="no" :label="$t('data_name.item_number')" width="80" align="center" />
      <el-table-column prop="name" :label="$t('data_name.member_name')">
        <template #default="scope">
          {{ scope.row.name }} <span class="cdp-text-red-dark">{{ scope.row.note }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__icon {
    width: 60px;
    margin-bottom: 11px;
    img {
      display: block;
      width: 100%;
      height: 47px;
    }
  }
  &__btn {
    position: relative;
    width: 160px;
    height: 34px;
    box-sizing: border-box;
    padding: 6px 24px 8px;
    border-radius: 5px;
    background-color: $blue;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #fff;
    margin-bottom: 12px;
    &:hover {
      background-color: #3a6db5;
    }
  }
  &__input {
    display: none;
  }
  &__text {
    color: $blue;
    font-size: 13px;
    margin-bottom: 10px;
  }
  &__box {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-left: 44px;
  }
  &__filename {
    display: inline-flex;
    align-items: center;
    width: 160px;
    height: 34px;
    padding: 5px;
    border: 1px solid $blue;
    border-radius: 10px;
    color: #404040;
    span {
      display: inline-block;
      @include ellipsis;
    }
  }
  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    font-size: 17px;
    font-weight: 400;
    margin-left: 10px;
    border-radius: 5px;
    background-color: #4f84cf;
    color: #fff;
    border: none;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
      background-color: #ccc;
    }
  }
  &__error-text {
    margin-bottom: 10px;
    color: $red-dark;
  }
  &.error {
    .upload {
      &__text {
        color: $red-dark;
      }
      &__filename {
        border-color: $red-dark;
      }
    }
  }
}
</style>
