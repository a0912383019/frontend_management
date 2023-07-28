<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.member_journey_detail')">
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
  </section>
</template>
<style lang="scss" scoped></style>
