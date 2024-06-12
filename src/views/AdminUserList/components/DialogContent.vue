<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import SelectTag from '@/components/Filter/SelectTag.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import AddGroup from '@/components/Button/AddButton.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import FormTitle from '@/components/Title/FormTitle.vue'

const { t, locale } = useI18n()

const targetGroup = useTargetGroupStore()
const { tagGroupList } = storeToRefs(targetGroup)

const props = defineProps({})
</script>
<template>
  <FormTitle class="cdp-text-blue mb-5" :title="$t('admin_user.can_access_hall')">
    <template #tooltip>
      {{ $t('admin_user.can_access_hall_drag_order_reminder') }}
    </template>
  </FormTitle>
  <section class="cdp-section"></section>
</template>
<style lang="scss" scoped>
.font-normal {
  font-weight: 400 !important;
}
</style>
