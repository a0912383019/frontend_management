<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiDeleteUserExportList } from '@/api'
import { useGlobalStore } from '@/stores'
import { ElNotification } from 'element-plus'
import ConfirmBox from '@/components/ConfirmBox.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  confirmBoxVisible: {
    type: Boolean,
    default: false
  },
  confirmBoxTopVisible: {
    type: Boolean,
    default: false
  },
  confirmInfo: {
    type: Object,
    default: {
      sourcePage: '',
      exportDate: ''
    }
  },
  deleteLinkList: {
    type: Array,
    default: []
  }
})

const emit = defineEmits(['deleteBoxClose', 'deleteSuccess'])

const visibleBox = computed({
  get() {
    return props.confirmBoxVisible
  },
  set(newValue) {
    emit('deleteBoxClose')
    return newValue
  }
})

const visibleTopBox = computed({
  get() {
    return props.confirmBoxTopVisible
  },
  set(newValue) {
    emit('deleteBoxClose')
    return newValue
  }
})

// 取得資料
const deleteUserExportList = async () => {
  emit('deleteBoxClose')
  globalStore.isLoading = true
  try {
    const result = await apiDeleteUserExportList({
      hall_name: activeHall.hall_code,
      download_urls: props.deleteLinkList
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      ElNotification({
        title: t('msg.delete_successful'),
        type: 'success'
      })
      globalStore.isLoading = false
      emit('deleteSuccess')
    } else {
      ElNotification({
        title: t('msg.delete_failed'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
    globalStore.isLoading = false
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.delete_failed'),
        type: 'error'
      })
    }
  }
}

//確認異動，送出編輯內容
const deleteExecute = () => {
  deleteUserExportList()
}

const cancelDelete = () => {
  visibleBox.value = false
  visibleTopBox.value = false
}
</script>
<template>
  <ConfirmBox
    color="red"
    v-model="visibleBox"
    class="top15per"
    :title="$t('modal.delete')"
    @cancelExecute="cancelDelete"
    @confirmExecute="deleteExecute"
  >
    <template v-slot:text-body>
      <div class="text-center">
        <span>{{ $t('modal.are_you_sure_to_delete') + '「' }}</span>
        <table class="table-total">
          <tr>
            <td width="35%" class="text-right">{{ $t('user_export_report.source_page') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">{{ $t(confirmInfo.sourcePage) }}</td>
          </tr>
          <tr>
            <td width="35%" class="text-right">{{ $t('user_export_report.export_date') }}</td>
            <td width="2%" class="text-center">：</td>
            <td width="63%" class="text-left">{{ confirmInfo.exportDate }}</td>
          </tr>
        </table>
        <span>{{ '」？' }}</span>
      </div>
    </template>
  </ConfirmBox>
  <ConfirmBox
    color="red"
    name="delete"
    v-model="visibleTopBox"
    class="top15per"
    :title="$t('modal.delete')"
    @cancelExecute="cancelDelete"
    @confirmExecute="deleteExecute"
  >
    <template v-slot:text-body>
      <div class="text-center table-total">
        <span>{{ $t('modal.are_you_sure_to_delete') + $t('common.select_all') + '？' }}</span>
      </div>
    </template>
  </ConfirmBox>
</template>
<style lang="scss" scoped>
.table-total {
  width: 100%;
  td {
    font-size: 14px;
    color: #404040;
    font-weight: normal;
  }
}
</style>
