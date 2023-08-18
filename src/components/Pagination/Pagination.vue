<script setup>
import { computed } from 'vue'

const props = defineProps({
  background: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next'
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 1
  },
  pagerCount: {
    type: Number,
    default: 7
  },
  small: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

//當前頁數
const currentPage = computed({
  get() {
    return props.page
  },
  set(newVal) {
    emit('update:currentPage', newVal)
  }
})

//當前下拉選項(每頁幾筆)
const currentPageSize = computed({
  get() {
    return props.pageSize
  },
  set(newVal) {
    emit('update:pageSize', newVal)
  }
})

//每頁幾筆下拉
const pageSizesArray = computed(() => {
  let result = []
  let total = props.total
  switch (true) {
    case total <= 10:
      result = [10]
      break
    case total <= 25:
      result = [10, 25]
      break
    case total <= 50:
      result = [10, 25, 50]
      break
    case total <= 100:
      result = [10, 25, 50, 100]
      break
    case total <= 250:
      result = [10, 25, 50, 100, 250, 500]
      break
    default:
      result = [10, 25, 50, 100, 250, 500]
  }
  return result
})
</script>
<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="currentPageSize"
    :page-sizes="pageSizesArray"
    :pager-count="pagerCount"
    :small="small"
    :disabled="disabled"
    :background="background"
    :layout="layout"
    :total="total"
  />
</template>
<style lang="scss">
.el-pagination {
  .el-select {
    .el-input {
      width: 90px;
      &__wrapper {
        padding-left: 0;
        padding-right: 0;
        background-color: #eef2f6;
        border-radius: 2px;
        box-shadow: none;
      }
      &__suffix {
        width: 20px;
        &-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          .el-icon {
            margin-left: 0;
            &::after {
              content: '▾';
              font-size: 14px;
              font-style: normal;
              color: $blue;
            }
            svg {
              display: none;
            }
          }
        }
      }
    }
  }
  &__total {
    color: $blue;
  }
  &__sizes {
    margin-left: 12px;
    .el-input__inner {
      color: $blue;
    }
  }
  &.is-background {
    .el-pager {
      li {
        &.is-active {
          background-color: $blue;
        }
      }
    }
    .el-pager li,
    .btn-next,
    .btn-prev {
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
      border-radius: 4px;
      margin: 0 5px;
      font-size: 14px;
      color: $blue;
      background-color: #eef2f6;
    }
  }
}
</style>
