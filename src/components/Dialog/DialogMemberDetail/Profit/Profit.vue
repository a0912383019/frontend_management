<script setup>
import { ref, computed } from 'vue'
import MemberPayoffHallProfit from './components/MemberPayoffHallProfit.vue'
import DepositAndWithdraw from './components/DepositAndWithdraw.vue'
import TotalBetPlatforms from './components/TotalBetPlatforms.vue'
import TotalPayoffPlatforms from './components/TotalPayoffPlatforms.vue'
import draggable from 'vuedraggable'

const drag = ref(false)
//拖曳的區塊
const lists = ref([
  {
    //區塊1
    id: 1,
    area: 'first'
  },
  {
    //區塊2
    id: 2,
    area: 'second'
  },
  {
    //區塊3
    id: 3,
    area: 'third'
  }
])

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost'
  }
})
</script>
<template>
  <div>
    <draggable
      class="drag"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null
      }"
      v-model="lists"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      item-key="order"
    >
      <template #item="{ element }">
        <div>
          <div class="drag__area" v-show="element.area === 'first'">
            <MemberPayoffHallProfit />
          </div>
          <div class="drag__area" v-show="element.area === 'second'">
            <DepositAndWithdraw />
          </div>
          <div class="drag__area" v-show="element.area === 'third'">
            <el-row :gutter="20">
              <el-col :span="12">
                <TotalBetPlatforms />
              </el-col>
              <el-col :span="12">
                <TotalPayoffPlatforms />
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<style lang="scss" scoped>
.drag {
  &__area {
    cursor: move;
  }
  .ghost {
    opacity: 0.3;
  }
}
</style>
