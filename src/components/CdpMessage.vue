<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  messageKey: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()

const getIcon = (key) => {
  let result = ''
  switch (key) {
    case 'loading':
      result = 'fa-solid fa-spinner'
      break
    case 'info':
      result = 'fa-solid fa-circle-info'
      break
    default:
      result = 'fa-solid fa-triangle-exclamation'
      break
  }
  return result
}

const messageData = computed(() => {
  let result = {
    icon: '',
    title: ''
  }
  switch (props.messageKey) {
    case 'loading':
      result['icon'] = getIcon('loading')
      result['title'] = t('msg.long_loading')
      break
    case 'noResult':
      result['icon'] = getIcon('warning')
      result['title'] = t('msg.no_results')
      break
    case 'chartFailed':
      result['icon'] = getIcon('warning')
      result['title'] = t('msg.chart_failed')
      break
    case 'noResults':
      result['icon'] = getIcon('warning')
      result['title'] = t('msg.no_results')
      break
    case 'queryFailed':
      result['icon'] = getIcon('warning')
      result['title'] = t('msg.query_failed')
      break
    case 'noPermission':
      result['icon'] = getIcon('warning')
      result['title'] = t('msg.no_permission')
      break
    case 'clickNumberAboveToShow':
      result['icon'] = getIcon('info')
      result['title'] = t('manage_analysis.click_number_above_to_show')
      break
  }
  return result
})
</script>
<template>
  <div class="message">
    <div class="message__icon" :class="{ loading: props.messageKey === 'loading' }">
      <font-awesome-icon :icon="messageData['icon']" />
    </div>
    <div class="message__title">{{ messageData['title'] }}</div>
  </div>
</template>
<style lang="scss" scoped>
@keyframes rotate360 {
  100% {
    transform: rotate(360deg);
  }
}
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  padding: 20px;
  margin-bottom: 30px;
  color: #dc3545;
  border-radius: 5px;
  background-color: #f9fafc;
  &__icon {
    margin-right: 8px;
    &.loading {
      svg {
        animation: rotate360 2s infinite linear;
      }
    }
  }
}
</style>
