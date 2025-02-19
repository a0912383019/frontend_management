<script setup>
import { computed, reactive } from 'vue'
import CustomPagination from '@/components/Pagination/Pagination.vue'
import TotalPagination from '@/components/Pagination/TotalPagination.vue'

const props = defineProps({
  tableData: {
    // 表格資料
    type: Array
  },
  tableColumns: {
    // 表頭
    type: Array
  },
  pageSize: {
    // 一頁幾筆
    type: Number,
    default: 10
  },
  cellStyle: {
    type: Function
  },
  paginationLayout: {
    // 頁碼
    type: String,
    default: 'prev, pager, next'
  }
})

const emit = defineEmits(['update:currentPage'])

// 頁碼相關
const page = reactive({
  currentPage: 1,
  pageSize: props.pageSize
})

const updateCurrentPage = (val) => {
  page.currentPage = val
  emit('update:currentPage', val)
}

// 表格資料
const pageTableData = computed(() => {
  return props.tableData.slice(
    (page.currentPage - 1) * page.pageSize,
    page.pageSize * page.currentPage
  )
})
</script>
<template>
  <div class="relative">
    <el-table
      :data="pageTableData"
      border
      :cell-style="props.cellStyle"
      class="cdp-table"
      style="width: 100%"
    >
      <template v-for="column in tableColumns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :min-width="column.minWidth"
          :align="column.align"
          :header-align="column.headerAlign"
          :class-name="column.colClass"
          :resizable="false"
        >
          <template #header>
            {{ column.label }}
            <slot :name="column.prop + '-header'"></slot>
          </template>
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row" :idx="scope.$index">
              <div>{{ scope.row[column.prop] }}</div>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="paginationBox">
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="props.tableData.length"
        :layout="paginationLayout"
        class="cdp-pagination"
        @update:currentPage="updateCurrentPage"
      />
      <TotalPagination
        :page="page.currentPage"
        :pageSize="props.pageSize"
        :total="props.tableData.length"
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
