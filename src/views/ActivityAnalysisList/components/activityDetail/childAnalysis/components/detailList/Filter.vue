<script setup>
import { onMounted, ref } from 'vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { useActivityAnalysisStore } from '@/stores'

const activityStore = useActivityAnalysisStore()

const searchMember = ref('')

const popover = ref(null) // popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// 確認篩選
const handleClick = () => {
  activityStore.searchChildDetailMemberName = searchMember.value
  activityStore.isChildDetailListFiltered = Date.now()
  closePopover()
}

onMounted(() => {
  searchMember.value = activityStore.searchChildDetailMemberName
})
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
        <div class="drop__top">
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('data_name.member_name')"
            >
            </SectionTitle>
            <el-input
              v-model="searchMember"
              class="cdp-input__purple"
              :placeholder="$t('common.input_member_name_search')"
            />
          </div>
        </div>
        <div class="drop__footer">
          <ButtonIcon
            icon="search"
            size="medium "
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
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
