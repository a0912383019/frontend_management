<script setup>
import { ref } from 'vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const searchName = ref('') //搜尋的名稱

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const emit = defineEmits(['searchAccount'])

// 確認篩選
const handleClick = () => {
  emit('searchAccount', searchName.value)
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
        <!-- <SectionTitle
          size="small"
          class="cdp-text-purple mb-4"
          :title="$t('target_group_analysis.target_group_name')"
        >
        </SectionTitle>
        <div class="drop__search">
          <el-input
            v-model="searchName"
            :placeholder="$t('target_group_analysis.input_target_group_name')"
          />
        </div> -->
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
