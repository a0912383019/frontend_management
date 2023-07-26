<script setup>
import { computed, reactive } from 'vue'
import CustomPagination from '@/components/Pagination/Pagination.vue'
import TotalPagination from '@/components/Pagination/TotalPagination.vue'
const props = defineProps({
  tableData: {
    //表格資料
    type: Array
  },
  tableColumns: {
    //表頭
    type: Array
  },
  tableTotal: {
    //自定義資料總數，遇到每次換頁都需要call api，但又需要顯示資料總數逾頁面上
    type: Number,
    default: 0
  },
  tableHeight: {
    //表格高度
    type: String,
    default: 'auto'
  },
  defaultSort: {
    //預設排序設定
    type: Object
  },
  hasPagination: {
    //頁碼
    type: Boolean,
    default: true
  },
  pageSize: {
    //一頁幾筆
    type: Number,
    default: 10
  },
  stripe: {
    //斑馬紋表格樣式
    type: Boolean,
    default: false
  },
  border: {
    //邊框
    type: Boolean,
    default: false
  },
  showSummary: {
    //是否顯示表尾合記
    type: Boolean,
    default: false
  },
  sumText: {
    //表尾合計欄位名稱
    type: String,
    default: ''
  },
  spanMethod: {
    //合併儲存格規則
    type: Function
  },
  paginationLayout: {
    //頁碼
    type: String,
    default: 'prev, pager, next'
  },
  serverSide: {
    //是否啟用後端服務器模式(每頁單獨發api)，啟用後pageTableData會有差異
    type: Boolean,
    default: false
  }
})

//排序相關
const emit = defineEmits(['sort', 'update:currentPage'])

const handleTableSort = ({ prop, order }) => {
  emit('sort', { prop, order })
}

//頁碼相關
const page = reactive({
  currentPage: 1,
  pageSize: props.pageSize
})

const updateCurrentPage = (val) => {
  page.currentPage = val
  emit('update:currentPage', val)
}

const updatePageSize = (val) => {
  page.pageSize = val
}

//表格資料
const pageTableData = computed(() => {
  let data
  if (props.hasPagination && props.serverSide === false) {
    data = props.tableData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.pageSize * page.currentPage
    )
  } else {
    data = props.tableData
  }
  return data
})

const pageTableTotla = computed(() => {
  if (props.tableTotal === 0) {
    return props.tableData.length
  } else {
    return props.tableTotal
  }
})

const goToFirstPage = () => {
  page.currentPage = 1
}

defineExpose({ goToFirstPage })
</script>
<template>
  <div>
    <el-table
      :data="pageTableData"
      :default-sort="defaultSort"
      :height="tableHeight"
      :stripe="props.stripe"
      :border="props.border"
      :show-summary="props.showSummary"
      :sum-text="props.sumText"
      :span-method="spanMethod"
      class="cdp-table"
      @sort-change="handleTableSort"
      style="width: 100%"
    >
      <template v-for="column in tableColumns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :header-align="column.headerAlign"
          :sort-orders="['descending', 'ascending']"
          :sortable="column.sortable"
          :resizable="false"
        >
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row">
              <div>{{ scope.row[column.prop] }}</div>
            </slot>
          </template>
        </el-table-column>
      </template>

      <!-- append插槽：插入至表格最后一行之后的内容 -->
      <template #append><slot name="append"></slot></template>
    </el-table>
    <div class="paginationBox" v-if="hasPagination">
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="pageTableTotla"
        :layout="paginationLayout"
        class="customPagination"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
      />
      <TotalPagination
        :page="page.currentPage"
        :pageSize="props.pageSize"
        :total="pageTableTotla"
      />
    </div>
  </div>
</template>
<style lang="scss">
.cdp-table {
  border-radius: 5px;
  overflow: hidden;
  // border: 1px solid #e6eaf2;
  .cdp-link-click {
    color: #4f84cf;
  }
  &.el-table--border {
    border: none;
    &::before,
    &::after,
    .el-table__inner-wrapper::after,
    .el-table__inner-wrapper::before {
      background-color: #e6eaf2;
    }
    .el-table__cell {
      border-right-color: #e6eaf2;
    }
  }
  &.el-table {
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom-color: #e6eaf2;
    }
    th.el-table__cell.is-leaf {
      background-color: #f6f8fb;
      color: #3b4667;
    }
    .sort-caret {
      &.descending {
        border-top-color: #ccd3e0;
      }
      &.ascending {
        border-bottom-color: #ccd3e0;
      }
    }
    .descending {
      .sort-caret {
        &.descending {
          border-top-color: #868ea3;
        }
      }
    }
    .ascending {
      .sort-caret {
        &.ascending {
          border-bottom-color: #868ea3;
        }
      }
    }
  }
  &.el-table--enable-row-hover {
    .el-table__body {
      tr {
        &:hover {
          > td.el-table__cell {
            background-color: rgba(107, 207, 223, 0.05);
          }
        }
      }
    }
  }
  &.el-table--striped {
    .el-table__body {
      tr.el-table__row--striped {
        td.el-table__cell {
          background-color: #f4f6f9;
        }
      }
    }
  }
}
.customTable {
  // border-radius: 15px;
  box-shadow: 3px 3px 5px 0 rgba(162, 162, 162, 0.2);
  // border: solid 0.5px #d0d0d0;
  background-color: #e9eef6;
  tr {
    background-color: #e9eef6;
  }
  &.el-table--striped {
    .el-table__body tr.el-table__row--striped td.el-table__cell {
      background-color: #f4f6f9;
    }
  }
  &.el-table {
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom: none;
    }
  }
  .el-table__header {
    th.el-table__cell {
      background-color: #e9eef6;
      color: #3b4667;
      font-size: 14px;
    }
  }
  .el-table__body {
    .el-table__cell {
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 14px;
      color: #000;
      height: 55px;
    }
  }
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    height: auto;
    margin-left: 5px;
    .sort-caret {
      position: absolute;
      top: 50%;
      left: 0;
      bottom: auto;
      transform: translateY(-50%);
      width: auto;
      height: auto;
      border: none;
      font-size: 12px;
      font-style: normal;
      line-height: 0.5;
      &::after {
        content: '▾';
        display: inline-block;
      }
      &.ascending {
        opacity: 0;
        &::after {
          transform: rotate(180deg);
        }
      }
    }
  }
  .is-right,
  .is-center {
    .caret-wrapper {
      margin-right: -29px;
    }
  }
  .descending {
    .caret-wrapper {
      color: $blue;
      .ascending {
        opacity: 0;
      }
      .descending {
        opacity: 1;
      }
    }
  }
  .ascending {
    .caret-wrapper {
      color: $blue;
      .ascending {
        opacity: 1;
      }
      .descending {
        opacity: 0;
      }
    }
  }
  &.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: #eef2f6;
  }
}
.paginationBox {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
.customPagination {
  &__right {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
