<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { findRootHall, getSessionStorageEntity, checkTagUsage } from '@/utils/commonUtils.js'
import SelectTagDropdown from '@/components/Filter/SelectTagDropdown.vue'
import { dayjs } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  modelValue: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

// 創建不重複的class name
const dropClass = ref('dropClass' + dayjs() + Math.floor(Math.random() * 10))

// 已選標籤列表
const currentTagAry = ref([])
// 標籤選取文字
const tagTextAry = ref([])
// 篩選標籤input欄位
const tagInputText = ref('')
const tagInputTextOld = ref('')
const refTagInput = ref()
// 發送api需要的key
const apiRequestKey = ref('')

// 標籤類型下拉
const selectTypeValue = ref()
const selectTypeLists = ref([
  {
    value: 1,
    label: t('tags.type_1')
  },
  {
    value: 3,
    label: t('tags.type_3')
  },
  {
    value: 4,
    label: t('tags.type_4')
  },
  {
    value: 5,
    label: t('tags.type_5')
  }
])
const originalSelectTypeLists = ref(selectTypeLists.value.slice(0))

// 標籤種類下拉
const selectCategoryValue = ref()
const selectCategoryLists = ref([])
const originalSelectCategoryLists = ref([])
const changeGenerateCategoryLists = () => {
  selectCategoryValue.value = ''
  selectCategoryLists.value = []
  originalSelectCategoryLists.value = []
  if (selectTypeValue.value) {
    selectCategoryLists.value.push({
      value: 1,
      label: t('tags.category_1')
    })
    if (selectTypeValue.value === 3) {
      for (let i = 2; i <= 9; i++) {
        // 若為XBB廳別才加入category = 8標籤
        if (i === 8 && findRootHall(activeHall.hall_code) !== 'XBB') {
          continue
        }
        selectCategoryLists.value.push({
          value: i,
          label: t(`tags.category_${i}`)
        })
      }
    }
  }
  originalSelectCategoryLists.value = selectCategoryLists.value.slice(0)
}
// 標籤下拉
const selectTagLists = ref([])
const originalSelectTagLists = ref([])
const tagsConfig = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]
const tagsConfigTransformData = reactive({})
// 轉換資料，優化tagsConfig
const transformTagsConfig = () => {
  try {
    Object.entries(tagsConfig).forEach((item) => {
      if (!tagsConfigTransformData[item[1]['tag_category']]) {
        tagsConfigTransformData[item[1]['tag_category']] = {}
      }
  
      if (!tagsConfigTransformData[item[1]['tag_category']][item[1]['tag_type']]) {
        tagsConfigTransformData[item[1]['tag_category']][item[1]['tag_type']] = []
      }
      if (checkTagUsage(activeHall.hall_code, item[0])) {
        let tempObj = {
          ...item[1],
          value: item[0],
          label: item[1]['tag_name']
        }
        tagsConfigTransformData[item[1]['tag_category']][item[1]['tag_type']].push(tempObj)
      }
    })
  } catch (err) {
    console.log(err)
    router.push({ path: '/home' })
  }
}
const changeGenerateTagLists = () => {
  selectTagLists.value = []
  if (selectCategoryValue.value != '') {
    selectTagLists.value =
      tagsConfigTransformData[selectCategoryValue.value][selectTypeValue.value].slice(0)
    originalSelectTagLists.value = selectTagLists.value.slice(0)
  }
}

// 下拉選單開啟狀態
const isDropShow = ref(false)

// input focus事件
const handleInputFocus = () => {
  isDropShow.value = true
}

const clearTagInputValue = () => {
  tagInputText.value = ''
}

const handleInputKeyup = (e) => {
  if (e.keyCode === 8) {
    if (tagTextAry.value.length > 0 && tagInputTextOld.value === '') {
      let lastIndex = tagTextAry.value.length - 1
      let selector = tagTextAry.value[lastIndex]['active']
      if (selector) {
        tagTextAry.value.splice(lastIndex, 1)
      } else {
        tagTextAry.value[lastIndex]['active'] = true
      }
    } else if (
      currentTagAry.value.length > 0 &&
      tagTextAry.value.length === 0 &&
      tagInputTextOld.value === ''
    ) {
      let lastIndex = currentTagAry.value.length - 1
      let selector = currentTagAry.value[lastIndex]['active']
      if (selector) {
        currentTagAry.value.splice(lastIndex, 1)
      } else {
        currentTagAry.value[lastIndex]['active'] = true
      }
    }
    tagInputTextOld.value = ''
  }
}

// 新增標籤類型＆種類文字
const handleTagAddText = (data) => {
  // 自動選取input框
  refTagInput.value.focus()
  if (data.value === 'OR') {
    // 如果是OR，將OR傳入標籤列表
    currentTagAry.value.push({ value: 'OR', label: 'OR', active: false })
  } else {
    // 將目前選取的標籤文字傳入文字列表
    tagTextAry.value.push(data)
  }
  tagInputText.value = ''

  // 移除刪除狀態
  if (currentTagAry.value.length > 0) {
    currentTagAry.value[currentTagAry.value.length - 1]['active'] = false
  }
  if (tagTextAry.value.length > 0) {
    tagTextAry.value.forEach((item, index) => {
      tagTextAry.value[index]['active'] = false
    })
  }
}

// 是否顯示運算子
const isOperatorShow = computed(() => {
  if (currentTagAry.value.length > 0) {
    if (currentTagAry.value[currentTagAry.value.length - 1]['value'] !== 'OR') {
      return true
    }
    return false
  } else {
    return false
  }
})

// 點擊tag，刪除tag
const handleTagDelete = ({ index }) => {
  currentTagAry.value.splice(index, 1)
  // 如果刪除後的陣列，第1筆是OR，要將OR刪除，不可單除存在
  if (currentTagAry.value.length > 0) {
    if (currentTagAry.value[0]['value'] === 'OR') {
      currentTagAry.value.splice(0, 1)
    }
  }
}

// 點擊空白區域關閉dropdown
const handleDocumentClick = (e) => {
  clearTagInputValue()
  if (e.target.closest(`.${dropClass.value}`)) {
    isDropShow.value = true
  } else {
    isDropShow.value = false
  }
}

// search
const handleSearch = (selector, originalSelector) => {
  if (tagInputText.value !== '') {
    let searchData = originalSelector.value.slice(0)
    let filteredItems = searchData.filter((item) => {
      return item.label.indexOf(tagInputText.value) !== -1
    })
    selector.value = filteredItems
  } else {
    selector.value = originalSelector.value.slice(0)
  }
}

onMounted(() => {
  // 轉換tag_config
  transformTagsConfig()
  // 註冊點擊
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  // 移除點擊
  document.removeEventListener('click', handleDocumentClick)
})

watch(
  () => tagTextAry.value,
  () => {
    // 重置標籤類型資料
    selectTypeLists.value = originalSelectTypeLists.value.slice(0)

    if (tagTextAry.value.length === 1) {
      changeGenerateCategoryLists()
    }
    if (tagTextAry.value.length === 3) {
      // 選擇到標籤後，將選取的標籤，傳入標籤列表陣列
      currentTagAry.value.push(tagTextAry.value[2])
      tagTextAry.value = []
    }
  },
  { deep: true }
)

watch(
  () => currentTagAry.value,
  () => {
    apiRequestKey.value = ''
    currentTagAry.value.forEach((item, index) => {
      if (index === 0) {
        apiRequestKey.value += item.value
      }
      if (index > 0 && item.value !== 'OR') {
        if (currentTagAry.value[index - 1]['value'] === 'OR') {
          apiRequestKey.value += `${item.value}`
        } else {
          apiRequestKey.value += `,${item.value}`
        }
      }
      if (item.value === 'OR') {
        apiRequestKey.value += ';'
      }
    })
    emit('update:modelValue', apiRequestKey.value)
  },
  { deep: true }
)

// 標籤種類觸發
watch(
  () => selectCategoryValue.value,
  () => {
    changeGenerateTagLists()
  },
  { deep: true }
)

watch(
  () => tagInputText.value,
  (newVal, oldVal) => {
    tagInputTextOld.value = oldVal
    switch (tagTextAry.value.length) {
      case 0:
        handleSearch(selectTypeLists, originalSelectTypeLists)
        break
      case 1:
        handleSearch(selectCategoryLists, originalSelectCategoryLists)
        break
      case 2:
        handleSearch(selectTagLists, originalSelectTagLists)
        break
    }
  }
)
</script>
<template>
  <div class="select-tag">
    <div class="select-tag__box">
      <div
        class="select-tag__box__tag"
        v-for="(item, index) in currentTagAry"
        :key="index"
        @click="handleTagDelete({ item, index })"
      >
        <div class="select-tag__box__tag__item" :class="{ isActive: item.active }">
          {{ item.label }}
          <div class="select-tag__box__tag__close"></div>
        </div>
      </div>
      <div class="select-tag__box__text" v-for="(item, index) in tagTextAry" :key="index">
        <div class="select-tag__box__text__item" :class="{ isActive: item.active }">
          {{ item.label }} :
        </div>
      </div>
    </div>
    <div class="select-tag__inputbox">
      <input
        type="text"
        v-model="tagInputText"
        class="select-tag__input"
        :class="dropClass"
        :placeholder="$t('tags.filter')"
        ref="refTagInput"
        @focus="handleInputFocus"
        @keyup="handleInputKeyup"
      />
      <SelectTagDropdown
        v-model="selectTypeValue"
        :class="dropClass"
        :lists="selectTypeLists"
        :tagTitle="$t('tags.type')"
        :operator="isOperatorShow"
        v-show="tagTextAry && tagTextAry.length === 0 && isDropShow === true"
        @update:tagtext="handleTagAddText"
      />
      <SelectTagDropdown
        v-model="selectCategoryValue"
        :class="dropClass"
        :lists="selectCategoryLists"
        :tagTitle="$t('tags.category')"
        :operator="false"
        v-show="tagTextAry && tagTextAry.length === 1 && isDropShow === true"
        @update:tagtext="handleTagAddText"
      />
      <SelectTagDropdown
        :lists="selectTagLists"
        :class="dropClass"
        :tagTitle="$t('tags.select_tag')"
        :operator="false"
        v-show="tagTextAry && tagTextAry.length === 2 && isDropShow === true"
        @update:tagtext="handleTagAddText"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.select-tag {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc5e1;
  &__input {
    padding-left: 10px;
  }
  border-radius: 5px;
  &__input:hover {
    box-shadow: 0 0 0 1px $purple !important;
  }
  &__box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &__tag {
      display: inline-flex;
      align-items: center;
      padding-left: 10px;
      &__item {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 20px;
        margin-top: 5px;
        margin-bottom: 5px;
        background-color: $purple;
        color: #fff;
        line-height: 1;
        cursor: pointer;
        &.isActive {
          background-color: $red-dark;
        }
      }
      &__close {
        position: relative;
        width: 10px;
        height: 10px;
        margin-left: 7px;
        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -0.5px;
          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.7);
        }
        &::before {
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }
    }
    &__text {
      display: flex;
      padding-left: 10px;
      &__item {
        &.isActive {
          color: $red-dark;
        }
      }
    }
  }
  &__inputbox {
    position: relative;
    flex: 1;
  }
  &__input {
    width: 100%;
    min-width: 130px;
    height: 38px;
    border: none;
    border-radius: 5px;
    &::placeholder {
      color: rgba($purple, 0.4);
      opacity: 1;
    }
  }
}
</style>
