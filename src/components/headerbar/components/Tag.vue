<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { findRootHall, getSessionStorageEntity } from '@/utils/commonUtils'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import Tab from '@/components/Tab.vue'
import Search from '@/components/Search.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const dialogTableVisible = ref(false) //dialog開啟狀態

const props = defineProps({
  times: {
    type: Number
  }
})

const tableColumns = [
  {
    label: t('tags.tag_name'),
    prop: 'tag_name',
    width: 200,
    align: 'center'
  },
  {
    label: t('tags.tag_description'),
    prop: 'tag_description',
    align: 'center'
  }
]

const currentTabs = ref('all') //當前顯示的tabs

// tab 資料
const tabData = ref([
  {
    label: t('tags.all_tags'),
    name: 'all'
  },
  {
    label: t('tags.type_1'),
    name: 'type1'
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
  }
])

let tagsConfig = reactive({})
const tagsData = reactive({
  all: [],
  type1: [],
  type3: [],
  type4: [],
  type5: []
})
let tagsDataOriginal = reactive({})
//清空tagsData的value資料
// const clearTagsData = () => {
//   Object.keys(tagsData).forEach((item) => {
//     tagsData[item] = []
//   })
// }

//取得sessiontStorage tags_config資料
const getTagsConfig = () => {
  return getSessionStorageEntity('system_config').tags_config
}

//轉換 tags_config 格式
const transformTagsConfig = () => {
  // clearTagsData()
  Object.keys(tagsData).forEach((item) => {
    tagsData[item] = []
  })

  let tagsConfigData = tagsConfig[globalStore.activeHall.hall_code]
  // console.log(tagsConfigData)

  Object.entries(tagsConfigData).forEach((key) => {
    let value = key[1]
    if (value.tag_enabled && value.tag_category === 1) {
      // 僅列出啟用及tag_category = 1(一般標籤)的標籤
      tagsData['all'].push(value)
      if (value.tag_type === 1) {
        tagsData['type1'].push(value)
      } else if (value.tag_type === 3) {
        tagsData['type3'].push(value)
      } else if (value.tag_type === 4) {
        tagsData['type4'].push(value)
      } else if (value.tag_type === 5) {
        tagsData['type5'].push(value)
      }
    }
  })

  // 加入tag_type = 3的tag_category說明(2~7)
  let root_hall = findRootHall(globalStore.activeHall.hall_code)
  let type3_data = []
  for (let i = 2; i <= 9; i++) {
    switch (i) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
        // 若選則XBB廳別，加上tag_category = 8(優惠)標籤種類說明
        if (i === 8 && root_hall !== 'XBB') {
          break
        }
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
  //將資料合併到all和type3內
  let type3Ary = tagsData['type3'].concat(type3_data)
  tagsData['type3'] = []
  tagsData['type3'] = type3Ary
  let allAry = tagsData['all'].concat(type3_data)
  tagsData['all'] = []
  tagsData['all'] = allAry

  //將目前資料複製一份到tagsDataOriginal
  tagsDataOriginal = {}
  tagsDataOriginal = JSON.parse(JSON.stringify(tagsData))
  handleSearch()
}

const tableData = computed(() => {
  return tagsData[currentTabs.value]
})

//開啟 dialog
const handleOpenDialog = () => {
  dialogTableVisible.value = true
  console.log(tagsData)
}

//search
const searchText = ref('')
const handleSearch = () => {
  let handleSearchText = searchText.value.toLowerCase()
  if (handleSearchText !== '') {
    // console.log('tagsDataOriginal[currentTabs]', tagsDataOriginal[currentTabs.value])
    let result = tagsDataOriginal[currentTabs.value].filter((value) => {
      return (
        value['tag_name'].toLowerCase().indexOf(handleSearchText) != -1 ||
        value['tag_description'].toLowerCase().indexOf(handleSearchText) != -1
      )
    })
    tagsData[currentTabs.value] = result
  } else {
    tagsData[currentTabs.value] = JSON.parse(JSON.stringify(tagsDataOriginal[currentTabs.value]))
  }
}

watch(
  () => props.times,
  () => {
    //當Hall.vue處理完後會更新時間，監聽到異動後，這邊會才會執行
    tagsConfig = getTagsConfig()
    transformTagsConfig()
  }
)

watch(
  () => globalStore.activeHall.hall_code,
  (newVal, oldVal) => {
    if (oldVal !== '') {
      tagsConfig = getTagsConfig()
      transformTagsConfig()
    }
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
  <div>
    <div class="tag-btn" @click.prevent="handleOpenDialog">
      <div class="tag-btn__icon">
        <font-awesome-icon icon="fa-solid fa-book" />
      </div>
      {{ $t('tags.tag_description') }}
    </div>

    <el-dialog
      v-model="dialogTableVisible"
      class="cdp-dialog"
      :append-to-body="true"
      :title="t('tags.tag_description')"
    >
      <tab
        :tabData="tabData"
        :activeName="currentTabs"
        v-model="currentTabs"
        class="cdp-dialog__tab"
      ></tab>
      <div class="cdp-dialog__content">
        <div class="cdp-dialog__tablebox">
          <div class="cdp-dialog__search">
            <Search v-model="searchText"></Search>
          </div>
          <CustomTable
            :stripe="true"
            :tableData="tableData"
            :tableColumns="tableColumns"
            class="cdp-tag-table"
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
  margin-right: 30px;
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
.cdp-tag-table {
  .el-table {
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
