<script setup>
import { computed } from 'vue'
import { FormatNumber } from '@/utils/commonUtils.js'

const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    //一頁幾筆
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  filtered: {
    type: Boolean,
    default: false
  },
  totalDataCount: {
    type: Number,
    default: 0
  }
})

const pageStart = computed(() => {
  if (props.total === 0) {
    return 0
  }
  return props.page * props.pageSize - props.pageSize + 1
})

const pageEnd = computed(() => {
  const end = props.page * props.pageSize
  if (end > props.total) {
    return props.total
  }
  return end
})
</script>
<template>
  <div class="totalPagination">
    {{
      $t('table.sInfo', {
        START: FormatNumber(pageStart),
        END: FormatNumber(pageEnd),
        TOTAL: FormatNumber(props.total)
      })
    }}
    <span v-show="props.filtered">
      {{
        $t('table.sInfoFiltered', {
          MAX: FormatNumber(props.totalDataCount)
        })
      }}
    </span>
  </div>
</template>
<style lang="scss" scoped>
.totalPagination {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 500;
  color: #404040;
}
</style>
