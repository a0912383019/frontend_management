<script setup>
import { ref } from 'vue'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
const emit = defineEmits(['update:files'])

const manageAnalysisStore = useManageAnalysisStore()

//input file ref
const refInputFile = ref(null)
//檔名
const fileName = ref('')
//檔案
const fileData = ref(null)

//判斷檔案副檔名
const submitType = ref(true)
const checkFile = (data) => {
  let name = data.split('.').pop()
  if (!/^(csv)$/.test(name)) {
    //如果不是csv，submitType改為false
    submitType.value = false
  } else {
    submitType.value = true
  }
}
//使用手動匯入名單
const handleFileChange = (element) => {
  if (element.target.files[0] !== undefined) {
    fileData.value = element.target.files[0]
    fileName.value = element.target.files[0]['name']
    checkFile(fileName.value)
  } else {
    dialogClose()
  }
}

//dialog close
const dialogClose = () => {
  //dialod 關閉 清空檔案
  fileName.value = ''
  fileData.value = ''
  //清空 input file value
  refInputFile.value.value = ''
}

const handleSubmit = () => {
  if (submitType.value) {
    emit('update:files', fileData.value)
    manageAnalysisStore.useCustomList = true
  }
}

defineExpose({ dialogClose })
</script>
<template>
  <div class="upload" :class="{ error: !submitType }">
    <div class="upload__icon"><img src="@/assets/images/upload.svg" alt="" /></div>
    <label class="upload__btn" for="uploadFile" v-if="fileName === ''">
      {{ $t('import_export_file.select_import_file') }}
    </label>
    <div class="upload__box" v-else>
      <label class="upload__filename" for="uploadFile">
        <span>{{ fileName }}</span>
      </label>
      <button class="upload__submit" @click="handleSubmit">+</button>
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
  }
  &__box {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
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
  }
  &.error {
    .upload {
      &__text {
        color: $red;
      }
      &__filename {
        border-color: $red;
      }
    }
  }
}
</style>
