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

const { t, locale } = useI18n()

const targetGroup = useTargetGroupStore()
const { tagGroupList } = storeToRefs(targetGroup)

const props = defineProps({})
</script>
<template>
  <section class="cdp-section"></section>
</template>
<style lang="scss" scoped></style>
