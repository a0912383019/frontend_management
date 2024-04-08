<script setup>
import { ref, watch, computed, onMounted, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useDialogMemberDetailStore } from '@/stores'
import { storeToRefs } from 'pinia'
import {
  checkTagUsage,
  getSessionStorageEntity,
  FormatNumber,
  orderTags
} from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import GenerateTagsBadge from '@/components/GenerateTagsBadge.vue'
import TooltipCustomTag from '@/components/TooltipCustomTag.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const refCustomTable = ref(null) // table ref
const refContent = ref(null)

const tableData = ref([])
const apiLength = ref(10) // 一頁幾筆

const canvas = ref(null)

const props = defineProps({
  apiObject: {
    apiSuccess: Boolean,
    messageKey: String,
    result: Object
  },
  clientWidth: Number
})
const { apiObject, clientWidth } = toRefs(props)

const apiSuccess = ref(apiObject.value.apiSuccess)
const messageKey = ref(apiObject.value.messageKey)

const tag_description_dict =
  getSessionStorageEntity('system_config').tags_config[activeHall.hall_code]

const tableColumns = computed(() => {
  return [
    {
      label: t('rank_analysis.ranking_no'),
      prop: 'rank',
      headerAlign: 'center',
      align: 'center',
      minWidth: '7%'
    },
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.ag_name'),
      prop: 'ag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('data_name.user_level'),
      prop: 'user_level',
      headerAlign: 'center',
      align: 'center',
      minWidth: '12%'
    },
    {
      label: t('rank_analysis.commissionable'),
      prop: 'commissionable',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('tags.tags'),
      prop: 'tag_name_str',
      headerAlign: 'center',
      align: 'left',
      minWidth: '47%'
    }
  ]
})

// 轉換資料
const transformMemberData = (data) => {
  let result = []
  data.map((item, index) => {
    let tagWidth = 0
    let tempObj = {
      ...item,
      index,
      rank: index,
      commissionable: FormatNumber(item.commissionable_total),
      tag_name_str: [],
      tag_transfrom_obj: [],
      tag_show: false,
      tag_button_show: false // 按鈕是否顯示
    }

    for (let i = 0; i < tempObj.tags.length; i++) {
      // 若標籤代碼禁用，則跳過不顯示
      if (checkTagUsage(activeHall.hall_code, tempObj.tags[i])) {
        tempObj.tag_name_str.push(tempObj.tags[i])
      }
    }

    // 標籤依照說明排序
    tempObj.tag_name_str = orderTags(tempObj.tag_name_str)

    // 分第一行與第二行，第二行-10為了預留...的空間
    let lineone = clientWidth.value * 0.43
    let linetwo = clientWidth.value * 0.43 - 20
    let currentLine = 1

    tempObj.tag_name_str.forEach((item) => {
      let obj = {}
      obj.code = String(item)
      obj.name = tag_description_dict[item].tag_name
      obj.width = getTextWidth(obj.name)
      obj.hide = false

      // 計算標籤寬度並根據需要更新行數和顯示狀態
      if (currentLine === 1 && tagWidth + obj.width > lineone) {
        tagWidth = obj.width
        currentLine = 2
      } else if (currentLine === 2 && tagWidth + obj.width > linetwo) {
        currentLine = 3
        obj.hide = true
        tempObj.tag_button_show = true
      } else if (currentLine >= 3) {
        // 當到達第三行時，隱藏標籤並設置按鈕顯示
        obj.hide = true
        tempObj.tag_button_show = true
      } else {
        tagWidth += obj.width + 1
      }

      tempObj.tag_transfrom_obj.push(obj)
    })
    result.push(tempObj)
  })

  return result
}

// 取得文字總寬
const getTextWidth = (val) => {
  const text = val
  const context = canvas.value.getContext('2d')
  const tagPadding = 16 // left + right
  const tagMarginRight = 5

  // 設定字體大小及字體
  context.font = '13px Noto Sans TC'

  // 取得字串總寬 + padding + margin
  const charWidths = context.measureText(text).width + tagPadding + tagMarginRight
  return Math.floor(charWidths)
}

const handleTagButtonClick = (item) => {
  // 如果直接修改value，會因為vue響應式關係導致資料排序錯亂，所以先複製資料再修改狀態，再將新的資料賦予上去
  const newData = [...tableData.value]
  newData[item.index].tag_show = !newData[item.index].tag_show
  tableData.value = newData
}

const key = ref(systemConfigIsOk.value)

watch([() => apiObject.value.apiSuccess, () => apiObject.value.messageKey], () => {
  apiSuccess.value = apiObject.value.apiSuccess
  messageKey.value = apiObject.value.messageKey
  tableData.value = []
  if (apiObject.value.apiSuccess) {
    tableData.value = transformMemberData(apiObject.value.result.rank)
  }
})

watch(
  () => systemConfigIsOk.value,
  () => {
    key.value = Math.floor(Math.random() * 100)
  }
)

onMounted(() => {
  if (apiObject.value.apiSuccess && Object.keys(apiObject.value.result).length !== 0) {
    tableData.value = []
    tableData.value = transformMemberData(apiObject.value.result.rank)
  }
})
</script>
<template>
  <section class="mb-0" ref="refContent">
    <canvas ref="canvas" style="display: none"></canvas>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div ref="refContent" v-else>
      <CustomTable
        :serverSide="false"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="apiLength"
        :stripe="true"
        ref="refCustomTable"
        class="customTable2 customTagListTable"
      >
        <template #tag_name_str-header>
          <TooltipCustomTag />
        </template>
        <template #rank="scope">
          <div class="font-size-32" v-if="scope.row.rank < 3">
            <cdp-icon :name="'grade' + (scope.row.rank + 1)"></cdp-icon>
          </div>
          <div v-else>
            {{ scope.row.rank + 1 }}
          </div>
        </template>
        <template #user_name="scope">
          <div class="cdp-link-click" @click="updateMemberData(scope.row)">
            {{ scope.row.user_name }}
          </div>
        </template>
        <template #tag_name_str="scope">
          <div class="tags">
            <ul class="tags__list" :class="{ allShow: scope.row.tag_show }">
              <template v-for="item in scope.row.tag_transfrom_obj" :key="item.index">
                <li :class="{ hide: item.hide }">
                  <GenerateTagsBadge
                    :key="key"
                    :hall_name="activeHall.hall_code"
                    :tag_code="item.code"
                  />
                </li>
              </template>
              <li
                class="tags__button"
                @click="handleTagButtonClick(scope.row)"
                v-if="scope.row.tag_button_show"
              >
                <el-tooltip
                  effect="dark"
                  :content="scope.row.tag_show ? $t('tags.hide_some_tag') : $t('tags.open_all_tag')"
                  placement="top"
                  :hide-after="0"
                >
                  {{ scope.row.tag_show ? 'close' : '⋯' }}
                </el-tooltip>
              </li>
            </ul>
          </div>
        </template>
        <template #register_date="scope">
          <div style="line-height: 1.3">
            {{ scope.row.register_date.split(' ')[0] }} <br />{{
              scope.row.register_date.split(' ')[1]
            }}
          </div>
        </template>
      </CustomTable>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}

.tags {
  display: flex;
  width: 100%;
  &__list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    overflow: hidden;
    li {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .hide {
      display: none;
    }
    &.allShow {
      max-height: none;
      .hide {
        display: block;
      }
    }
  }
  &__button {
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      filter: drop-shadow(0 2px 2px $blue);
    }
  }
}
</style>
<style lang="scss">
.customTagListTable {
  button.detail-button {
    min-width: 80px;
  }
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 62px;
    }
  }
}
</style>
