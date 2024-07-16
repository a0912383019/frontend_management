<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserAccountSettingStore } from '@/stores'
import FormTitle from '@/components/Title/FormTitle.vue'

const userAccountSettingStore = useUserAccountSettingStore()
const { generateHalls, allHallCode } = userAccountSettingStore

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  },
  userHalls: {
    type: Array
  }
})

const allHalls = ref(generateHalls(props.userHalls))

const allowDrop = (draggingNode, dropNode, type) => {
  // 只允許放置在根節點
  return draggingNode.level === 1 && type === 'next'
}

const treeRef = ref(null)

const treeProps = reactive({
  disabled: () => {
    if (props.edit) {
      return false
    }

    return true
  }
})

const initHalls = () => {
  checkIsAllHallAccess()
  allHalls.value = generateHalls(props.userHalls)
  treeRef.value.setCheckedKeys(props.userHalls)
}

const validHallBox = ref(true)

const checkHallNodes = () => {
  validHallBox.value = true
  if (treeRef.value.getCheckedNodes().length === 0) {
    validHallBox.value = false
  }

  return treeRef.value.getCheckedNodes()
}

defineExpose({
  initHalls,
  checkHallNodes
})

const allCheckBtn = ref(false)

const checkAllChange = () => {
  if (allCheckBtn.value === true) {
    treeRef.value.setCheckedKeys(allHallCode)
  } else {
    treeRef.value.setCheckedKeys([])
  }
}

const checkOption = (data, item) => {
  if (item.checkedKeys.length === allHalls.value.length) {
    allCheckBtn.value = true
  } else {
    allCheckBtn.value = false
  }
}

const checkIsAllHallAccess = () => {
  allCheckBtn.value = false
  if (props.userHalls.length === allHalls.value.length) {
    allCheckBtn.value = true
  }
}

onMounted(() => {
  checkIsAllHallAccess()
})
</script>
<template>
  <div class="flex">
    <FormTitle class="cdp-text-blue" :class="{'mb-5': !props.edit}" :title="$t('admin_user.can_access_hall')">
      <template #tooltip>
        {{ $t('admin_user.can_access_hall_drag_order_reminder') }}
      </template>
    </FormTitle>
    <el-checkbox
      v-show="props.edit"
      v-model="allCheckBtn"
      @change="checkAllChange"
      :label="$t('common.select_all_option')"
      class="ml-20 cdp-checkbox__blue checkbox-label"
    />
  </div>
  <section class="cdp-section" :class="{ 'invalid-box': !validHallBox }">
    <el-tree
      ref="treeRef"
      :data="allHalls"
      show-checkbox
      node-key="hallCode"
      :default-checked-keys="props.userHalls"
      :draggable="props.edit"
      :allow-drop="allowDrop"
      :props="treeProps"
      @check="checkOption"
    />
  </section>
  <div
    v-if="!validHallBox"
    class="cdp-text-candypink font-size-12 mt-5"
  >
    {{ $t('admin_user.not_select_access_hall_error_msg') }}
  </div>
</template>
<style lang="scss" scoped>
.cdp-section {
  height: 350px;
  overflow: scroll;
  margin-bottom: 0px !important;
}
.invalid-box {
  border: #f94956 1px solid;
}
:deep(.el-tree) {
  cursor: default;
  display: flex;
  flex-wrap: wrap;
  .el-tree-node {
    flex: 0 0 50%;
    &__content {
      cursor: default;
      .el-tree-node__expand-icon{
        display: none;
      }
    }
  }
  .el-checkbox {
    &.is-disabled {
      .el-checkbox__input {
        pointer-events: none;
      }
    }
    &__input {
      &.is-checked {
        & + .el-checkbox {
          &__label {
            color: #000;
          }
        }
        .el-checkbox {
          &__inner {
            background-color: #4f84cf;
            border-color: #4f84cf;
          }
        }
      }
    }
    &__label {
      color: #000;
    }
    &__inner {
      width: 20px;
      height: 20px;
      box-shadow: inset 1px 1px 2px 0 rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-radius: 3px;
      &:hover {
        border-color: #4f84cf;
      }
      &::after {
        left: 6px;
        top: 2px;
        width: 5px;
        height: 9px;
        border-width: 2px;
      }
    }
  }
}
</style>
