<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { getSessionStorageEntity, generateTagBySortIndex } from '@/utils/commonUtils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import Tab from '@/components/Tab.vue'
import Search from '@/components/Search.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { systemConfigIsOk } = storeToRefs(globalStore)
const { activeHall } = globalStore

const dialogTableVisible = ref(false) // dialog開啟狀態

const tableColumns = computed(() => {
  return [
    {
      label: t('tags.tag_name'),
      prop: 'tag_name',
      width: 250,
      align: 'center'
    },
    {
      label: t('tags.tag_description'),
      prop: 'tag_description',
      align: 'center'
    }
  ]
})

const currentTabs = ref('all') // 當前顯示的tabs

const refTable = ref(null) // ref table

const key = ref(systemConfigIsOk.value)

// tab 資料
const tabData = computed(() => {
  return [
    {
      label: t('tags.all_tags'),
      name: 'all'
    },
    {
      label: t('tags.type_6'),
      name: 'type6'
    },
    {
      label: t('tags.type_3'),
      name: 'type3'
    },
    {
      label: t('tags.type_4'),
      name: 'type4'
    },
    {
      label: t('tags.type_5'),
      name: 'type5'
    },
    {
      label: t('tags.type_8'),
      name: 'type8'
    },
    {
      label: t('tags.type_1'),
      name: 'type1'
    },
    {
      label: t('tags.type_9'),
      name: 'type9'
    }
  ]
})

let tagsConfig = reactive({})
const tagsData = reactive({
  all: [],
  type1: [],
  type3: [],
  type4: [],
  type5: [],
  type6: [],
  type8: [],
  type9: []
})
let tagsDataOriginal = reactive({})

// 取得sessiontStorage tags_config資料
const getTagsConfig = () => {
  return getSessionStorageEntity('system_config').tags_config
}

// 轉換 tags_config 格式
const transformTagsConfig = () => {
  Object.keys(tagsData).forEach((item) => {
    tagsData[item] = []
  })

  if (tagsConfig !== undefined && tagsConfig) {
    let tagSortDict = generateTagBySortIndex()

    Object.entries(tagSortDict).forEach((item) => {
      let value = item[1]
      if (value.tag_type === 1) {
        tagsData['type1'].push(value)
      } else if (value.tag_type === 3) {
        tagsData['type3'].push(value)
      } else if (value.tag_type === 4) {
        tagsData['type4'].push(value)
      } else if (value.tag_type === 5) {
        tagsData['type5'].push(value)
      } else if (value.tag_type === 6) {
        tagsData['type6'].push(value)
      } else if (value.tag_type === 8) {
        tagsData['type8'].push(value)
      } else if (value.tag_type === 9) {
        tagsData['type9'].push(value)
      }
    })
  }

  // 加入tag_type = 3的tag_category說明(2~7)
  let root_hall = "BBIN"
  let type3_data = []
  for (let i = 2; i <= 9; i++) {
    // tag_category 3 時段標籤下架，下拉選單不顯示時段
    // tag_category 8 (XBB廳專用，已無此廳)
    switch (i) {
      case 2:
      case 4:
      case 5:
      case 6:
      case 9:
        type3_data.push({
          tag_name: t(`tags.category_${i}`),
          tag_description: t(`tags.category_desc_${i}`)
        })
        break
      case 7:
        type3_data.push({
          tag_name: t(`tags.category_${i}`),
          tag_description: t(`tags.category_desc_${i}_${root_hall}`)
        })
        break
    }
  }
  // 將資料合併到all和type3內
  tagsData['type3'] = tagsData['type3'].concat(type3_data)
  tagsData['all'] = tagsData['all']
    .concat(tagsData['type6'])
    .concat(tagsData['type3'])
    .concat(tagsData['type4'])
    .concat(tagsData['type5'])
    .concat(tagsData['type8'])
    .concat(tagsData['type1'])
    .concat(tagsData['type9'])

  // 將目前資料複製一份到tagsDataOriginal
  tagsDataOriginal = {}
  tagsDataOriginal = JSON.parse(JSON.stringify(tagsData))
  handleSearch()
}

const tableData = computed(() => {
  return tagsData[currentTabs.value]
})

const filtered = ref(false)
const tableDataLength = ref(0)
// search
const searchText = ref('')
const handleSearch = () => {
  let handleSearchText = searchText.value.toLowerCase()
  if (handleSearchText !== '') {
    let result = tagsDataOriginal[currentTabs.value].filter((value) => {
      return (
        value['tag_name'].toLowerCase().indexOf(handleSearchText) !== -1 ||
        value['tag_description'].toLowerCase().indexOf(handleSearchText) !== -1
      )
    })
    tagsData[currentTabs.value] = result
    filtered.value = true
  } else {
    tagsData[currentTabs.value] = JSON.parse(JSON.stringify(tagsDataOriginal[currentTabs.value]))
    filtered.value = false
  }
  tableDataLength.value = tagsDataOriginal[currentTabs.value].length
}

// 開啟 dialog
const handleOpenDialog = () => {
  dialogTableVisible.value = true
}

// dialog close callback
const handleCloseDialog = () => {
  searchText.value = ''
}

onMounted(() => {
  tagsConfig = getTagsConfig()
  transformTagsConfig()
})

watch(
  () => systemConfigIsOk.value,
  () => {
    if (systemConfigIsOk.value !== 0) {
      tagsConfig = getTagsConfig()
      transformTagsConfig()
      key.value = systemConfigIsOk.value
    }
  }
)

watch(
  () => activeHall.hall_code,
  (newVal, oldVal) => {
    if (oldVal !== '' && sessionStorage.system_config !== undefined) {
      tagsConfig = getTagsConfig()
      transformTagsConfig()
    }
  }
)

watch(
  () => currentTabs.value,
  (newVal, oldVal) => {
    // 切換頁籤時，如果有搜尋關鍵字，將關鍵字清除，並復原切換前頁籤的內容
    if (searchText.value !== '') {
      searchText.value = ''
      tagsData[oldVal] = JSON.parse(JSON.stringify(tagsDataOriginal[oldVal]))
    }
    // 切換頁籤時，將表格的頁碼初始化到第一頁
    refTable.value.goToFirstPage()
  }
)

watch(
  () => searchText.value,
  () => {
    handleSearch()
  }
)
</script>
<template>
  <div class="flex">
    <div class="tag-btn" @click.prevent="handleOpenDialog">
      <div class="tag-btn__icon">
        <font-awesome-icon icon="fa-solid fa-book" />
      </div>
      {{ $t('tags.tag_description') }}
    </div>
    <div class="lineUger"></div>
    <el-dialog
      v-model="dialogTableVisible"
      class="cdp-dialog"
      top="50px"
      :append-to-body="true"
      width="1000"
      :title="$t('tags.tag_description')"
      @close="handleCloseDialog"
    >
      <Tab
        :tabData="tabData"
        :activeName="currentTabs"
        v-model="currentTabs"
        class="cdp-dialog__tab"
        :class="{ en: i18nLocale === 'en' }"
      ></Tab>
      <div class="cdp-dialog__content">
        <div class="cdp-dialog__tablebox">
          <div class="cdp-dialog__search">
            <Search v-model="searchText"></Search>
          </div>
          <CustomTable
            :stripe="true"
            :tableData="tableData"
            :tableColumns="tableColumns"
            :filtered="filtered"
            :filterFrom="tableDataLength"
            class="cdp-tag-table"
            ref="refTable"
          >
          </CustomTable>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tag-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 13px 8px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;
  cursor: pointer;
  &__icon {
    margin-right: 5px;
    font-size: 12px;
  }
}
.cdp-dialog {
  &__tab {
    margin-bottom: 15px;
    &.en {
      :deep(.tabs__item) {
        font-size: 14px;
      }
    }
  }
  &__content {
    border-radius: 5px;
    border: solid 1px #e6eaf2;
    background-color: #fff;
    padding: 20px;
  }
  &__tablebox {
    padding: 20px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.14);
    border-radius: 5px;
  }
  &__search {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
}
</style>
<style lang="scss">
.lineUger {
  width: 3px;
  height: 15px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 50%, transparent 0),
    linear-gradient(to right, rgba(255, 255, 255, 0.12) 100%, transparent 0);
  margin-top: 10px;
  margin-left: 15px;
  margin-right: 15px;
}
.cdp-tag-table {
  .el-table {
    td:first-child,
    th:first-child {
      padding-left: 50px;
      border-radius: 5px 0 0 5px;
      text-align: left;
    }
    td:last-child,
    th:last-child {
      padding-left: 50px;
      border-radius: 0 5px 5px 0;
      text-align: left;
    }
    th.el-table__cell.is-leaf {
      background-color: #e9eef6;
    }
    .el-table__cell {
      border: none;
    }
    td.el-table__cell {
      height: 54px;
    }
  }
}
</style>
