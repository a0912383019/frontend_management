<script setup>
import SectionTitle from '@/components/Title/SectionTitle.vue'
</script>
<template>
  <div class="cdp-section-in">
    <SectionTitle
      class="mb-15"
      :title="$t('register_no_deposit_analysis.deposit_span_member_detail')"
    >
      <template #tooltip>
        {{ $t('register_no_deposit_analysis.click_for_detail') }}
      </template>
    </SectionTitle>
  </div>
</template>
<style lang="scss" scoped></style>
