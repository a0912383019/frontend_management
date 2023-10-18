<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { findRootHall, getSessionStorageEntity, checkTagUsage } from '@/utils/commonUtils.js'
import Tag from './Tag.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  modelValue: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 選擇標籤種類、選擇標籤，下拉開啟狀態
const selectDisabled = ref(true)

const isDropdownVisible = ref(false)

// 標籤類型下拉
const selectTypeValue = ref('')
const selectTypeLists = ref([
  {
    label: t('tags.operator'),
    options: [
      {
        value: t('tags.operator_or'),
        label: t('tags.operator_or'),
        disabled: true
      }
    ]
  },
  {
    label: t('tags.type'),
    options: [
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
    ]
  }
])

// 標籤種類下拉
const selectCategoryValue = ref('')
const selectCategoryLists = ref([])
const changeGenerateCategoryLists = () => {
  selectCategoryValue.value = ''
  selectCategoryLists.value = []
  selectDisabled.value = false
  if (selectTypeValue.value && selectTypeValue.value !== t('tags.operator')) {
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
}

// 標籤下拉
const selectTagValue = ref('')
const selectTagLists = ref([])

// 選擇標籤種類 change
const changeGenerateTagLists = () => {
  selectTagLists.value = []
  let tags_config = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]
  Object.entries(tags_config).forEach((item) => {
    if (checkTagUsage(activeHall.hall_code, item[0])) {
      let tempObj = {
        value: item[0],
        label: item[1]['tag_name'],
        hide: true
      }
      if (
        item[1]['tag_type'] == selectTypeValue.value &&
        item[1]['tag_category'] == selectCategoryValue.value
      ) {
        tempObj.hide = false
      }
      selectTagLists.value.push(tempObj)
    }
  })
}

const tagLists = ref([])

// 選擇標籤change
const changeTagLists = (data) => {
  let tags_config = getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]
  tagLists.value = []
  selectTagValue.value.forEach((item) => {
    tagLists.value.push(tags_config[item]['tag_name'])
  })
  let emitData = JSON.parse(JSON.stringify(data)).join(',')
  emit('update:modelValue', emitData)
}

// 刪除tag
const deleteTag = (data) => {
  let idx = tagLists.value.indexOf(data)
  tagLists.value.splice(idx, 1)
  selectTagValue.value.splice(idx, 1)
  let emitData = JSON.parse(JSON.stringify(selectTagValue.value)).join(',')
  emit('update:modelValue', emitData)
}

// ref
const refDropContent = ref(null)

// 亂數產生class name，防止多個組件重複
const tagContentClass = computed(() => {
  return 'drop-class-' + Date.now() + Math.floor(Math.random() * 100000)
})

// 開啟下拉 & 點擊其他區域關閉下拉
const handleDocumentClick = (e) => {
  if (props.disabled === false) {
    if (
      refDropContent.value &&
      e.target.closest(`.${tagContentClass.value}`) &&
      !e.target.classList.contains('tag-input__tag') &&
      !e.target.closest('.el-icon')
    ) {
      isDropdownVisible.value = !isDropdownVisible.value
    } else if (!refDropContent.value.contains(e.target)) {
      isDropdownVisible.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
<template>
  <div class="relative" :class="{ disabled: props.disabled }">
    <div class="tag-input" :class="tagContentClass">
      <div class="tag-input__list">
        <template v-for="(item, index) in tagLists" :key="index">
          <Tag class="tag-input__tag" :title="item">
            <template #icon>
              <el-icon class="cursor-pointer" @click="deleteTag(item)"><Close /></el-icon>
            </template>
          </Tag>
        </template>
      </div>
      <!-- v-if="tagLists.length === 0" -->
      <div class="tag-input__text">{{ $t('tags.filter') }}</div>
      <div class="tag-input__arrow" :class="{ 'tag-input__arrow--active': isDropdownVisible }">
        <el-icon><ArrowDown /></el-icon>
      </div>
    </div>
    <transition>
      <div class="tag-drop" ref="refDropContent" v-show="isDropdownVisible">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-select
              v-model="selectTypeValue"
              class="cdp-select w-full"
              popper-class="cdp-select-popper"
              :teleported="false"
              :placeholder="$t('tags.select_type')"
              @change="changeGenerateCategoryLists"
            >
              <el-option-group
                v-for="group in selectTypeLists"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-option-group>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="selectCategoryValue"
              class="cdp-select w-full"
              popper-class="cdp-select-popper"
              :teleported="false"
              :disabled="selectDisabled"
              :placeholder="$t('tags.select_category')"
              @change="changeGenerateTagLists"
            >
              <el-option
                v-for="item in selectCategoryLists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              v-model="selectTagValue"
              class="cdp-select w-full"
              popper-class="cdp-select-popper"
              :teleported="false"
              filterable
              multiple
              collapse-tags
              :max-collapse-tags="1"
              :disabled="selectDisabled"
              :placeholder="$t('tags.select_tag')"
              @change="changeTagLists"
            >
              <template v-for="item in selectTagLists" :key="item.value">
                <el-option :label="item.label" :value="item.value" v-if="item.hide === false" />
              </template>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.tag-input {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 12px;
  padding-right: 40px;
  min-height: 38px;
  border: solid 1px #cfd8e6;
  border-radius: 5px;
  color: #a8abb2;
  overflow: hidden;
  &__arrow {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 100%;
    cursor: pointer;
    transition: all 0.5s;
    &--active {
      transform: rotate(-180deg);
    }
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__text {
    flex-grow: 1;
  }
  &__tag {
    margin-right: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.tag-drop {
  position: absolute;
  left: 0;
  top: calc(100% + 3px);
  z-index: 10;
  width: 100%;
  padding: 12px;
  background-color: #fff;
  border: solid 1px #cfd8e6;
  border-radius: 5px;
}

.disabled {
  cursor: no-drop;
  background-color: var(--el-disabled-bg-color);
  .tag-input {
    &__list,
    &__arrow {
      pointer-events: none;
    }
  }
}
</style>
