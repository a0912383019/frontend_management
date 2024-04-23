<script setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores'
import Tab from '@/components/Tab.vue'
import { apiQueryTargetGroupsWithId } from '@/api'
import CdpMessage from '@/components/CdpMessage.vue'
import { dayjs } from 'element-plus'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import TagGroupSetting from '@/views/TargetGroupAnalysis/components/TagGroupSetting.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  targetId: {
    type: Number
  }
})

const apiSuccess = ref(false)
const messageKey = ref('loading')

const apiTargetData = reactive({}) // 存放api資料
const newTargetData = reactive({}) // 可更新的資料

const queryTargetGroupsId = async () => {
  //   apiSuccess.value = false
  //   messageKey.value = 'loading'

  try {
    const result = await apiQueryTargetGroupsWithId({
      hall_name: activeHall.hall_code,
      target_id: props.targetId
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        transformTargetDetails(result.data.result)
        // console.log(result.data.result)
        // apiTargetData.targetName = result.data.result.target_group_name
      }
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

// 是否公開
const isOpen = ref(false)

// 預設都是disabled
const edit = ref(false)

const apiTagGroupData = ref([])
const transformTargetDetails = (data) => {
  apiTargetData.targetName = data.target_group_name
  apiTargetData.memberName = data.member_name
  apiTargetData.createdTime = dayjs(data.created_time).format(t('date.format_datetime_rule'))
  apiTargetData.updaterName = data.updater_name
  apiTargetData.updatedTime = dayjs(data.updated_time).format(t('date.format_datetime_rule'))

  newTargetData.targetName = data.target_group_name

  apiTagGroupData.value = data.custom_tags_data
  isOpen.value = data.is_open
}

const handleTagIsEdit = () => {
  edit.value = true
}

onMounted(() => {
  console.log('child')
  queryTargetGroupsId()
})
</script>
<template>
  <section>
    <!-- <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" /> -->
    <div class="flex mb-20 justify-between">
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('target_group_analysis.target_group_name') }}</div>
        <div>
          <el-input v-if="!edit" v-model="apiTargetData.targetName" class="cdp-input cdp-input-disabled" readonly>
            <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
          </el-input>
          <el-input v-else v-model="newTargetData.targetName" class="cdp-input">
          </el-input>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.uploader') }}</div>
        <el-input v-model="apiTargetData.targetName" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.created_time') }}</div>
        <el-input v-model="apiTargetData.createdTime" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.updater') }}</div>
        <el-input v-model="apiTargetData.updaterName" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
      <el-col :span="5">
        <div class="cdp-text-blue mb-3">{{ $t('data_name.updated_time') }}</div>
        <el-input v-model="apiTargetData.updatedTime" class="cdp-input cdp-input-disabled" readonly>
          <template #append><font-awesome-icon icon="fa-solid fa-lock" /></template>
        </el-input>
      </el-col>
    </div>
    <section class="cdp-section-in mb-20">
      <TagGroupSetting :apiTagGroupData="apiTagGroupData" :isDisabled="!edit" />
    </section>
    <div class="mb-20 flex justify-end">
      <SwitchWithTooltip
        name="target_group_analysis.is_open"
        content="target_group_analysis.is_open_reminder"
        v-model="isOpen"
        :isDisabled="!edit"
      />
      <CdpButton
        class="custom-bg-dark__blue ml-20"
        :name="$t('common.edit')"
        size="sm-130"
        @click="handleTagIsEdit()"
      />
    </div>
  </section>
</template>
<style lang="scss" scoped>
// 5等分，設定19％是為了可以產生間距。因為首尾無間距，所以需要客製
.el-col-5 {
  width: 19%;
  flex: 0 0 19%;
}
.cdp-input {
  :deep(.el-input__inner) {
    cursor: default !important;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0 !important;
  }
}
</style>
