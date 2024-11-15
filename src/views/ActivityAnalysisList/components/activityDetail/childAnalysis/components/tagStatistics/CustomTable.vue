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
  cellStyle: {
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

const emit = defineEmits(['update:currentPage'])

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

const pageTableTotal = computed(() => {
  if (props.tableTotal === 0) {
    return props.tableData.length
  } else {
    return props.tableTotal
  }
})
</script>
<template>
  <div class="relative">
    <el-table
      ref="tableRef"
      :data="pageTableData"
      :height="tableHeight"
      :stripe="props.stripe"
      :border="props.border"
      :cell-style="props.cellStyle"
      class="cdp-table"
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
          :class-name="column.colClass"
          :resizable="false"
        >
          <template #header>
            {{ column.label }}
            <slot :name="column.prop + '-header'"></slot>
            <slot :name="column.headerSlot" v-if="column.headerSlot">
              <span v-html="column.headerSlot"></span>
            </slot>
          </template>
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row" :idx="scope.$index">
              <div>{{ scope.row[column.prop] }}</div>
            </slot>
          </template>
        </el-table-column>
      </template>
      <!-- append插槽：插入至表格最后一行之后的内容 -->
      <template #append><slot name="append"></slot></template>
      <template #empty>
        <div>{{ $t('table.sZeroRecords') }}</div>
      </template>
    </el-table>
    <div class="paginationBox" v-if="hasPagination">
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="pageTableTotal"
        :layout="paginationLayout"
        class="cdp-pagination"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
      />
      <TotalPagination
        :page="page.currentPage"
        :pageSize="props.pageSize"
        :total="pageTableTotal"
        :filtered="props.filtered"
      />
    </div>
  </div>
</template>
<style lang="scss">
.cdp-table {
  border-radius: 5px;
  overflow: hidden;

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
.paginationBox {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
.cdp-pagination {
  &__right {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
