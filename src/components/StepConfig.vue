<script setup>
import { computed } from 'vue'
import DotsSM from '@/components/Dots/DotsSM.vue'
import { useI18n } from 'vue-i18n'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
const { t } = useI18n()

const props = defineProps({
  stepIndex: {
    type: Number,
    default: 1
  }
})

//階段資料config
const tableConfig = computed(() => {
  const config = RFM_NAPL_step_config
  config[1]['step_name'] = t('member_life_cycles.active')
  config[2]['step_name'] = t('member_life_cycles.newBorn')
  config[3]['step_name'] = t('member_life_cycles.growing')
  config[4]['step_name'] = t('member_life_cycles.churning_return')
  config[5]['step_name'] = t('member_life_cycles.churned_return')
  config[6]['step_name'] = t('member_life_cycles.churning')
  config[7]['step_name'] = t('member_life_cycles.churned')
  return config
})
</script>
<template>
  <div class="step-name-box">
    <!-- 階段名稱內容 -->
    <font-awesome-icon
      class="step-name-box__icon"
      :icon="tableConfig[props.stepIndex]['step_vue_icon']"
    />
    <div class="step-name-box__title">{{ tableConfig[props.stepIndex]['step_name'] }}</div>
    <DotsSM
      class="step-name-box__dots"
      :class="tableConfig[props.stepIndex]['step_vue_dot_color']"
    />
  </div>
</template>
<style lang="scss" scoped>
.step-name-box {
  display: flex;
  flex-wrap: wrap;
  color: #404040;
  &__icon {
    margin-right: 6px;
    margin-top: 4px;
    flex-shrink: 0;
  }
  &__title {
    margin-right: 6px;
  }
  &__dots {
    flex-shrink: 0;
    margin-top: 6px;
  }
}
</style>
