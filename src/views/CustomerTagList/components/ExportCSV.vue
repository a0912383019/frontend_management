<script setup>
import { ref, computed } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ExportReport from '@/components/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t } = useI18n()

const props = defineProps({
  total: {
    type: Number
  }
})

const dialogVisible = ref(false) //dialog開啟狀態

const apiTotal = computed(() => {
  return props.total
})

const averageTypeValue = ref('週平均')
const averageTypeOptions = ref([
  {
    label: '週平均',
    value: '週平均'
  },
  {
    label: '日平均',
    value: '日平均'
  }
])
</script>
<template>
  <div>
    <ExportReport @click="dialogVisible = true" />
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog customer-tag-dialog"
      :append-to-body="true"
      :title="t('import_export_file.export')"
    >
      <div class="dialog-inner">
        <el-row>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.current_duration') }}</div>
            <DatepickerRange :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.average_duration') }}</div>
            <DatepickerRange :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.monthly_avg_duration') }}</div>
            <DatepickerRange :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.average_type') }}</div>
            <el-select
              v-model="averageTypeValue"
              class="cdp-select full mr-6"
              popper-class="cdp-select-popper"
              suffix-icon="CaretBottom"
            >
              <el-option
                v-for="item in averageTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col>
            <div class="col-title">{{ $t('customer_tag_list.data_size') }}</div>
            <el-input v-model="apiTotal" class="cdp-input cdp-input-disabled" readonly>
              <template #append><font-awesome-icon icon="fa-lock" /></template>
            </el-input>
            <div class="note">
              <font-awesome-icon icon="fa-info-circle" />
              {{ $t('customer_tag_list.increase_condition_reduce_time') }}
            </div>
            <div class="flex justify-end"><ButtonIcon name="確認匯出" color="blue" /></div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.customer-tag-dialog {
  max-width: 530px;
  .dialog-inner {
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #e6eaf2;
    background-color: #fff;
  }
  .col-title {
    padding-bottom: 3px;
    font-size: 14px;
    color: $blue;
  }
  .note {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    padding-top: 5px;
    font-size: 13px;
    color: $oragne;
    svg {
      margin-right: 5px;
    }
  }
}
</style>
