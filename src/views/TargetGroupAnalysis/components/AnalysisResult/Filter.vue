<script setup>
import { ref } from 'vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import { useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'

const targetGroup = useTargetGroupStore()
const { groupFilterDate, filtered } = storeToRefs(targetGroup)

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const searchDate = ref('')

const emit = defineEmits(['searchWithDate'])

// 確認篩選
const handleClick = () => {
  groupFilterDate.value = searchDate.value
  filtered.value = Date.now()
  closePopover()
}
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="320"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover unit-test-people-changes"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <div class="drop">
        <div class="drop__top__item full">
          <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.date')">
          </SectionTitle>
          <DatepickerRange
            v-model="searchDate"
            :config="1"
            :shortcutsConfig="1"
            class="w-full filter-datepicker"
            classColor="purple"
          />
        </div>
        <div class="drop__footer">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleClick"
            :name="$t('common.filter')"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  &__search {
    margin-top: 5px;
    margin-bottom: 12px;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
  }
}
</style>
