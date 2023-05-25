<script setup>
import { computed, reactive } from 'vue'
import CustomPagination from '@/components/Pagination/Pagination.vue'
const props = defineProps({
  tableData: {
    type: Array
  },
  tableColumns: {
    type: Array
  },
  tableHeight: {
    type: Number,
    default: 590
  },
  defaultSort: {
    type: Object
  },
  hasPagination: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: false
  }
})

//排序相關
const emit = defineEmits(['sort'])

const handleTableSort = ({ prop, order }) => {
  emit('sort', { prop, order })
}

//頁碼相關
const page = reactive({
  currentPage: 1,
  pageSize: 10
})

const updateCurrentPage = (val) => {
  page.currentPage = val
}

const updatePageSize = (val) => {
  page.pageSize = val
}

//表格資料
const pageTableData = computed(() => {
  let data
  if (props.hasPagination) {
    data = props.tableData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.pageSize * page.currentPage
    )
  } else {
    data = props.tableData
  }
  return data
})
</script>
<template>
  <div>
    <el-table
      :data="pageTableData"
      :default-sort="defaultSort"
      :height="tableHeight"
      :stripe="props.stripe"
      class="customTable"
      @sort-change="handleTableSort"
      style="width: 100%"
    >
      <template v-for="column in tableColumns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align"
          :sort-orders="['descending', 'ascending']"
          :sortable="column.sortable"
        >
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row">
              <div>{{ scope.row[column.prop] }}</div>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="paginationBox" v-if="hasPagination">
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="tableData.length"
        layout="prev, pager, next"
        class="customPagination"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
      />
      <CustomPagination
        :page="page.currentPage"
        :pageSize="page.pageSize"
        :total="tableData.length"
        layout="total, sizes"
        class="customPagination customPagination__right"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
      />
    </div>
  </div>
</template>
<style lang="scss">
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
