<script setup>
import { ref, reactive, onMounted } from 'vue'
import FormTitle from '@/components/Title/FormTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { apiHalls } from '@/api'
import { errorRespond } from '@/utils/commonUtils'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  },
  userHalls: {
    type: Array,
    default: []
  }
})

const apiSuccess = ref(false)
const messageKey = ref('loading')

const allHallsTree = ref([])
const allHallCode = ref([])

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
  validHallBox.value = true
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

const apiHallsArr = ref([])
const queryHalls = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiHalls()

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (result.data.result.length !== 0) {
        apiSuccess.value = true
        apiHallsArr.value = result.data.result
      }
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      apiHallsArr.value = []
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

const generateHallsFromApi = async (halls) => {
  await queryHalls()
  let allHalls = []
  let accessHalls = []
  apiHallsArr.value.forEach((ele) => {
    allHallCode.value.push(ele.login_code)

    let sortToIndex = halls.findIndex((val) => val === ele.login_code)
    if (sortToIndex !== -1) {
      accessHalls[sortToIndex] = {
        hallCode: ele.login_code,
        label: 'BBIN' + ' －【' + ele.login_code + '】' + ele.name
      }
    } else {
      allHalls.push({
        hallCode: ele.login_code,
        label: 'BBIN' + ' －【' + ele.login_code + '】' + ele.name
      })
    }
  })

  // 如果有不存在的廳，accessHalls的index會出現跳碼，造成非預期錯誤
  const compactArray = accessHalls.reduce((acc, curr) => {
    if (curr !== undefined) {
      acc.push(curr)
    }
    return acc
  }, [])

  allHallsTree.value = compactArray.concat(allHalls)

  return
}

onMounted(() => {
  generateHallsFromApi(props.userHalls)
})
</script>
<template>
  <div class="flex">
    <FormTitle
      class="cdp-text-blue"
      :class="{ 'mb-5': !props.edit }"
      :title="$t('admin_user.can_access_hall')"
    >
      <template #tooltip>
        {{ $t('admin_user.can_access_hall_drag_order_reminder') }}
      </template>
    </FormTitle>
  </div>
  <section class="cdp-section" :class="{ 'invalid-box': !validHallBox }">
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <el-tree
      v-else
      ref="treeRef"
      :data="allHallsTree"
      show-checkbox
      empty-text=""
      node-key="hallCode"
      :default-checked-keys="props.userHalls"
      :draggable="props.edit"
      :allow-drop="allowDrop"
      :props="treeProps"
    />
  </section>
  <div v-if="!validHallBox" class="cdp-text-candypink font-size-12">
    {{ $t('admin_user.not_select_access_hall_error_msg') }}
  </div>
</template>
<style lang="scss" scoped>
.cdp-section {
  max-height: 350px;
  overflow: scroll;
  margin-bottom: 0px !important;
}
.invalid-box {
  border: #f94956 1px solid;
}
:deep(.message) {
  margin-bottom: 0px;
}
:deep(.el-tree) {
  cursor: default;
  display: flex;
  flex-wrap: wrap;
  .el-tree-node {
    flex: 0 0 50%;
    &__content {
      cursor: default;
      .el-tree-node__expand-icon {
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
