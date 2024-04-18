<script setup>
import {  computed } from 'vue'
const props = defineProps({
  tableData: {
    //表格資料
    type: Array
  },
  tableColumns: {
    //表頭
    type: Array
  },
  tableHeight: {
    //表格高度
    type: String,
    default: 'auto'
  },
  border: {
    //邊框
    type: Boolean,
    default: true
  }
})

//表格資料
const pageTableData = computed(() => {
  return props.tableData
})
</script>
<template>
  <div class="relative">
    <el-table
      :show-header="false"
      :data="pageTableData"
      :height="tableHeight"
      :border="props.border"
      class="form-head-black"
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
      <template #empty>
        <div>{{ $t('table.sZeroRecords') }}</div>
      </template>
    </el-table>
  </div>
</template>
<style lang="scss">
.form-head-black {
  &.el-table {
    td:first-child {
      background-color: #F6F8FB;
    }
  }
}
</style>
