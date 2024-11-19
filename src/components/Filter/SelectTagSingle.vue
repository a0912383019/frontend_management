<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVipCommercialAnalysisStore } from '@/stores'
import SelectTagDropdown from '@/components/Filter/SelectTagDropdown.vue'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String
  },
  lists: {
    type: Array
  },
  defaultAll: {
    type: String
  },
  showAllOption: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String
  },
  defaultValue: {
    type: Array,
    default: () => []
  },
  color: {
    type: String,
    default: 'purple'
  }
})

const placeholderText = computed(() => props.placeholder || t('tags.filter'))

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag } = vipStore

const emit = defineEmits(['update:modelValue'])

/*
  原本作法為 props.defaultAll 給預設值 useVipCommercialAnalysisStore().defaultVipTag
  但單元測試會有 pinia 問題，目前不知道怎麼解決
  所以改成 defaultAll 為 undefined 時，賦值 defaultVipTag
*/
const defaultAll = props.defaultAll === undefined ? defaultVipTag : props.defaultAll

// 創建不重複的class name
const dropClass = ref('dropClass' + dayjs() + Math.floor(Math.random() * 10))

// 已選標籤列表
const currentTagAry = ref(
  props.showAllOption
    ? [{ value: 'all', label: t('vip_commercial_analysis.all'), disabled: false, active: false }]
    : props.defaultValue
)

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
const selectTypeLists = ref(props.lists)
const originalSelectTypeLists = ref(selectTypeLists.value.slice(0))

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

// 確認選取的項目，在列表中是否有相同選項
const checkAddText = (data) => {
  const resultIndex = currentTagAry.value.findIndex((item) => item.value === data.value)
  if (resultIndex !== -1) {
    // 如果找到了，返回 index
    return resultIndex
  }

  // 如果未找到，返回 false
  return false
}

// 新增標籤類型＆種類文字
const handleTagAddText = (data) => {
  const currentTagAryIndex = checkAddText(data)

  // 如果目前已選取相同選項，則移除該選項
  if (currentTagAryIndex !== -1 && currentTagAryIndex !== false) {
    handleTagDelete({ index: currentTagAryIndex })
  }

  // 如果目前沒有選取選項，則新增該選項
  if (currentTagAryIndex === false) {
    // 點擊全部，需把剩下選項disabled
    if (data.value === 'all') {
      selectTypeLists.value.forEach((item) => {
        if (item.value !== 'all') {
          item.disabled = true
        }
      })
      currentTagAry.value = []
      currentTagAry.value.push(data)
    } else {
      currentTagAry.value.push(data)
    }
  }
}

// 點擊tag，刪除tag
const handleTagDelete = ({ index }) => {
  currentTagAry.value.splice(index, 1)
  selectTypeLists.value.forEach((item) => {
    item.disabled = false
  })
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

// 設置發送 api 需要的 key
const handleSetApiRequestKey = () => {
  apiRequestKey.value = ''
  currentTagAry.value.forEach((item, index) => {
    if (item.value === 'all') {
      apiRequestKey.value = defaultAll
      return
    }
    if (item.value !== 'all') {
      if (index === 0) {
        apiRequestKey.value += `${item.value}`
      } else {
        apiRequestKey.value += `,${item.value}`
      }
    }
  })
}

onMounted(() => {
  // 註冊點擊
  document.addEventListener('click', handleDocumentClick)

  // 初始化設置 api key 參數
  handleSetApiRequestKey()
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
  },
  { deep: true }
)

watch(
  () => currentTagAry.value,
  () => {
    handleSetApiRequestKey()
    emit('update:modelValue', apiRequestKey.value)
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
    }
  }
)
</script>
<template>
  <div class="select-tag-single" :class="`select-tag-single__${props.color}`">
    <div class="select-tag__box">
      <div
        class="select-tag-single__box__tag"
        v-for="(item, index) in currentTagAry"
        :key="index"
        @click="handleTagDelete({ item, index })"
      >
        <div
          class="select-tag-single__box__tag__item"
          :class="{
            isActive: item.active,
            [`select-tag-single__box__tag__item__${props.color}`]: true
          }"
        >
          {{ item.label }}
          <div class="select-tag-single__box__tag__close"></div>
        </div>
      </div>
      <div class="select-tag-single__box__text" v-for="(item, index) in tagTextAry" :key="index">
        <div class="select-tag-single__box__text__item" :class="{ isActive: item.active }">
          {{ item.label }} :
        </div>
      </div>
    </div>
    <div class="select-tag-single__inputbox">
      <input
        type="text"
        v-model="tagInputText"
        class="select-tag-single__input"
        :class="[dropClass, `select-tag-single__input__${props.color}`]"
        :placeholder="currentTagAry.length === 0 ? placeholderText : null"
        ref="refTagInput"
        @focus="handleInputFocus"
        @keyup="handleInputKeyup"
      />
      <SelectTagDropdown
        v-model="selectTypeValue"
        :class="dropClass"
        :lists="selectTypeLists"
        :color="props.color"
        :operator="false"
        v-show="tagTextAry && tagTextAry.length === 0 && isDropShow === true"
        @update:tagtext="handleTagAddText"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
