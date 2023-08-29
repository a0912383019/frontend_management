<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import { apiQueryTagsGameRank } from '@/api/gameTagAnalysis.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const gameTagAnalysisStore = useGameTagAnalysis()
const { filterTimestamp } = storeToRefs(gameTagAnalysisStore)

//api是否成功
const apiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

// 取得資料
const queryTagsGameRank = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryTagsGameRank({
      hall_name: activeHall.hall_code,
      tag_game_analysis_date: gameTagAnalysisStore['filterFormData']['date'],
      search_tag: gameTagAnalysisStore['filterFormData']['searchTag'],
      exclude_tag: gameTagAnalysisStore['filterFormData']['excludeTag'],
      locale: i18nLocale.value
    })
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

onMounted(() => {
  nextTick(() => {
    queryTagsGameRank()
  })
})

watch(
  () => filterTimestamp.value,
  () => {
    console.log('change')
    // queryTagsGameRank()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('game_tag_analysis.game_bet_amount_rank')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 20 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  position: relative;
}
</style>
